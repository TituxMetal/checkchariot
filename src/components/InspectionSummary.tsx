import { Inspection } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, Warning, XCircle } from '@phosphor-icons/react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

interface Props {
  inspection: Inspection
  onComplete: () => void
}

export function InspectionSummary({ inspection, onComplete }: Props) {
  const defects = inspection.responses.filter(r => !r.isOk)
  const criticalDefects = defects.filter(r => r.severity === 'critical')

  const getStatusInfo = () => {
    if (inspection.status === 'critical') {
      return {
        icon: <XCircle size={48} weight="fill" className="text-destructive" />,
        title: 'Équipement hors service',
        description: 'Des défauts critiques ont été détectés. Contactez immédiatement la maintenance.',
        badgeVariant: 'destructive' as const
      }
    }
    if (inspection.status === 'warning') {
      return {
        icon: <Warning size={48} weight="fill" className="text-warning" />,
        title: 'Défauts mineurs détectés',
        description: 'Signalez au superviseur avant utilisation de l\'équipement.',
        badgeVariant: 'secondary' as const
      }
    }
    return {
      icon: <CheckCircle size={48} weight="fill" className="text-success" />,
      title: 'Inspection réussie',
      description: 'Équipement autorisé pour l\'exploitation.',
      badgeVariant: 'default' as const
    }
  }

  const statusInfo = getStatusInfo()

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <Card className="p-8 mb-6">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="mb-4">
              {statusInfo.icon}
            </div>
            <h2 className="text-2xl font-bold mb-2">{statusInfo.title}</h2>
            <p className="text-muted-foreground">
              {statusInfo.description}
            </p>
          </div>

          <div className="bg-muted/50 rounded-lg p-6 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Équipement</span>
              <span className="font-semibold">{inspection.equipmentName}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">ID</span>
              <span className="font-mono text-sm">{inspection.equipmentId}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Opérateur</span>
              <span className="font-semibold">{inspection.operatorName}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Date</span>
              <span className="text-sm">
                {format(inspection.timestamp, 'PPP à HH:mm', { locale: fr })}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Statut</span>
              <Badge variant={statusInfo.badgeVariant}>
                {inspection.status === 'ok' && 'OK'}
                {inspection.status === 'warning' && 'Attention'}
                {inspection.status === 'critical' && 'Critique'}
              </Badge>
            </div>
          </div>

          {defects.length > 0 && (
            <div className="mt-6">
              <h3 className="font-semibold mb-3">Défauts signalés ({defects.length})</h3>
              <div className="space-y-3">
                {defects.map((defect, idx) => (
                  <Card key={idx} className="p-4 border-l-4" style={{
                    borderLeftColor: defect.severity === 'critical' 
                      ? 'hsl(var(--destructive))' 
                      : 'hsl(var(--warning))'
                  }}>
                    <div className="flex items-start gap-3">
                      {defect.severity === 'critical' ? (
                        <XCircle className="text-destructive mt-0.5" weight="fill" />
                      ) : (
                        <Warning className="text-warning mt-0.5" weight="fill" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium mb-1">{defect.questionText}</p>
                        <p className="text-sm text-muted-foreground mb-2">{defect.answerText}</p>
                        {defect.comment && (
                          <p className="text-sm bg-muted/50 rounded p-2 italic">
                            "{defect.comment}"
                          </p>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </Card>

        <div className="flex justify-center">
          <Button size="lg" onClick={onComplete} className="min-w-[200px]">
            Nouvelle inspection
          </Button>
        </div>
      </div>
    </div>
  )
}
