export type ForkliftType = 'CACES-1' | 'CACES-3' | 'CACES-5'

export type InspectionStatus = 'ok' | 'minor' | 'critical'

export interface InspectionQuestion {
  id: string
  text: string
  categories: ForkliftType[]
}

export interface InspectionAnswer {
  questionId: string
  questionText: string
  answer: boolean
  comment?: string
  severity?: 'minor' | 'critical'
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
