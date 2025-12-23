import { Inspection, InspectionStatus } from '@/lib/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { CheckCircle, XCircle, ClipboardText, Calendar } from '@phosphor-icons/react'

interface InspectionSummaryProps {
  inspection: Inspection
  onComplete: () => void
}

export function InspectionSummary({ inspection, onComplete }: InspectionSummaryProps) {
  const defects = inspection.answers.filter(a => !a.answer)
  const criticalDefects = defects.filter(d => d.severity === 'critical')
  const minorDefects = defects.filter(d => d.severity === 'minor')

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
        return 'bg-success/10 border-success'
      case 'minor':
        return 'bg-warning/10 border-warning'
      case 'critical':
        return 'bg-destructive/10 border-destructive'
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <Card className={`border-2 ${getStatusBg(inspection.status)}`}>
          <CardHeader className="text-center space-y-4 pb-6">
            <div className="flex justify-center">
              {inspection.status === 'ok' ? (
                <div className="p-4 rounded-full bg-success/20">
                  <CheckCircle size={64} weight="fill" className="text-success" />
                </div>
              ) : (
                <div className={`p-4 rounded-full ${
                  inspection.status === 'critical' ? 'bg-destructive/20' : 'bg-warning/20'
                }`}>
                  <XCircle size={64} weight="fill" className={getStatusColor(inspection.status)} />
                </div>
              )}
            </div>
            <div>
              <CardTitle className="text-3xl mb-2">
                {inspection.status === 'ok' ? 'Inspection Complete' : 'Inspection Complete - Issues Found'}
              </CardTitle>
              <p className="text-muted-foreground">
                {inspection.status === 'ok'
                  ? 'Equipment is cleared for operation'
                  : inspection.status === 'critical'
                  ? 'Equipment has critical issues - DO NOT OPERATE'
                  : 'Equipment has minor issues - report to supervisor'}
              </p>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-muted-foreground mb-1">Unit ID</div>
                <div className="font-mono font-semibold text-lg">{inspection.unitId}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">Type</div>
                <Badge variant="secondary" className="text-sm">
                  {inspection.equipmentType}
                </Badge>
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-success">
                  {inspection.answers.filter(a => a.answer).length}
                </div>
                <div className="text-sm text-muted-foreground">Passed</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-warning">
                  {minorDefects.length}
                </div>
                <div className="text-sm text-muted-foreground">Minor</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-destructive">
                  {criticalDefects.length}
                </div>
                <div className="text-sm text-muted-foreground">Critical</div>
              </div>
            </div>

            {defects.length > 0 && (
              <>
                <Separator />
                <div className="space-y-3">
                  <h3 className="font-semibold flex items-center gap-2">
                    <ClipboardText size={20} />
                    Reported Issues
                  </h3>
                  <div className="space-y-3">
                    {defects.map((defect, idx) => (
                      <div
                        key={idx}
                        className={`p-4 rounded-lg border-l-4 ${
                          defect.severity === 'critical'
                            ? 'border-l-destructive bg-destructive/5'
                            : 'border-l-warning bg-warning/5'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="text-sm font-medium flex-1">
                            {defect.questionText}
                          </div>
                          <Badge
                            variant={defect.severity === 'critical' ? 'destructive' : 'outline'}
                            className="text-xs"
                          >
                            {defect.severity === 'critical' ? 'Critical' : 'Minor'}
                          </Badge>
                        </div>
                        {defect.comment && (
                          <div className="text-sm text-muted-foreground">
                            {defect.comment}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            <Separator />

            <div className="flex items-center gap-2 text-sm text-muted-foreground justify-center">
              <Calendar size={16} />
              <span>
                {new Date(inspection.timestamp).toLocaleString('en-US', {
                  dateStyle: 'medium',
                  timeStyle: 'short'
                })}
              </span>
            </div>
          </CardContent>
        </Card>

        <button
          onClick={onComplete}
          className="w-full py-4 bg-primary text-primary-foreground rounded-lg font-semibold text-lg hover:bg-primary/90 transition-colors"
        >
          Done
        </button>
      </div>
    </div>
  )
}
