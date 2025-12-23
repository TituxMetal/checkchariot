import { useState } from 'react'
import { ForkliftType } from '@/lib/types'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Truck } from '@phosphor-icons/react'

interface EquipmentSelectorProps {
  onSelect: (type: ForkliftType, unitId: string) => void
}

export function EquipmentSelector({ onSelect }: EquipmentSelectorProps) {
  const [selectedType, setSelectedType] = useState<ForkliftType | null>(null)
  const [unitId, setUnitId] = useState('')

  const equipmentTypes: { type: ForkliftType; name: string; description: string }[] = [
    {
      type: 'CACES-1',
      name: 'CACES 1',
      description: 'Counterbalance forklift'
    },
    {
      type: 'CACES-3',
      name: 'CACES 3',
      description: 'Reach truck / telescopic handler'
    },
    {
      type: 'CACES-5',
      name: 'CACES 5',
      description: 'Order picker / platform lift'
    }
  ]

  const handleContinue = () => {
    if (selectedType && unitId.trim()) {
      onSelect(selectedType, unitId.trim())
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Pre-Shift Inspection
          </h1>
          <p className="text-muted-foreground text-lg">
            Select your equipment type and enter unit ID
          </p>
        </div>

        <div className="grid gap-4 md:gap-6">
          {equipmentTypes.map(({ type, name, description }) => (
            <Card
              key={type}
              className={`cursor-pointer transition-all duration-200 hover:scale-[1.02] ${
                selectedType === type
                  ? 'border-accent bg-accent/10 shadow-lg'
                  : 'border-border hover:border-accent/50'
              }`}
              onClick={() => setSelectedType(type)}
            >
              <CardContent className="flex items-center gap-4 p-6">
                <div
                  className={`p-4 rounded-lg ${
                    selectedType === type
                      ? 'bg-accent text-accent-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  <Truck size={32} weight="duotone" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold">{name}</h3>
                  <p className="text-sm text-muted-foreground">{description}</p>
                </div>
                {selectedType === type && (
                  <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full bg-accent-foreground" />
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {selectedType && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="space-y-2">
              <label htmlFor="unit-id" className="text-sm font-medium">
                Unit ID
              </label>
              <input
                id="unit-id"
                type="text"
                placeholder="Enter equipment unit ID (e.g., FL-001)"
                value={unitId}
                onChange={(e) => setUnitId(e.target.value)}
                className="w-full px-4 py-4 bg-card border border-input rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-3 focus:ring-ring font-mono text-lg"
                autoFocus
              />
            </div>

            <Button
              onClick={handleContinue}
              disabled={!unitId.trim()}
              size="lg"
              className="w-full h-14 text-lg font-semibold"
            >
              Begin Inspection
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
