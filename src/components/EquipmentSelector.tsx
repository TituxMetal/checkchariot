import { Equipment, CACESCategory } from '@/lib/types'
import { EQUIPMENT_LIST, CATEGORY_LABELS } from '@/lib/equipment'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Truck } from '@phosphor-icons/react'

interface Props {
  onSelect: (equipment: Equipment) => void
}

export function EquipmentSelector({ onSelect }: Props) {
  const categories: CACESCategory[] = ['CACES1', 'CACES3', 'CACES5']
  
  const equipmentByCategory = categories.reduce((acc, cat) => {
    acc[cat] = EQUIPMENT_LIST.filter(eq => eq.category === cat)
    return acc
  }, {} as Record<CACESCategory, Equipment[]>)

  const getCategoryColor = (category: CACESCategory) => {
    switch(category) {
      case 'CACES1': return 'bg-blue-500'
      case 'CACES3': return 'bg-purple-500'
      case 'CACES5': return 'bg-emerald-500'
    }
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">Sélection de l'équipement</h2>
          <p className="text-muted-foreground">
            Choisissez votre chariot pour commencer l'inspection quotidienne
          </p>
        </div>

        <div className="space-y-8">
          {categories.map(category => (
            <div key={category}>
              <div className="mb-4">
                <Badge variant="outline" className="text-sm px-3 py-1">
                  {CATEGORY_LABELS[category]}
                </Badge>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {equipmentByCategory[category].map(equipment => (
                  <Card
                    key={equipment.id}
                    className="relative overflow-hidden cursor-pointer transition-all hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]"
                    onClick={() => onSelect(equipment)}
                  >
                    <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${getCategoryColor(category)}`} />
                    
                    <div className="p-6 pl-8">
                      <div className="flex items-start gap-4">
                        <div className="bg-accent/20 rounded-lg p-3">
                          <Truck className="text-accent" size={32} weight="duotone" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-lg mb-1 truncate">
                            {equipment.name}
                          </h3>
                          <p className="text-sm font-mono text-muted-foreground">
                            {equipment.id}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
