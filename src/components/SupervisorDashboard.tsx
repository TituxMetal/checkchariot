import { useState, useMemo } from 'react'
import { Inspection } from '@/lib/types'
import { EQUIPMENT_LIST } from '@/lib/equipment'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { CheckCircle, Warning, XCircle, ClipboardText } from '@phosphor-icons/react'
import { format, isToday, isThisWeek, isThisMonth, startOfDay } from 'date-fns'
import { fr } from 'date-fns/locale'

interface Props {
  inspections: Inspection[]
}

export function SupervisorDashboard({ inspections }: Props) {
  const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'week' | 'month'>('today')

  const filteredInspections = useMemo(() => {
    return inspections.filter(inspection => {
      const inspectionDate = new Date(inspection.timestamp)
      if (selectedPeriod === 'today') return isToday(inspectionDate)
      if (selectedPeriod === 'week') return isThisWeek(inspectionDate, { locale: fr })
      if (selectedPeriod === 'month') return isThisMonth(inspectionDate)
      return false
    })
  }, [inspections, selectedPeriod])

  const stats = useMemo(() => {
    const total = filteredInspections.length
    const ok = filteredInspections.filter(i => i.status === 'ok').length
    const warning = filteredInspections.filter(i => i.status === 'warning').length
    const critical = filteredInspections.filter(i => i.status === 'critical').length
    
    return { total, ok, warning, critical }
  }, [filteredInspections])

  const equipmentStatus = useMemo(() => {
    const statusMap = new Map<string, { equipment: typeof EQUIPMENT_LIST[0], latestInspection: Inspection | null }>()
    
    EQUIPMENT_LIST.forEach(eq => {
      statusMap.set(eq.id, { equipment: eq, latestInspection: null })
    })

    const todayInspections = inspections.filter(i => isToday(new Date(i.timestamp)))
    
    todayInspections.forEach(inspection => {
      const current = statusMap.get(inspection.equipmentId)
      if (current) {
        if (!current.latestInspection || inspection.timestamp > current.latestInspection.timestamp) {
          current.latestInspection = inspection
        }
      }
    })

    return Array.from(statusMap.values())
  }, [inspections])

  const getStatusColor = (status: Inspection['status']) => {
    if (status === 'ok') return 'text-success'
    if (status === 'warning') return 'text-warning'
    return 'text-destructive'
  }

  const getStatusIcon = (status: Inspection['status']) => {
    if (status === 'ok') return <CheckCircle weight="fill" className={getStatusColor(status)} />
    if (status === 'warning') return <Warning weight="fill" className={getStatusColor(status)} />
    return <XCircle weight="fill" className={getStatusColor(status)} />
  }

  const getEquipmentStatusBadge = (latestInspection: Inspection | null) => {
    if (!latestInspection) {
      return <Badge variant="outline">Non inspecté</Badge>
    }
    if (latestInspection.status === 'ok') {
      return <Badge className="bg-success text-success-foreground">Opérationnel</Badge>
    }
    if (latestInspection.status === 'warning') {
      return <Badge className="bg-warning text-warning-foreground">Attention</Badge>
    }
    return <Badge variant="destructive">Hors service</Badge>
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">Tableau de bord superviseur</h2>
          <p className="text-muted-foreground">
            Vue d'ensemble des inspections et de l'état de la flotte
          </p>
        </div>

        <Tabs value={selectedPeriod} onValueChange={(v) => setSelectedPeriod(v as typeof selectedPeriod)}>
          <TabsList className="mb-6">
            <TabsTrigger value="today">Aujourd'hui</TabsTrigger>
            <TabsTrigger value="week">Cette semaine</TabsTrigger>
            <TabsTrigger value="month">Ce mois</TabsTrigger>
          </TabsList>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Total</span>
                <ClipboardText className="text-muted-foreground" size={20} />
              </div>
              <div className="text-3xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground mt-1">Inspections réalisées</p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">OK</span>
                <CheckCircle className="text-success" size={20} weight="fill" />
              </div>
              <div className="text-3xl font-bold text-success">{stats.ok}</div>
              <p className="text-xs text-muted-foreground mt-1">Équipements opérationnels</p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Attention</span>
                <Warning className="text-warning" size={20} weight="fill" />
              </div>
              <div className="text-3xl font-bold text-warning">{stats.warning}</div>
              <p className="text-xs text-muted-foreground mt-1">Défauts mineurs</p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Critique</span>
                <XCircle className="text-destructive" size={20} weight="fill" />
              </div>
              <div className="text-3xl font-bold text-destructive">{stats.critical}</div>
              <p className="text-xs text-muted-foreground mt-1">Hors service</p>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="font-semibold mb-4">État de la flotte (aujourd'hui)</h3>
              <div className="space-y-2">
                {equipmentStatus.map(({ equipment, latestInspection }) => (
                  <div
                    key={equipment.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="font-medium">{equipment.name}</div>
                      <div className="text-xs font-mono text-muted-foreground">{equipment.id}</div>
                    </div>
                    <div>
                      {getEquipmentStatusBadge(latestInspection)}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold mb-4">Historique des inspections</h3>
              <div className="space-y-2">
                {filteredInspections.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    Aucune inspection pour cette période
                  </p>
                ) : (
                  <Accordion type="single" collapsible className="space-y-2">
                    {filteredInspections.map((inspection) => (
                      <AccordionItem key={inspection.id} value={inspection.id} className="border rounded-lg px-4">
                        <AccordionTrigger className="hover:no-underline py-3">
                          <div className="flex items-center gap-3 flex-1 text-left">
                            <div className="shrink-0">
                              {getStatusIcon(inspection.status)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-medium truncate">{inspection.equipmentName}</div>
                              <div className="text-xs text-muted-foreground">
                                {format(inspection.timestamp, 'PPp', { locale: fr })}
                              </div>
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="pb-4">
                          <div className="space-y-3 pt-2">
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div>
                                <span className="text-muted-foreground">Opérateur:</span>
                                <p className="font-medium">{inspection.operatorName}</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">ID:</span>
                                <p className="font-mono text-xs">{inspection.equipmentId}</p>
                              </div>
                            </div>
                            
                            {inspection.responses.filter(r => !r.isOk).length > 0 && (
                              <div>
                                <p className="text-sm font-medium mb-2">Défauts signalés:</p>
                                <div className="space-y-2">
                                  {inspection.responses.filter(r => !r.isOk).map((response, idx) => (
                                    <div key={idx} className="text-sm bg-muted/50 rounded p-2">
                                      <p className="font-medium">{response.questionText}</p>
                                      <p className="text-muted-foreground text-xs">{response.answerText}</p>
                                      {response.comment && (
                                        <p className="text-xs italic mt-1">"{response.comment}"</p>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                )}
              </div>
            </Card>
          </div>
        </Tabs>
      </div>
    </div>
  )
}
