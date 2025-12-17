import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { User, Mail, Phone, MessageSquare, Check, Loader2, ArrowLeft, Sparkles } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { format } from 'date-fns'
import { cs } from 'date-fns/locale'
import type { RecurringClass, ClassInstance, Workshop, RegistrationInsert } from '@/types/database'
import { useCreateRegistration } from '@/hooks/useRegistrations'
import { useCreateWorkshopRegistration } from '@/hooks/useWorkshops'

// Props for class registration
interface ClassRegistrationProps {
  type: 'class'
  classData: RecurringClass
  instance: ClassInstance
  date: Date
  onBack: () => void
  onSuccess: () => void
}

// Props for workshop registration
interface WorkshopRegistrationProps {
  type: 'workshop'
  workshop: Workshop
  date: Date
  onBack: () => void
  onSuccess: () => void
}

type RegistrationFormProps = ClassRegistrationProps | WorkshopRegistrationProps

export const RegistrationForm: React.FC<RegistrationFormProps> = (props) => {
  const { date, onBack, onSuccess } = props

  const isWorkshop = props.type === 'workshop'
  const title = isWorkshop ? props.workshop.title : props.classData.title
  const timeStart = isWorkshop ? props.workshop.time_start : props.classData.time_start

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    note: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSuccess, setIsSuccess] = useState(false)

  const createClassRegistration = useCreateRegistration()
  const createWorkshopRegistration = useCreateWorkshopRegistration()

  const isPending = createClassRegistration.isPending || createWorkshopRegistration.isPending

  const formatTime = (time: string) => time.slice(0, 5)
  const dayName = format(date, 'EEEE', { locale: cs })
  const dateFormatted = format(date, 'd. MMMM yyyy', { locale: cs })

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

    try {
      if (isWorkshop) {
        await createWorkshopRegistration.mutateAsync({
          workshop_id: props.workshop.id,
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim() || undefined,
          note: formData.note.trim() || undefined,
        })
      } else {
        const registration: RegistrationInsert = {
          class_instance_id: props.instance.id,
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim() || null,
          note: formData.note.trim() || null,
        }
        await createClassRegistration.mutateAsync(registration)
      }

      setIsSuccess(true)
      setTimeout(() => {
        onSuccess()
      }, 3000)
    } catch (error) {
      if (error instanceof Error) {
        setErrors({ submit: error.message })
      } else {
        setErrors({ submit: 'Něco se pokazilo. Zkuste to prosím znovu.' })
      }
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  // Color classes based on type
  const gradientFrom = isWorkshop ? 'from-amber-500/10' : 'from-primary/10'
  const gradientTo = isWorkshop ? 'to-orange-500/10' : 'to-accent/10'

  // Success state
  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg mx-auto"
      >
        <Card className={`relative overflow-hidden bg-card/90 backdrop-blur-sm ${isWorkshop ? 'border-amber-500/20' : 'border-primary/20'}`}>
          {/* Celebration background */}
          <div className={`absolute inset-0 bg-gradient-to-br ${gradientFrom} via-transparent ${gradientTo}`} />

          <CardContent className="relative py-12 text-center">
            {/* Success icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
              className={`mx-auto mb-6 w-20 h-20 rounded-full flex items-center justify-center shadow-lg ${
                isWorkshop
                  ? 'bg-gradient-to-br from-amber-500 to-orange-500'
                  : 'bg-gradient-to-br from-primary to-primary/80'
              }`}
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Check className={`w-10 h-10 ${isWorkshop ? 'text-white' : 'text-primary-foreground'}`} strokeWidth={3} />
              </motion.div>
            </motion.div>

            {/* Sparkles */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex justify-center gap-2 mb-4"
            >
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{
                    y: [0, -8, 0],
                    rotate: [0, 10, -10, 0]
                  }}
                  transition={{
                    duration: 2,
                    delay: i * 0.2,
                    repeat: Infinity
                  }}
                >
                  <Sparkles className={`w-5 h-5 ${isWorkshop ? 'text-amber-500/60' : 'text-primary/60'}`} />
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="text-2xl font-serif font-bold text-foreground mb-2">
                Rezervace úspěšná!
              </h3>
              <p className="text-muted-foreground mb-6">
                Těšíme se na vás {isWorkshop ? 'na workshopu' : 'na lekci'}
              </p>

              <div className={`inline-block px-6 py-3 rounded-xl ${isWorkshop ? 'bg-amber-500/10 border-amber-500/20' : 'bg-primary/10 border-primary/20'} border`}>
                <p className="font-serif font-semibold text-foreground">
                  {title}
                </p>
                <p className="text-sm text-muted-foreground capitalize">
                  {dayName}, {dateFormatted} v {formatTime(timeStart)}
                </p>
              </div>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="w-full max-w-lg mx-auto"
    >
      <Card className="relative overflow-hidden bg-card/90 backdrop-blur-sm border-border/50">
        {/* Decorative gradient */}
        <div className={`absolute inset-0 bg-gradient-to-br ${isWorkshop ? 'from-amber-500/5 to-orange-500/5' : 'from-primary/5 to-accent/5'} pointer-events-none`} />

        <CardHeader className="relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="absolute left-4 top-4 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Zpět
          </Button>

          <div className="pt-8">
            <CardTitle className="text-2xl font-serif text-center">
              Rezervace {isWorkshop ? 'workshopu' : 'lekce'}
            </CardTitle>
            <CardDescription className="text-center mt-2">
              <span className="font-medium text-foreground">{title}</span>
              <br />
              <span className="capitalize">{dayName}</span>, {dateFormatted} v {formatTime(timeStart)}
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="relative">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name field */}
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2">
                <User className="w-4 h-4 text-muted-foreground" />
                Jméno a příjmení
              </Label>
              <Input
                id="name"
                placeholder="Jan Novák"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`
                  transition-all duration-200
                  ${errors.name ? 'border-destructive focus-visible:ring-destructive' : ''}
                `}
              />
              <AnimatePresence>
                {errors.name && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="text-sm text-destructive"
                  >
                    {errors.name}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Email field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-muted-foreground" />
                E-mail
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="jan@email.cz"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`
                  transition-all duration-200
                  ${errors.email ? 'border-destructive focus-visible:ring-destructive' : ''}
                `}
              />
              <AnimatePresence>
                {errors.email && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="text-sm text-destructive"
                  >
                    {errors.email}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Phone field */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-muted-foreground" />
                Telefon
                <span className="text-xs text-muted-foreground">(nepovinné)</span>
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+420 123 456 789"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className={`
                  transition-all duration-200
                  ${errors.phone ? 'border-destructive focus-visible:ring-destructive' : ''}
                `}
              />
              <AnimatePresence>
                {errors.phone && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="text-sm text-destructive"
                  >
                    {errors.phone}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Note field */}
            <div className="space-y-2">
              <Label htmlFor="note" className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-muted-foreground" />
                Poznámka
                <span className="text-xs text-muted-foreground">(nepovinné)</span>
              </Label>
              <Textarea
                id="note"
                placeholder="Zdravotní omezení, dotazy..."
                rows={3}
                value={formData.note}
                onChange={(e) => handleInputChange('note', e.target.value)}
                className="resize-none"
              />
            </div>

            {/* Submit error */}
            <AnimatePresence>
              {errors.submit && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-sm text-destructive"
                >
                  {errors.submit}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit button */}
            <Button
              type="submit"
              className={`w-full h-12 text-base font-medium ${
                isWorkshop
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600'
                  : ''
              }`}
              disabled={isPending}
            >
              {isPending ? (
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
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default RegistrationForm
