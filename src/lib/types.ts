export type ForkliftType = 'CACES-1' | 'CACES-3' | 'CACES-5'

export type InspectionStatus = 'ok' | 'minor' | 'critical'

export type MaintenanceActionStatus = 'pending' | 'in-progress' | 'completed' | 'cancelled'

export interface Equipment {
  id: string
  name: string
  type: ForkliftType
}

export interface AnswerChoice {
  id: string
  text: string
  isCorrect: boolean
  severity?: 'minor' | 'critical'
}

export interface InspectionQuestion {
  id: string
  text: string
  categories: ForkliftType[]
  choices: AnswerChoice[]
}

export interface InspectionAnswer {
  questionId: string
  questionText: string
  selectedChoiceId: string
  selectedChoiceText: string
  isCorrect: boolean
  comment?: string
  severity?: 'minor' | 'critical'
}

export interface MaintenanceAction {
  id: string
  inspectionId: string
  defectDescription: string
  severity: 'minor' | 'critical'
  status: MaintenanceActionStatus
  createdAt: number
  assignedTo?: string
  resolution?: string
  resolvedAt?: number
  resolvedBy?: string
  equipmentType: ForkliftType
  unitId: string
}

export interface Inspection {
  id: string
  equipmentType: ForkliftType
  unitId: string
  timestamp: number
  operatorName: string
  answers: InspectionAnswer[]
  status: InspectionStatus
}

export interface EquipmentStatus {
  unitId: string
  type: ForkliftType
  lastInspection?: Inspection
  status: InspectionStatus
}
