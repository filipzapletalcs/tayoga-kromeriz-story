import React from 'react'
import { motion } from 'framer-motion'
import { Clock, Users, Calendar, Sparkles, Repeat } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { format } from 'date-fns'
import { cs } from 'date-fns/locale'
import type { RecurringClass, ClassInstance } from '@/types/database'

interface ClassCardProps {
  classData: RecurringClass
  instance: ClassInstance
  date: Date
  registeredCount: number
  onSelect: () => void
  isSelected?: boolean
}

export const ClassCard: React.FC<ClassCardProps> = ({
  classData,
  instance,
  date,
  registeredCount,
  onSelect,
  isSelected = false,
}) => {
  const capacity = instance.capacity_override ?? classData.capacity
  const spotsLeft = capacity - registeredCount
  const isFull = spotsLeft <= 0
  const isAlmostFull = spotsLeft <= 2 && spotsLeft > 0
  const fillPercentage = Math.min((registeredCount / capacity) * 100, 100)

  const formatTime = (time: string) => {
    return time.slice(0, 5)
  }

  const dayName = format(date, 'EEEE', { locale: cs })
  const dateFormatted = format(date, 'd. MMMM', { locale: cs })
  const isToday = format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="group"
    >
      <Card
        className={`
          relative overflow-hidden cursor-pointer
          bg-card/80 backdrop-blur-sm
          border transition-all duration-300
          ${isSelected
            ? 'border-primary shadow-lg ring-2 ring-primary/20'
            : 'border-border/50 hover:border-primary/30 hover:shadow-xl'
          }
          ${isFull ? 'opacity-60' : ''}
        `}
        onClick={!isFull ? onSelect : undefined}
      >
        {/* Decorative gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Subtle pattern */}
        <div
          className="absolute inset-0 opacity-[0.02] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        />

        <CardContent className="relative p-5">
          {/* Header with date */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="w-4 h-4 text-primary/70" />
                <span className="text-sm font-medium text-muted-foreground capitalize">
                  {dayName}
                </span>
                {isToday && (
                  <Badge variant="default" className="text-xs bg-primary/90 hover:bg-primary">
                    Dnes
                  </Badge>
                )}
              </div>
              <p className="text-lg font-serif text-foreground">
                {dateFormatted}
              </p>
            </div>

            {/* Time badge */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
              <Clock className="w-3.5 h-3.5 text-primary" />
              <span className="text-sm font-semibold text-primary">
                {formatTime(classData.time_start)}
              </span>
            </div>
          </div>

          {/* Class title */}
          <h3 className="text-xl font-serif font-semibold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
            {classData.title}
          </h3>

          {/* Description */}
          {classData.description && (
            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
              {classData.description}
            </p>
          )}

          {/* Lesson count badge for recurring courses */}
          {classData.lesson_count && (
            <div className="flex items-center gap-1.5 mb-4 px-2.5 py-1 rounded-full bg-accent/50 border border-border/50 w-fit">
              <Repeat className="w-3.5 h-3.5 text-primary/70" />
              <span className="text-xs font-medium text-muted-foreground">
                Kurz: {classData.lesson_count} lekcí
              </span>
            </div>
          )}

          {/* Capacity indicator */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {registeredCount}/{capacity} míst obsazeno
                </span>
              </div>
              {isAlmostFull && !isFull && (
                <Badge variant="outline" className="text-xs border-amber-500/50 text-amber-600 dark:text-amber-400">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Poslední místa
                </Badge>
              )}
              {isFull && (
                <Badge variant="secondary" className="text-xs">
                  Obsazeno
                </Badge>
              )}
            </div>

            {/* Progress bar */}
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${fillPercentage}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className={`h-full rounded-full ${
                  isFull
                    ? 'bg-muted-foreground/50'
                    : isAlmostFull
                      ? 'bg-gradient-to-r from-amber-400 to-amber-500'
                      : 'bg-gradient-to-r from-primary/80 to-primary'
                }`}
              />
            </div>
          </div>

          {/* Footer with price and CTA */}
          <div className="flex items-center justify-between pt-3 border-t border-border/50">
            {classData.price && (
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  {classData.price}
                </span>
                <span className="text-sm text-muted-foreground">Kč</span>
              </div>
            )}

            <Button
              variant={isFull ? 'secondary' : isSelected ? 'default' : 'outline'}
              size="sm"
              disabled={isFull}
              className={`
                transition-all duration-300
                ${!isFull && !isSelected && 'hover:bg-primary hover:text-primary-foreground hover:border-primary'}
              `}
            >
              {isFull ? 'Obsazeno' : isSelected ? 'Vybráno' : 'Rezervovat'}
            </Button>
          </div>
        </CardContent>

        {/* Selection indicator */}
        {isSelected && (
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-primary/80 to-primary origin-left"
          />
        )}
      </Card>
    </motion.div>
  )
}

export default ClassCard
