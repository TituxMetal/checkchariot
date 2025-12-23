import { useState } from 'react'
import { MaintenanceAction, MaintenanceActionStatus } from '@/lib/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import {
  Wrench,
  CheckCircle,
  Clock,
  XCircle,
  Warning,
  Play,
  Check
} from '@phosphor-icons/react'

interface MaintenanceActionsProps {
  actions: MaintenanceAction[]
  onUpdateAction: (actionId: string, updates: Partial<MaintenanceAction>) => void
}

export function MaintenanceActions({ actions, onUpdateAction }: MaintenanceActionsProps) {
  const [selectedAction, setSelectedAction] = useState<MaintenanceAction | null>(null)
  const [resolution, setResolution] = useState('')
  const [assignee, setAssignee] = useState('')
  const [statusFilter, setStatusFilter] = useState<MaintenanceActionStatus | 'all'>('all')

  const filteredActions = statusFilter === 'all'
    ? actions
    : actions.filter(a => a.status === statusFilter)

  const sortedActions = [...filteredActions].sort((a, b) => {
    if (a.status === 'pending' && b.status !== 'pending') return -1
    if (a.status !== 'pending' && b.status === 'pending') return 1
    if (a.severity === 'critical' && b.severity !== 'critical') return -1
    if (a.severity !== 'critical' && b.severity === 'critical') return 1
    return b.createdAt - a.createdAt
  })

  const getStatusIcon = (status: MaintenanceActionStatus) => {
    switch (status) {
      case 'pending':
        return <Clock size={16} weight="fill" className="text-warning" />
      case 'in-progress':
        return <Play size={16} weight="fill" className="text-accent" />
      case 'completed':
        return <CheckCircle size={16} weight="fill" className="text-success" />
      case 'cancelled':
        return <XCircle size={16} weight="fill" className="text-muted-foreground" />
    }
  }

  const getStatusBadgeVariant = (status: MaintenanceActionStatus) => {
    switch (status) {
      case 'pending':
        return 'outline'
      case 'in-progress':
        return 'default'
      case 'completed':
        return 'outline'
      case 'cancelled':
        return 'secondary'
    }
  }

  const handleStartWork = async (action: MaintenanceAction) => {
    const user = await window.spark.user()
    onUpdateAction(action.id, {
      status: 'in-progress',
      assignedTo: assignee || user?.login || 'Maintenance Team'
    })
    setAssignee('')
  }

  const handleComplete = async (action: MaintenanceAction) => {
    if (!resolution.trim()) return
    const user = await window.spark.user()
    onUpdateAction(action.id, {
      status: 'completed',
      resolution: resolution.trim(),
      resolvedAt: Date.now(),
      resolvedBy: user?.login || 'Supervisor'
    })
    setResolution('')
    setSelectedAction(null)
  }

  const handleCancel = (action: MaintenanceAction) => {
    onUpdateAction(action.id, { status: 'cancelled' })
  }

  const stats = {
    pending: actions.filter(a => a.status === 'pending').length,
    inProgress: actions.filter(a => a.status === 'in-progress').length,
    completed: actions.filter(a => a.status === 'completed').length,
    critical: actions.filter(a => a.severity === 'critical' && a.status !== 'completed').length
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending
            </CardTitle>
            <Clock size={20} className="text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.pending}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              In Progress
            </CardTitle>
            <Play size={20} className="text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.inProgress}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Completed
            </CardTitle>
            <CheckCircle size={20} className="text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-success">{stats.completed}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Critical Open
            </CardTitle>
            <Warning size={20} className="text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-destructive">{stats.critical}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Wrench size={24} />
              Maintenance Actions
            </CardTitle>
            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as MaintenanceActionStatus | 'all')}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {sortedActions.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Wrench size={48} className="mx-auto mb-4 opacity-50" />
              <p>No maintenance actions to display</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Status</TableHead>
                    <TableHead>Unit</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Issue</TableHead>
                    <TableHead>Assigned</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedActions.map((action) => (
                    <TableRow key={action.id}>
                      <TableCell>
                        <Badge
                          variant={getStatusBadgeVariant(action.status)}
                          className={`flex items-center gap-1 w-fit ${
                            action.status === 'completed' ? 'border-success text-success' : ''
                          } ${
                            action.status === 'in-progress' ? 'bg-accent text-accent-foreground' : ''
                          }`}
                        >
                          {getStatusIcon(action.status)}
                          <span className="capitalize">{action.status.replace('-', ' ')}</span>
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="font-mono font-medium">{action.unitId}</div>
                        <Badge variant="secondary" className="text-xs mt-1">
                          {action.equipmentType}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={action.severity === 'critical' ? 'destructive' : 'outline'}
                          className={action.severity === 'minor' ? 'border-warning text-warning' : ''}
                        >
                          {action.severity === 'critical' ? 'Critical' : 'Minor'}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <div className="text-sm">{action.defectDescription}</div>
                      </TableCell>
                      <TableCell className="text-sm">
                        {action.assignedTo || <span className="text-muted-foreground">Unassigned</span>}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(action.createdAt).toLocaleString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: 'numeric',
                          minute: '2-digit'
                        })}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          {action.status === 'pending' && (
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button size="sm" variant="outline" onClick={() => setSelectedAction(action)}>
                                  <Play size={16} className="mr-1" />
                                  Start
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Start Maintenance Work</DialogTitle>
                                  <DialogDescription>
                                    Assign this maintenance action and begin work.
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                  <div className="space-y-2">
                                    <label className="text-sm font-medium">Assign to (optional)</label>
                                    <Input
                                      placeholder="Technician name"
                                      value={assignee}
                                      onChange={(e) => setAssignee(e.target.value)}
                                    />
                                  </div>
                                  <Button onClick={() => handleStartWork(action)} className="w-full">
                                    Start Work
                                  </Button>
                                </div>
                              </DialogContent>
                            </Dialog>
                          )}
                          {action.status === 'in-progress' && (
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button size="sm" onClick={() => setSelectedAction(action)}>
                                  <Check size={16} className="mr-1" />
                                  Complete
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Complete Maintenance Action</DialogTitle>
                                  <DialogDescription>
                                    Describe the resolution and mark this action as completed.
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                  <div className="space-y-2">
                                    <label className="text-sm font-medium">Resolution Notes *</label>
                                    <Textarea
                                      placeholder="Describe what was done to resolve the issue..."
                                      value={resolution}
                                      onChange={(e) => setResolution(e.target.value)}
                                      rows={4}
                                    />
                                  </div>
                                  <Button
                                    onClick={() => handleComplete(action)}
                                    disabled={!resolution.trim()}
                                    className="w-full"
                                  >
                                    Mark as Completed
                                  </Button>
                                </div>
                              </DialogContent>
                            </Dialog>
                          )}
                          {action.status === 'completed' && action.resolution && (
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button size="sm" variant="ghost">
                                  View
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Resolution Details</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                  <div>
                                    <div className="text-sm font-medium text-muted-foreground mb-1">Issue</div>
                                    <div className="text-sm">{action.defectDescription}</div>
                                  </div>
                                  <div>
                                    <div className="text-sm font-medium text-muted-foreground mb-1">Resolution</div>
                                    <div className="text-sm">{action.resolution}</div>
                                  </div>
                                  <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                      <div className="text-muted-foreground mb-1">Resolved By</div>
                                      <div>{action.resolvedBy}</div>
                                    </div>
                                    <div>
                                      <div className="text-muted-foreground mb-1">Resolved At</div>
                                      <div>
                                        {action.resolvedAt &&
                                          new Date(action.resolvedAt).toLocaleString('en-US', {
                                            dateStyle: 'medium',
                                            timeStyle: 'short'
                                          })}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                          )}
                          {(action.status === 'pending' || action.status === 'in-progress') && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleCancel(action)}
                            >
                              <XCircle size={16} />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
