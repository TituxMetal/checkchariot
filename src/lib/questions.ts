import { InspectionQuestion, ForkliftType } from './types'

export const INSPECTION_QUESTIONS: InspectionQuestion[] = [
  {
    id: 'q1',
    text: 'Is the horn functioning properly?',
    categories: ['CACES-1', 'CACES-3', 'CACES-5']
  },
  {
    id: 'q2',
    text: 'Are all lights (headlights, brake lights, warning lights) operational?',
    categories: ['CACES-1', 'CACES-3', 'CACES-5']
  },
  {
    id: 'q3',
    text: 'Are there any visible oil or fluid leaks?',
    categories: ['CACES-1', 'CACES-3', 'CACES-5']
  },
  {
    id: 'q4',
    text: 'Are the brakes responsive and functioning correctly?',
    categories: ['CACES-1', 'CACES-3', 'CACES-5']
  },
  {
    id: 'q5',
    text: 'Is the steering mechanism working smoothly without unusual resistance?',
    categories: ['CACES-1', 'CACES-3', 'CACES-5']
  },
  {
    id: 'q6',
    text: 'Are all safety decals and warning labels visible and legible?',
    categories: ['CACES-1', 'CACES-3', 'CACES-5']
  },
  {
    id: 'q7',
    text: 'Is the seat belt or operator restraint system in good condition?',
    categories: ['CACES-1', 'CACES-3', 'CACES-5']
  },
  {
    id: 'q8',
    text: 'Are the tires properly inflated and free of significant wear or damage?',
    categories: ['CACES-1', 'CACES-3', 'CACES-5']
  },
  {
    id: 'q9',
    text: 'Are the forks straight, free of cracks, and properly aligned?',
    categories: ['CACES-1', 'CACES-3', 'CACES-5']
  },
  {
    id: 'q10',
    text: 'Does the mast operate smoothly without jerking or unusual noises?',
    categories: ['CACES-1', 'CACES-3', 'CACES-5']
  },
  {
    id: 'q11',
    text: 'Is the load backrest extension intact and secure?',
    categories: ['CACES-1', 'CACES-3', 'CACES-5']
  },
  {
    id: 'q12',
    text: 'Is the overhead guard structurally sound with no cracks or damage?',
    categories: ['CACES-1', 'CACES-3']
  },
  {
    id: 'q13',
    text: 'Are the stabilizer outriggers functioning and locking properly?',
    categories: ['CACES-3']
  },
  {
    id: 'q14',
    text: 'Does the telescopic boom extend and retract smoothly?',
    categories: ['CACES-3']
  },
  {
    id: 'q15',
    text: 'Is the reach mechanism operating without excessive play or binding?',
    categories: ['CACES-3', 'CACES-5']
  },
  {
    id: 'q16',
    text: 'Are the pantograph or scissor lift mechanisms free of damage and lubricated?',
    categories: ['CACES-5']
  },
  {
    id: 'q17',
    text: 'Is the platform/work cage secure with no loose bolts or welding cracks?',
    categories: ['CACES-5']
  },
  {
    id: 'q18',
    text: 'Are the guardrails on the elevated platform intact and at proper height?',
    categories: ['CACES-5']
  },
  {
    id: 'q19',
    text: 'Is the emergency lowering system functional and accessible?',
    categories: ['CACES-5']
  },
  {
    id: 'q20',
    text: 'Are all hydraulic hoses free of wear, cracks, or leaks?',
    categories: ['CACES-1', 'CACES-3', 'CACES-5']
  }
]

export function getRandomQuestions(
  forkliftType: ForkliftType,
  count: number = 10
): InspectionQuestion[] {
  const applicable = INSPECTION_QUESTIONS.filter(q =>
    q.categories.includes(forkliftType)
  )

  const shuffled = [...applicable].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, Math.min(count, shuffled.length))
}
