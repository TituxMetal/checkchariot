import { useState, useEffect } from 'react'
import { Equipment, InspectionQuestion, QuestionResponse } from '@/lib/types'
import { shuffleAnswers } from '@/lib/questions'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { ArrowLeft, CheckCircle, Warning, XCircle } from '@phosphor-icons/react'
import { motion, AnimatePresence } from 'framer-motion'

interface Props {
  equipment: Equipment
  questions: InspectionQuestion[]
  onComplete: (responses: QuestionResponse[]) => void
  onCancel: () => void
}

export function InspectionQuiz({ equipment, questions, onComplete, onCancel }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [responses, setResponses] = useState<QuestionResponse[]>([])
  const [selectedAnswerId, setSelectedAnswerId] = useState<string | null>(null)
  const [comment, setComment] = useState('')
  const [showComment, setShowComment] = useState(false)
  const [shuffledAnswers, setShuffledAnswers] = useState<InspectionQuestion['answers']>([])
  const [answerLayout, setAnswerLayout] = useState<'vertical' | 'horizontal'>('vertical')

  const currentQuestion = questions[currentIndex]
  const progress = ((currentIndex + 1) / questions.length) * 100

  useEffect(() => {
    if (currentQuestion) {
      const shuffled = shuffleAnswers(currentQuestion.answers)
      setShuffledAnswers(shuffled)
      
      const layoutChoice = shuffled.length <= 2 && Math.random() > 0.5 ? 'horizontal' : 'vertical'
      setAnswerLayout(layoutChoice)
    }
  }, [currentQuestion])

  const handleAnswerSelect = (answerId: string) => {
    const answer = currentQuestion.answers.find(a => a.id === answerId)
    if (!answer) return

    setSelectedAnswerId(answerId)
    
    if (!answer.isOk) {
      setShowComment(true)
    } else {
      setShowComment(false)
      setComment('')
    }
  }

  const handleNext = () => {
    if (!selectedAnswerId) return

    const answer = currentQuestion.answers.find(a => a.id === selectedAnswerId)
    if (!answer) return

    const response: QuestionResponse = {
      questionId: currentQuestion.id,
      questionText: currentQuestion.text,
      answerId: selectedAnswerId,
      answerText: answer.text,
      isOk: answer.isOk,
      severity: answer.severity,
      comment: !answer.isOk && comment ? comment : undefined,
      timestamp: Date.now()
    }

    const newResponses = [...responses, response]
    setResponses(newResponses)

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setSelectedAnswerId(null)
      setComment('')
      setShowComment(false)
    } else {
      onComplete(newResponses)
    }
  }

  const getAnswerButtonVariant = (answerId: string) => {
    if (selectedAnswerId === answerId) {
      const answer = currentQuestion.answers.find(a => a.id === answerId)
      if (answer?.isOk) return 'default'
      return answer?.severity === 'critical' ? 'destructive' : 'secondary'
    }
    return 'outline'
  }

  const getAnswerIcon = (answerId: string) => {
    if (selectedAnswerId !== answerId) return null
    
    const answer = currentQuestion.answers.find(a => a.id === answerId)
    if (answer?.isOk) return <CheckCircle weight="fill" />
    if (answer?.severity === 'critical') return <XCircle weight="fill" />
    return <Warning weight="fill" />
  }

  if (!currentQuestion) return null

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <ArrowLeft className="mr-2" />
            Retour
          </Button>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h2 className="text-sm font-medium text-muted-foreground">
                {equipment.name}
              </h2>
              <p className="text-xs font-mono text-muted-foreground">{equipment.id}</p>
            </div>
            <div className="text-sm font-medium">
              Question {currentIndex + 1} / {questions.length}
            </div>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="p-6 md:p-8 mb-6">
              <h3 className="text-xl md:text-2xl font-semibold mb-8">
                {currentQuestion.text}
              </h3>

              <div 
                className={`grid gap-3 ${
                  answerLayout === 'horizontal' && shuffledAnswers.length === 2
                    ? 'grid-cols-2'
                    : 'grid-cols-1'
                }`}
              >
                {shuffledAnswers.map((answer) => (
                  <Button
                    key={answer.id}
                    variant={getAnswerButtonVariant(answer.id)}
                    size="lg"
                    onClick={() => handleAnswerSelect(answer.id)}
                    className="h-auto min-h-[56px] py-4 px-6 text-left justify-start relative"
                  >
                    <span className="flex-1">{answer.text}</span>
                    {getAnswerIcon(answer.id) && (
                      <span className="ml-3">{getAnswerIcon(answer.id)}</span>
                    )}
                  </Button>
                ))}
              </div>

              <AnimatePresence>
                {showComment && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-6">
                      <label htmlFor="defect-comment" className="block text-sm font-medium mb-2">
                        Décrivez le défaut observé
                      </label>
                      <Textarea
                        id="defect-comment"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Détails du problème constaté..."
                        rows={3}
                        className="resize-none"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>

            <div className="flex justify-end">
              <Button
                size="lg"
                onClick={handleNext}
                disabled={!selectedAnswerId}
                className="min-w-[160px]"
              >
                {currentIndex < questions.length - 1 ? 'Suivant' : 'Terminer'}
              </Button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
