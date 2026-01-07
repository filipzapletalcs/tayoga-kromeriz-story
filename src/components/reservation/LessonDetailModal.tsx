import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { format } from 'date-fns'
import { cs } from 'date-fns/locale'
import {
  Clock,
  Users,
  Calendar,
  Sparkles,
  X,
  User,
  Mail,
  Phone,
  MessageSquare,
  Check,
  Loader2,
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import type { ScheduleItem, RegistrationInsert } from '@/types/database'
import { getLessonTypeLabel } from '@/hooks/useScheduleData'
import { useCreateRegistration } from '@/hooks/useRegistrations'
import { useCreateWorkshopRegistration } from '@/hooks/useWorkshops'
import { supabase } from '@/lib/supabase'
import { useQueryClient } from '@tanstack/react-query'

interface LessonDetailModalProps {
  item: ScheduleItem | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

const LessonDetailModal: React.FC<LessonDetailModalProps> = ({
  item,
  open,
  onOpenChange,
}) => {
  const queryClient = useQueryClient()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    note: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSuccess, setIsSuccess] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const createClassRegistration = useCreateRegistration()
  const createWorkshopRegistration = useCreateWorkshopRegistration()

  if (!item) return null

  const isWorkshop = item.type === 'workshop'
  const isOneTime = item.type === 'one_time'
  const spotsRemaining = item.capacity - item.registeredCount
  const isFull = spotsRemaining <= 0
  const fillPercentage = Math.min((item.registeredCount / item.capacity) * 100, 100)

  const formatTime = (time: string) => {
    const parts = time.split(':')
    return `${parts[0]}:${parts[1]}`
  }

  const dayName = format(item.date, 'EEEE', { locale: cs })
  const dayNameCapitalized = dayName.charAt(0).toUpperCase() + dayName.slice(1)
  const dateFormatted = format(item.date, 'd. MMMM yyyy', { locale: cs })

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Vyplňte prosím jméno'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Vyplňte prosím e-mail'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Zadejte platný e-mail'
    }

    if (formData.phone && !/^[+]?[\d\s-]{9,}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Zadejte platné telefonní číslo'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      if (item.type === 'recurring' && item.classInstance) {
        const registration: RegistrationInsert = {
          class_instance_id: item.classInstance.id,
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim() || null,
          note: formData.note.trim() || null,
        }
        await createClassRegistration.mutateAsync(registration)
      } else if (item.type === 'workshop' && item.workshop) {
        await createWorkshopRegistration.mutateAsync({
          workshop_id: item.workshop.id,
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim() || undefined,
          note: formData.note.trim() || undefined,
        })
      } else if (item.type === 'one_time' && item.oneTimeClass) {
        // Register for one-time class
        const { data: hasCapacity, error: capError } = await supabase
          .rpc('check_one_time_class_capacity', { p_class_id: item.oneTimeClass.id })

        if (capError) throw capError
        if (!hasCapacity) {
          throw new Error('Lekce je již plně obsazena')
        }

        const { error } = await supabase
          .from('registrations')
          .insert({
            one_time_class_id: item.oneTimeClass.id,
            name: formData.name.trim(),
            email: formData.email.trim(),
            phone: formData.phone.trim() || null,
            note: formData.note.trim() || null,
          })

        if (error) throw error

        // Invalidate queries
        queryClient.invalidateQueries({ queryKey: ['upcoming-one-time-classes'] })
        queryClient.invalidateQueries({ queryKey: ['schedule-data'] })
      }

      setIsSuccess(true)
      setTimeout(() => {
        handleClose()
      }, 3000)
    } catch (error) {
      if (error instanceof Error) {
        setErrors({ submit: error.message })
      } else {
        setErrors({ submit: 'Něco se pokazilo. Zkuste to prosím znovu.' })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleClose = () => {
    setFormData({ name: '', email: '', phone: '', note: '' })
    setErrors({})
    setIsSuccess(false)
    onOpenChange(false)
  }

  // Get accent color based on type
  const getAccentColor = () => {
    if (isWorkshop) return 'amber'
    return 'primary'
  }

  const accentColor = getAccentColor()

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader className="relative">
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute right-0 top-0 p-1 rounded-full hover:bg-muted transition-colors"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>

          {/* Type badge */}
          {(isWorkshop || isOneTime) && (
            <div className="mb-2">
              <span className={cn(
                'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium',
                isWorkshop
                  ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-700'
                  : 'bg-primary/10 text-primary'
              )}>
                {isWorkshop && <Sparkles className="w-3 h-3" />}
                {getLessonTypeLabel(item.type)}
              </span>
            </div>
          )}

          <DialogTitle className="text-2xl font-serif pr-8">
            {item.title}
          </DialogTitle>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {isSuccess ? (
            /* Success state */
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="py-8 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
                className={cn(
                  'mx-auto mb-6 w-16 h-16 rounded-full flex items-center justify-center shadow-lg',
                  isWorkshop
                    ? 'bg-gradient-to-br from-amber-500 to-orange-500'
                    : 'bg-gradient-to-br from-primary to-primary/80'
                )}
              >
                <Check className="w-8 h-8 text-white" strokeWidth={3} />
              </motion.div>

              <h3 className="text-xl font-serif font-bold text-foreground mb-2">
                Rezervace úspěšná!
              </h3>
              <p className="text-muted-foreground mb-4">
                Těšíme se na vás
              </p>

              <div className={cn(
                'inline-block px-4 py-2 rounded-lg border',
                isWorkshop ? 'bg-amber-500/10 border-amber-500/20' : 'bg-primary/10 border-primary/20'
              )}>
                <p className="font-medium text-foreground">{item.title}</p>
                <p className="text-sm text-muted-foreground">
                  {dayNameCapitalized}, {dateFormatted}
                </p>
              </div>
            </motion.div>
          ) : (
            /* Form state */
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Lesson details */}
              <div className="mb-6 p-4 rounded-lg bg-muted/30 border border-border/50">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {/* Date */}
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>{dayNameCapitalized}, {format(item.date, 'd. M. yyyy')}</span>
                  </div>

                  {/* Time */}
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>{formatTime(item.time_start)} - {formatTime(item.time_end)}</span>
                  </div>

                  {/* Capacity */}
                  <div className="flex items-center gap-2 text-muted-foreground col-span-2">
                    <Users className="w-4 h-4" />
                    <span>
                      {isFull ? (
                        'Obsazeno'
                      ) : (
                        <>Volné: <span className="text-foreground font-medium">{spotsRemaining}</span> z {item.capacity}</>
                      )}
                    </span>
                  </div>
                </div>

                {/* Capacity bar */}
                <div className="mt-3 h-1.5 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className={cn(
                      'h-full rounded-full',
                      isFull
                        ? 'bg-muted-foreground/40'
                        : isWorkshop
                          ? 'bg-gradient-to-r from-amber-400 to-orange-500'
                          : 'bg-gradient-to-r from-primary/60 to-primary'
                    )}
                    initial={{ width: 0 }}
                    animate={{ width: `${fillPercentage}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                  />
                </div>

                {/* Description */}
                {item.description && (
                  <p className="mt-4 text-sm text-muted-foreground">
                    {item.description}
                  </p>
                )}

                {/* Price */}
                {item.price && (
                  <p className="mt-2 text-sm font-medium text-foreground">
                    Cena: {item.price} Kč
                  </p>
                )}
              </div>

              {/* Registration form */}
              {!isFull && (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Name */}
                  <div className="space-y-1.5">
                    <Label htmlFor="modal-name" className="flex items-center gap-2 text-sm">
                      <User className="w-4 h-4 text-muted-foreground" />
                      Jméno a příjmení
                    </Label>
                    <Input
                      id="modal-name"
                      placeholder="Jan Novak"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className={errors.name ? 'border-destructive' : ''}
                    />
                    {errors.name && (
                      <p className="text-xs text-destructive">{errors.name}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5">
                    <Label htmlFor="modal-email" className="flex items-center gap-2 text-sm">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      E-mail
                    </Label>
                    <Input
                      id="modal-email"
                      type="email"
                      placeholder="jan@email.cz"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={errors.email ? 'border-destructive' : ''}
                    />
                    {errors.email && (
                      <p className="text-xs text-destructive">{errors.email}</p>
                    )}
                  </div>

                  {/* Phone */}
                  <div className="space-y-1.5">
                    <Label htmlFor="modal-phone" className="flex items-center gap-2 text-sm">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      Telefon
                      <span className="text-xs text-muted-foreground">(nepovinné)</span>
                    </Label>
                    <Input
                      id="modal-phone"
                      type="tel"
                      placeholder="+420 123 456 789"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className={errors.phone ? 'border-destructive' : ''}
                    />
                    {errors.phone && (
                      <p className="text-xs text-destructive">{errors.phone}</p>
                    )}
                  </div>

                  {/* Note */}
                  <div className="space-y-1.5">
                    <Label htmlFor="modal-note" className="flex items-center gap-2 text-sm">
                      <MessageSquare className="w-4 h-4 text-muted-foreground" />
                      Poznámka
                      <span className="text-xs text-muted-foreground">(nepovinné)</span>
                    </Label>
                    <Textarea
                      id="modal-note"
                      placeholder="Zdravotní omezení, dotazy..."
                      rows={2}
                      value={formData.note}
                      onChange={(e) => handleInputChange('note', e.target.value)}
                      className="resize-none"
                    />
                  </div>

                  {/* Submit error */}
                  {errors.submit && (
                    <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-sm text-destructive">
                      {errors.submit}
                    </div>
                  )}

                  {/* Submit button */}
                  <Button
                    type="submit"
                    className={cn(
                      'w-full h-11',
                      isWorkshop && 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600'
                    )}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Odesílám...
                      </>
                    ) : (
                      'Potvrdit rezervaci'
                    )}
                  </Button>

                  <p className="text-xs text-center text-muted-foreground">
                    Odesláním souhlasíte se zpracováním osobních údajů pro účely rezervace.
                  </p>
                </form>
              )}

              {/* Full message */}
              {isFull && (
                <div className="text-center py-6">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                    <Users className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <h3 className="font-serif font-semibold text-foreground mb-2">
                    Lekce je plně obsazena
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Kontaktujte nás pro zápis na náhradníky.
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  )
}

export default LessonDetailModal
