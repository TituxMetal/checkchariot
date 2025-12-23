import { useState } from 'react'
import { MaintenanceAction } from '@/lib/types'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Warning, XCircle, CheckCircle, Wrench } from '@phosphor-icons/react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

interface Props {
  actions: MaintenanceAction[]
  onUpdateAction: (actionId: string, updates: Partial<MaintenanceAction>) => void
}

export function MaintenanceActions({ actions, onUpdateAction }: Props) {
  const [filterStatus, setFilterStatus] = useState<'all' | MaintenanceAction['status']>('all')
  const [editingAction, setEditingAction] = useState<string | null>(null)
  const [notes, setNotes] = useState('')

  const filteredActions = actions.filter(action => 
    filterStatus === 'all' || action.status === filterStatus
  )

  const pendingCount = actions.filter(a => a.status === 'pending').length
  const inProgressCount = actions.filter(a => a.status === 'in-progress').length
  const completedCount = actions.filter(a => a.status === 'completed').length

  const handleStatusChange = (actionId: string, newStatus: MaintenanceAction['status']) => {
    const updates: Partial<MaintenanceAction> = { status: newStatus }
    if (newStatus === 'completed') {
      updates.completedAt = Date.now()
    }
    onUpdateAction(actionId, updates)
    setEditingAction(null)
  }

  const handleSaveNotes = (actionId: string) => {
    onUpdateAction(actionId, { notes })
    setEditingAction(null)
    setNotes('')
  }

  const getSeverityBadge = (severity: MaintenanceAction['severity']) => {
    if (severity === 'critical') {
      return <Badge variant="destructive">Critique</Badge>
    }
    return <Badge className="bg-warning text-warning-foreground">Mineur</Badge>
  }

  const getStatusBadge = (status: MaintenanceAction['status']) => {
    if (status === 'pending') {
      return <Badge variant="outline">En attente</Badge>
    }
    if (status === 'in-progress') {
      return <Badge variant="secondary">En cours</Badge>
    }
    return <Badge className="bg-success text-success-foreground">Terminé</Badge>
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Actions de maintenance</h2>
        <p className="text-muted-foreground">
          Gestion des défauts et interventions sur la flotte
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">En attente</span>
            <Warning className="text-warning" size={20} weight="fill" />
          </div>
          <div className="text-3xl font-bold">{pendingCount}</div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">En cours</span>
            <Wrench className="text-primary" size={20} weight="fill" />
          </div>
          <div className="text-3xl font-bold">{inProgressCount}</div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Terminé</span>
            <CheckCircle className="text-success" size={20} weight="fill" />
          </div>
          <div className="text-3xl font-bold">{completedCount}</div>
        </Card>
      </div>

      <Tabs value={filterStatus} onValueChange={(v) => setFilterStatus(v as typeof filterStatus)}>
        <TabsList>
          <TabsTrigger value="all">Tous</TabsTrigger>
          <TabsTrigger value="pending">En attente</TabsTrigger>
          <TabsTrigger value="in-progress">En cours</TabsTrigger>
          <TabsTrigger value="completed">Terminé</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="space-y-4">
        {filteredActions.length === 0 ? (
          <Card className="p-8">
            <p className="text-center text-muted-foreground">
              Aucune action de maintenance pour ce filtre
            </p>
          </Card>
        ) : (
          filteredActions.map((action) => (
            <Card key={action.id} className="p-6">
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold">{action.equipmentName}</h3>
                      <span className="text-xs font-mono text-muted-foreground">
                        {action.equipmentId}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      {action.defectDescription}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {getSeverityBadge(action.severity)}
                      {getStatusBadge(action.status)}
                    </div>
                  </div>
                  
                  <div className="text-right text-sm text-muted-foreground shrink-0">
                    <div>Créé le</div>
                    <div>{format(action.createdAt, 'PP', { locale: fr })}</div>
                    <div className="text-xs">{format(action.createdAt, 'HH:mm')}</div>
                  </div>
                </div>

                {action.status !== 'completed' && (
                  <div className="border-t pt-4">
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Select
                        value={action.status}
                        onValueChange={(value) => handleStatusChange(action.id, value as MaintenanceAction['status'])}
                      >
                        <SelectTrigger className="w-full sm:w-[200px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">En attente</SelectItem>
                          <SelectItem value="in-progress">En cours</SelectItem>
                          <SelectItem value="completed">Terminé</SelectItem>
                        </SelectContent>
                      </Select>

                      {editingAction === action.id ? (
                        <div className="flex-1 flex gap-2">
                          <Textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Notes d'intervention..."
                            className="resize-none"
                            rows={2}
                          />
                          <div className="flex flex-col gap-2">
                            <Button size="sm" onClick={() => handleSaveNotes(action.id)}>
                              Enregistrer
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setEditingAction(null)
                                setNotes('')
                              }}
                            >
                              Annuler
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <Button
                          variant="outline"
                          onClick={() => {
                            setEditingAction(action.id)
                            setNotes(action.notes || '')
                          }}
                        >
                          Ajouter des notes
                        </Button>
                      )}
                    </div>
                  </div>
                )}

                {action.notes && (
                  <div className="bg-muted/50 rounded p-3">
                    <p className="text-sm font-medium mb-1">Notes:</p>
                    <p className="text-sm text-muted-foreground">{action.notes}</p>
                  </div>
                )}

                {action.completedAt && (
                  <div className="text-sm text-success flex items-center gap-2">
                    <CheckCircle weight="fill" />
                    <span>Terminé le {format(action.completedAt, 'PPP à HH:mm', { locale: fr })}</span>
                  </div>
                )}
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
