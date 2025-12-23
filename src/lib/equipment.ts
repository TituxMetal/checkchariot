import { Equipment, ForkliftType } from './types'

export const EQUIPMENT_LIST: Equipment[] = [
  { id: 'FL-001', name: 'Chariot élévateur A', type: 'CACES-1' },
  { id: 'FL-002', name: 'Chariot élévateur B', type: 'CACES-1' },
  { id: 'FL-003', name: 'Chariot élévateur C', type: 'CACES-1' },
  { id: 'FL-004', name: 'Chariot élévateur D', type: 'CACES-1' },
  { id: 'RT-001', name: 'Gerbeur à mât rétractable Alpha', type: 'CACES-3' },
  { id: 'RT-002', name: 'Gerbeur à mât rétractable Beta', type: 'CACES-3' },
  { id: 'RT-003', name: 'Chariot télescopique Gamma', type: 'CACES-3' },
  { id: 'OP-001', name: 'Préparateur de commandes Omega', type: 'CACES-5' },
  { id: 'OP-002', name: 'Préparateur de commandes Delta', type: 'CACES-5' },
  { id: 'OP-003', name: 'Nacelle élévatrice Sigma', type: 'CACES-5' }
]

export function getEquipmentByType(type: ForkliftType): Equipment[] {
  return EQUIPMENT_LIST.filter(eq => eq.type === type)
}

export function getEquipmentById(id: string): Equipment | undefined {
  return EQUIPMENT_LIST.find(eq => eq.id === id)
}
