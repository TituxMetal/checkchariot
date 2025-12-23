import { Equipment, CACESCategory } from './types'

export const EQUIPMENT_LIST: Equipment[] = [
  { id: 'C1-001', name: 'Clark C25', category: 'CACES1' },
  { id: 'C1-002', name: 'Toyota 8FG25', category: 'CACES1' },
  { id: 'C1-003', name: 'Linde H20T', category: 'CACES1' },
  { id: 'C1-004', name: 'Hyster J2.0XN', category: 'CACES1' },
  { id: 'C3-101', name: 'BT RRE160', category: 'CACES3' },
  { id: 'C3-102', name: 'Crown RR5700', category: 'CACES3' },
  { id: 'C3-103', name: 'Linde L16', category: 'CACES3' },
  { id: 'C5-201', name: 'Linde R14', category: 'CACES5' },
  { id: 'C5-202', name: 'Still FM-X20', category: 'CACES5' },
  { id: 'C5-203', name: 'Crown ESR5000', category: 'CACES5' },
]

export function getEquipmentByCategory(category: CACESCategory): Equipment[] {
  return EQUIPMENT_LIST.filter(eq => eq.category === category)
}

export function getEquipmentById(id: string): Equipment | undefined {
  return EQUIPMENT_LIST.find(eq => eq.id === id)
}

export const CATEGORY_LABELS: Record<CACESCategory, string> = {
  CACES1: 'CACES 1 - Transpalettes à conducteur porté',
  CACES3: 'CACES 3 - Chariots élévateurs en porte-à-faux',
  CACES5: 'CACES 5 - Chariots élévateurs à mât rétractable'
}
