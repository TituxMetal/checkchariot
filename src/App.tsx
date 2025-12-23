import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Equipment, Inspection, InspectionQuestion, QuestionResponse, InspectionStatus, MaintenanceAction } from '@/lib/types'
import { getRandomQuestions } from '@/lib/questions'
import { getEquipmentById } from '@/lib/equipment'
import { EquipmentSelector } from '@/components/EquipmentSelector'
import { InspectionQuiz } from '@/components/InspectionQuiz'
import { InspectionSummary } from '@/components/InspectionSummary'
import { SupervisorDashboard } from '@/components/SupervisorDashboard'
import { MaintenanceActions } from '@/components/MaintenanceActions'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Toaster } from '@/components/ui/sonner'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

type AppScreen = 'selection' | 'quiz' | 'summary'

function App() {
  const [inspections, setInspections] = useKV<Inspection[]>('inspections-v2', [])
  const [maintenanceActions, setMaintenanceActions] = useKV<MaintenanceAction[]>('maintenance-actions-v2', [])
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('selection')
  const [currentEquipment, setCurrentEquipment] = useState<Equipment | null>(null)
  const [currentQuestions, setCurrentQuestions] = useState<InspectionQuestion[]>([])
  const [completedInspection, setCompletedInspection] = useState<Inspection | null>(null)
  const [mode, setMode] = useState<'operator' | 'supervisor' | 'maintenance'>('operator')
  const [showDuplicateDialog, setShowDuplicateDialog] = useState(false)
  const [pendingEquipment, setPendingEquipment] = useState<Equipment | null>(null)

  const allInspections = inspections || []
  const allMaintenanceActions = maintenanceActions || []

  const handleEquipmentSelect = (equipment: Equipment) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const todayTimestamp = today.getTime()

    const existingToday = allInspections.find(
      i =>
        i.equipmentId === equipment.id &&
        i.timestamp >= todayTimestamp
    )

    if (existingToday) {
      setPendingEquipment(equipment)
      setShowDuplicateDialog(true)
      return
    }

    startInspection(equipment)
  }

  const startInspection = (equipment: Equipment) => {
    setCurrentEquipment(equipment)
    setCurrentQuestions(getRandomQuestions(equipment.category, 8))
    setCurrentScreen('quiz')
    setShowDuplicateDialog(false)
    setPendingEquipment(null)
  }

  const handleInspectionComplete = async (responses: QuestionResponse[]) => {
    if (!currentEquipment) return

    const hasDefects = responses.some(r => !r.isOk)
    const hasCritical = responses.some(r => !r.isOk && r.severity === 'critical')

    let status: InspectionStatus = 'ok'
    if (hasCritical) {
      status = 'critical'
    } else if (hasDefects) {
      status = 'warning'
    }

    const user = await window.spark.user()
    
    const inspection: Inspection = {
      id: `INS-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      equipmentId: currentEquipment.id,
      equipmentName: currentEquipment.name,
      category: currentEquipment.category,
      timestamp: Date.now(),
      operatorName: user?.login || 'Opérateur',
      responses,
      status
    }

    setInspections(current => [inspection, ...(current || [])])
    
    const defects = responses.filter(r => !r.isOk)
    if (defects.length > 0) {
      const newActions: MaintenanceAction[] = defects.map(defect => ({
        id: `MA-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        inspectionId: inspection.id,
        equipmentId: currentEquipment.id,
        equipmentName: currentEquipment.name,
        defectDescription: `${defect.questionText}: ${defect.answerText}${defect.comment ? ` - ${defect.comment}` : ''}`,
        severity: defect.severity || 'minor',
        status: 'pending',
        createdAt: Date.now()
      }))
      
      setMaintenanceActions(current => [...newActions, ...(current || [])])
    }
    
    setCompletedInspection(inspection)
    setCurrentScreen('summary')

    if (status === 'critical') {
      toast.error('Défauts critiques détectés - équipement hors service', {
        description: 'Contactez immédiatement la maintenance'
      })
    } else if (status === 'warning') {
      toast.warning('Défauts mineurs signalés', {
        description: 'Signalez au superviseur avant utilisation'
      })
    } else {
      toast.success('Inspection terminée - équipement opérationnel')
    }
  }

  const handleReset = () => {
    setCurrentScreen('selection')
    setCurrentEquipment(null)
    setCurrentQuestions([])
    setCompletedInspection(null)
  }

  const handleUpdateMaintenanceAction = (actionId: string, updates: Partial<MaintenanceAction>) => {
    setMaintenanceActions(current => 
      (current || []).map(action =>
        action.id === actionId ? { ...action, ...updates } : action
      )
    )
  }

  return (
    <>
      <div className="min-h-screen bg-background text-foreground">
        <Tabs value={mode} onValueChange={(v) => setMode(v as typeof mode)}>
          <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border z-50">
            <div className="container mx-auto px-4">
              <div className="flex items-center justify-between py-4">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight">CheckChariot</h1>
                  <p className="text-sm text-muted-foreground">
                    Système d'inspection de sécurité
                  </p>
                </div>
                <TabsList>
                  <TabsTrigger value="operator">Opérateur</TabsTrigger>
                  <TabsTrigger value="supervisor">Superviseur</TabsTrigger>
                  <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
                </TabsList>
              </div>
            </div>
          </div>

          <TabsContent value="operator" className="mt-0">
            {currentScreen === 'selection' && (
              <EquipmentSelector onSelect={handleEquipmentSelect} />
            )}

            {currentScreen === 'quiz' && currentEquipment && (
              <InspectionQuiz
                equipment={currentEquipment}
                questions={currentQuestions}
                onComplete={handleInspectionComplete}
                onCancel={handleReset}
              />
            )}

            {currentScreen === 'summary' && completedInspection && (
              <InspectionSummary
                inspection={completedInspection}
                onComplete={handleReset}
              />
            )}
          </TabsContent>

          <TabsContent value="supervisor" className="mt-0">
            <SupervisorDashboard inspections={allInspections} />
          </TabsContent>

          <TabsContent value="maintenance" className="mt-0">
            <div className="min-h-screen bg-background p-4 md:p-8">
              <div className="max-w-7xl mx-auto">
                <MaintenanceActions
                  actions={allMaintenanceActions}
                  onUpdateAction={handleUpdateMaintenanceAction}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={showDuplicateDialog} onOpenChange={setShowDuplicateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Inspection déjà effectuée</DialogTitle>
            <DialogDescription>
              Cet équipement ({pendingEquipment?.name}) a déjà été inspecté aujourd'hui. 
              Voulez-vous continuer avec une nouvelle inspection ?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowDuplicateDialog(false)
              setPendingEquipment(null)
            }}>
              Annuler
            </Button>
            <Button onClick={() => {
              if (pendingEquipment) {
                startInspection(pendingEquipment)
              }
            }}>
              Continuer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Toaster />
    </>
  )
}

export default App
