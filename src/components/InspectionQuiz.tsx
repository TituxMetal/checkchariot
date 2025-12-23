import { useState } from 'react'
import { InspectionQuestion, InspectionAnswer, ForkliftType } from '@/lib/types'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, XCircle, Warning } from '@phosphor-icons/react'
import { motion, AnimatePresence } from 'framer-motion'

interface InspectionQuizProps {
  questions: InspectionQuestion[]
  equipmentType: ForkliftType
  unitId: string
  onComplete: (answers: InspectionAnswer[]) => void
  onCancel: () => void
}

export function InspectionQuiz({
  questions,
  equipmentType,
  unitId,
  onComplete,
  onCancel
}: InspectionQuizProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<InspectionAnswer[]>([])
  const [showCommentField, setShowCommentField] = useState(false)
  const [comment, setComment] = useState('')
  const [severity, setSeverity] = useState<'minor' | 'critical'>('minor')

  const currentQuestion = questions[currentIndex]
  const progress = ((currentIndex) / questions.length) * 100

  const handleAnswer = (answer: boolean) => {
    if (answer) {
      const newAnswer: InspectionAnswer = {
        questionId: currentQuestion.id,
        questionText: currentQuestion.text,
        answer: true
      }
      setAnswers([...answers, newAnswer])
      moveToNext()
    } else {
      setShowCommentField(true)
    }
  }

  const handleSubmitDefect = () => {
    if (comment.trim()) {
      const newAnswer: InspectionAnswer = {
        questionId: currentQuestion.id,
        questionText: currentQuestion.text,
        answer: false,
        comment: comment.trim(),
        severity
      }
      setAnswers([...answers, newAnswer])
      setComment('')
      setSeverity('minor')
      setShowCommentField(false)
      moveToNext()
    }
  }

  const moveToNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1)
    } else {
      onComplete(answers)
    }
  }

  const handleSkipComment = () => {
    const newAnswer: InspectionAnswer = {
      questionId: currentQuestion.id,
      questionText: currentQuestion.text,
      answer: false,
      severity: 'minor'
    }
    setAnswers([...answers, newAnswer])
    setComment('')
    setShowCommentField(false)
    moveToNext()
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border p-4 space-y-4 z-10">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="font-mono">
                {unitId}
              </Badge>
              <Badge variant="secondary">{equipmentType}</Badge>
            </div>
          </div>
          <Button variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              Question {currentIndex + 1} of {questions.length}
            </span>
            <span className="font-semibold">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-3xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="border-2">
                <CardContent className="p-8 md:p-12 space-y-8">
                  <h2 className="text-2xl md:text-3xl font-semibold leading-tight text-center">
                    {currentQuestion.text}
                  </h2>

                  {!showCommentField ? (
                    <div className="grid grid-cols-2 gap-4">
                      <Button
                        size="lg"
                        onClick={() => handleAnswer(true)}
                        className="h-20 md:h-24 text-xl font-semibold bg-success hover:bg-success/90 text-success-foreground flex flex-col gap-2"
                      >
                        <CheckCircle size={32} weight="fill" />
                        Yes
                      </Button>
                      <Button
                        size="lg"
                        onClick={() => handleAnswer(false)}
                        className="h-20 md:h-24 text-xl font-semibold bg-destructive hover:bg-destructive/90 text-destructive-foreground flex flex-col gap-2"
                      >
                        <XCircle size={32} weight="fill" />
                        No
                      </Button>
                    </div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      transition={{ duration: 0.25, ease: 'easeOut' }}
                      className="space-y-4"
                    >
                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          Describe the issue
                        </label>
                        <Textarea
                          id="defect-comment"
                          placeholder="Enter details about what's wrong..."
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          className="min-h-32 text-base"
                          autoFocus
                        />
                        <div className="text-xs text-muted-foreground text-right">
                          {comment.length} characters
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Severity</label>
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            type="button"
                            onClick={() => setSeverity('minor')}
                            className={`p-4 rounded-lg border-2 transition-all ${
                              severity === 'minor'
                                ? 'border-warning bg-warning/10'
                                : 'border-border hover:border-warning/50'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <Warning
                                size={20}
                                weight="fill"
                                className="text-warning"
                              />
                              <span className="font-medium">Minor Issue</span>
                            </div>
                          </button>
                          <button
                            type="button"
                            onClick={() => setSeverity('critical')}
                            className={`p-4 rounded-lg border-2 transition-all ${
                              severity === 'critical'
                                ? 'border-destructive bg-destructive/10'
                                : 'border-border hover:border-destructive/50'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <XCircle
                                size={20}
                                weight="fill"
                                className="text-destructive"
                              />
                              <span className="font-medium">Critical</span>
                            </div>
                          </button>
                        </div>
                      </div>

                      <div className="flex gap-3 pt-2">
                        <Button
                          variant="outline"
                          onClick={handleSkipComment}
                          className="flex-1"
                        >
                          Skip Comment
                        </Button>
                        <Button
                          onClick={handleSubmitDefect}
                          disabled={!comment.trim()}
                          className="flex-1"
                        >
                          Continue
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
