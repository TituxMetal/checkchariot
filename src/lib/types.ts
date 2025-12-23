export type CACESCategory = 'CACES1' | 'CACES3' | 'CACES5'

export interface Equipment {
  id: string
  name: string
  category: CACESCategory
}

export interface InspectionQuestion {
  id: string
  text: string
  category: CACESCategory | 'common'
  answers: InspectionAnswer[]
  correctAnswerId: string
}

export interface InspectionAnswer {
  id: string
  text: string
  isOk: boolean
  severity?: 'minor' | 'critical'
}

export interface QuestionResponse {
  questionId: string
  questionText: string
  answerId: string
  answerText: string
  isOk: boolean
  severity?: 'minor' | 'critical'
  comment?: string
  timestamp: number
}

export type InspectionStatus = 'ok' | 'warning' | 'critical'

export interface Inspection {
  id: string
  equipmentId: string
  equipmentName: string
  category: CACESCategory
  operatorName: string
  timestamp: number
  responses: QuestionResponse[]
  status: InspectionStatus
}

export interface MaintenanceAction {
  id: string
  inspectionId: string
  equipmentId: string
  equipmentName: string
  defectDescription: string
  severity: 'minor' | 'critical'
  status: 'pending' | 'in-progress' | 'completed'
  createdAt: number
  completedAt?: number
  assignedTo?: string
  notes?: string
}
