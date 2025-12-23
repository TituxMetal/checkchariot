import { useMemo } from 'react'
import { Inspection, EquipmentStatus, InspectionStatus } from '@/lib/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import {
  ClipboardText,
  CheckCircle,
  Warning,
  XCircle,
  Truck,
  Calendar
} from '@phosphor-icons/react'

interface SupervisorDashboardProps {
  inspections: Inspection[]
}

export function SupervisorDashboard({ inspections }: SupervisorDashboardProps) {
  const stats = useMemo(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const todayTimestamp = today.getTime()

    const todayInspections = inspections.filter(i => i.timestamp >= todayTimestamp)

    const totalToday = todayInspections.length
    const withDefects = todayInspections.filter(i => i.status !== 'ok').length
    const critical = todayInspections.filter(i => i.status === 'critical').length

    const equipmentMap = new Map<string, EquipmentStatus>()
    inspections.forEach(inspection => {
      const key = `${inspection.equipmentType}-${inspection.unitId}`
      const existing = equipmentMap.get(key)
      if (!existing || inspection.timestamp > existing.lastInspection!.timestamp) {
        equipmentMap.set(key, {
          unitId: inspection.unitId,
          type: inspection.equipmentType,
          lastInspection: inspection,
          status: inspection.status
        })
      }
    })

    const equipment = Array.from(equipmentMap.values())

    return {
      totalToday,
      withDefects,
      critical,
      equipment
    }
  }, [inspections])

  const getStatusColor = (status: InspectionStatus) => {
    switch (status) {
      case 'ok':
        return 'text-success'
      case 'minor':
        return 'text-warning'
      case 'critical':
        return 'text-destructive'
    }
  }

  const getStatusBg = (status: InspectionStatus) => {
    switch (status) {
      case 'ok':
        return 'border-l-success'
      case 'minor':
        return 'border-l-warning'
      case 'critical':
        return 'border-l-destructive'
    }
  }

  const getTimeAgo = (timestamp: number) => {
    const hours = Math.floor((Date.now() - timestamp) / (1000 * 60 * 60))
    if (hours < 1) {
      const minutes = Math.floor((Date.now() - timestamp) / (1000 * 60))
      return `${minutes}m ago`
    }
    if (hours < 24) return `${hours}h ago`
    const days = Math.floor(hours / 24)
    return `${days}d ago`
  }

  const sortedInspections = [...inspections].sort((a, b) => b.timestamp - a.timestamp)

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Supervisor Dashboard</h1>
          <p className="text-muted-foreground">Fleet inspection status and history</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Today's Inspections
              </CardTitle>
              <ClipboardText size={20} className="text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.totalToday}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Total inspections completed
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Defects Reported
              </CardTitle>
              <Warning size={20} className="text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-warning">{stats.withDefects}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Equipment needing attention
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Critical Issues
              </CardTitle>
              <XCircle size={20} className="text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-destructive">{stats.critical}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Out of service equipment
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck size={24} />
              Fleet Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stats.equipment.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <ClipboardText size={48} className="mx-auto mb-4 opacity-50" />
                <p>No equipment has been inspected yet</p>
              </div>
            ) : (
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                {stats.equipment.map((eq, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-lg border-l-4 bg-card ${getStatusBg(
                      eq.status
                    )}`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="font-mono font-semibold text-lg">
                          {eq.unitId}
                        </div>
                        <Badge variant="secondary" className="text-xs mt-1">
                          {eq.type}
                        </Badge>
                      </div>
                      {eq.status === 'ok' ? (
                        <CheckCircle size={24} weight="fill" className="text-success" />
                      ) : eq.status === 'critical' ? (
                        <XCircle size={24} weight="fill" className="text-destructive" />
                      ) : (
                        <Warning size={24} weight="fill" className="text-warning" />
                      )}
                    </div>
                    {eq.lastInspection && (
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar size={12} />
                        {getTimeAgo(eq.lastInspection.timestamp)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Inspections</CardTitle>
          </CardHeader>
          <CardContent>
            {sortedInspections.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <ClipboardText size={48} className="mx-auto mb-4 opacity-50" />
                <p>No inspections recorded yet</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Unit ID</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Operator</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Defects</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedInspections.slice(0, 20).map((inspection) => {
                      const defectCount = inspection.answers.filter(a => !a.answer).length
                      return (
                        <TableRow key={inspection.id}>
                          <TableCell className="font-mono font-medium">
                            {inspection.unitId}
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="text-xs">
                              {inspection.equipmentType}
                            </Badge>
                          </TableCell>
                          <TableCell>{inspection.operatorName}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {new Date(inspection.timestamp).toLocaleString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              hour: 'numeric',
                              minute: '2-digit'
                            })}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={inspection.status === 'ok' ? 'outline' : 'destructive'}
                              className={`${
                                inspection.status === 'ok'
                                  ? 'border-success text-success'
                                  : inspection.status === 'minor'
                                  ? 'bg-warning text-warning-foreground'
                                  : ''
                              }`}
                            >
                              {inspection.status === 'ok'
                                ? 'OK'
                                : inspection.status === 'critical'
                                ? 'Critical'
                                : 'Minor Issues'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            {defectCount > 0 && (
                              <span className={getStatusColor(inspection.status)}>
                                {defectCount}
                              </span>
                            )}
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
