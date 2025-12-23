import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Inspection, ForkliftType, InspectionAnswer, InspectionStatus, MaintenanceAction } from '@/lib/types'
import { getRandomQuestions } from '@/lib/questions'
import { EquipmentSelector } from '@/components/EquipmentSelector'
import { InspectionQuiz } from '@/components/InspectionQuiz'
import { InspectionSummary } from '@/components/InspectionSummary'
import { SupervisorDashboard } from '@/components/SupervisorDashboard'
import { MaintenanceActions } from '@/components/MaintenanceActions'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Toaster } from '@/components/ui/sonner'
import { toast } from 'sonner'

type AppScreen = 'selection' | 'quiz' | 'summary'

function App() {
  const [inspections, setInspections] = useKV<Inspection[]>('inspections', [])
  const [maintenanceActions, setMaintenanceActions] = useKV<MaintenanceAction[]>('maintenance-actions', [])
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('selection')
  const [currentEquipment, setCurrentEquipment] = useState<{
    type: ForkliftType
    unitId: string
  } | null>(null)
  const [currentQuestions, setCurrentQuestions] = useState<any[]>([])
  const [completedInspection, setCompletedInspection] = useState<Inspection | null>(null)
  const [mode, setMode] = useState<'operator' | 'supervisor' | 'maintenance'>('operator')

  const allInspections = inspections || []
  const allMaintenanceActions = maintenanceActions || []

  const handleEquipmentSelect = (type: ForkliftType, unitId: string) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const todayTimestamp = today.getTime()

    const existingToday = allInspections.find(
      i =>
        i.equipmentType === type &&
        i.unitId === unitId &&
        i.timestamp >= todayTimestamp
    )

    if (existingToday) {
      const confirmContinue = window.confirm(
        `This equipment (${unitId}) was already inspected today at ${new Date(
          existingToday.timestamp
        ).toLocaleTimeString()}. Continue with new inspection?`
      )
      if (!confirmContinue) return
    }

    setCurrentEquipment({ type, unitId })
    setCurrentQuestions(getRandomQuestions(type, 10))
    setCurrentScreen('quiz')
  }

  const handleInspectionComplete = async (answers: InspectionAnswer[]) => {
    if (!currentEquipment) return

    const hasDefects = answers.some(a => !a.answer)
    const hasCritical = answers.some(a => !a.answer && a.severity === 'critical')

    let status: InspectionStatus = 'ok'
    if (hasCritical) {
      status = 'critical'
    } else if (hasDefects) {
      status = 'minor'
    }

    const user = await window.spark.user()
    
    const inspection: Inspection = {
      id: `INS-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      equipmentType: currentEquipment.type,
      unitId: currentEquipment.unitId,
      timestamp: Date.now(),
      operatorName: user?.login || 'Operator',
      answers,
      status
    }

    setInspections(current => [inspection, ...(current || [])])
    
    const defects = answers.filter(a => !a.answer)
    if (defects.length > 0) {
      const newActions: MaintenanceAction[] = defects.map(defect => ({
        id: `MA-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        inspectionId: inspection.id,
        defectDescription: `${defect.questionText}${defect.comment ? `: ${defect.comment}` : ''}`,
        severity: defect.severity || 'minor',
        status: 'pending',
        createdAt: Date.now(),
        equipmentType: currentEquipment.type,
        unitId: currentEquipment.unitId
      }))
      
      setMaintenanceActions(current => [...newActions, ...(current || [])])
    }
    
    setCompletedInspection(inspection)
    setCurrentScreen('summary')

    if (status === 'critical') {
      toast.error('Critical issues found - equipment out of service', {
        description: 'Contact maintenance immediately'
      })
    } else if (status === 'minor') {
      toast.warning('Minor issues reported', {
        description: 'Report to supervisor before operation'
      })
    } else {
      toast.success('Inspection complete - equipment cleared for operation')
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
        <Tabs value={mode} onValueChange={(v) => setMode(v as 'operator' | 'supervisor' | 'maintenance')}>
          <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border z-50">
            <div className="container mx-auto px-4">
              <div className="flex items-center justify-between py-4">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight">CheckChariot</h1>
                  <p className="text-sm text-muted-foreground">
                    Forklift Safety Inspection System
                  </p>
                </div>
                <TabsList>
                  <TabsTrigger value="operator">Operator</TabsTrigger>
                  <TabsTrigger value="supervisor">Supervisor</TabsTrigger>
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
                questions={currentQuestions}
                equipmentType={currentEquipment.type}
                unitId={currentEquipment.unitId}
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
      <Toaster />
    </>
  )
}

export default App