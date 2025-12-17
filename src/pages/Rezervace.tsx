import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, ArrowLeft, Loader2, Info, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ScrollReveal, fadeUpVariants } from '@/components/ui/scroll-animations'
import ClassCard from '@/components/reservation/ClassCard'
import WorkshopCard from '@/components/reservation/WorkshopCard'
import RegistrationForm from '@/components/reservation/RegistrationForm'
import { useUpcomingClasses } from '@/hooks/useClasses'
import { useUpcomingWorkshops } from '@/hooks/useWorkshops'
import type { RecurringClass, ClassInstance, Workshop } from '@/types/database'
import logoSvg from '@/assets/TaYoga_Logo.svg'

interface SelectedClass {
  type: 'class'
  classData: RecurringClass
  instance: ClassInstance
  date: Date
}

interface SelectedWorkshop {
  type: 'workshop'
  workshop: Workshop
  date: Date
}

type Selection = SelectedClass | SelectedWorkshop | null

const Rezervace: React.FC = () => {
  const [selection, setSelection] = useState<Selection>(null)
  const { data: upcomingClasses, isLoading: classesLoading, error: classesError } = useUpcomingClasses(14)
  const { data: upcomingWorkshops, isLoading: workshopsLoading, error: workshopsError } = useUpcomingWorkshops()

  const isLoading = classesLoading || workshopsLoading
  const error = classesError || workshopsError

  const hasClasses = upcomingClasses && upcomingClasses.length > 0
  const hasWorkshops = upcomingWorkshops && upcomingWorkshops.length > 0
  const hasContent = hasClasses || hasWorkshops

  const handleSelectClass = (classData: RecurringClass, instance: ClassInstance, date: Date) => {
    setSelection({ type: 'class', classData, instance, date })
  }

  const handleSelectWorkshop = (workshop: Workshop, date: Date) => {
    setSelection({ type: 'workshop', workshop, date })
  }

  const handleBack = () => {
    setSelection(null)
  }

  const handleSuccess = () => {
    setSelection(null)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Decorative background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-primary/5 via-transparent to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-accent/5 via-transparent to-transparent rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 group">
              <ArrowLeft className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
              <img src={logoSvg} alt="TaYoga" className="h-8 w-auto" />
            </Link>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>Rezervace</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="relative container mx-auto px-6 py-12">
        <AnimatePresence mode="wait">
          {selection ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              {selection.type === 'class' ? (
                <RegistrationForm
                  type="class"
                  classData={selection.classData}
                  instance={selection.instance}
                  date={selection.date}
                  onBack={handleBack}
                  onSuccess={handleSuccess}
                />
              ) : (
                <RegistrationForm
                  type="workshop"
                  workshop={selection.workshop}
                  date={selection.date}
                  onBack={handleBack}
                  onSuccess={handleSuccess}
                />
              )}
            </motion.div>
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Page header */}
              <ScrollReveal>
                <div className="text-center mb-12">
                  <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
                    Vyberte si
                    <span className="text-primary"> termín</span>
                  </h1>
                  <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                    Prohlédněte si nadcházející lekce a workshopy a rezervujte si své místo.
                  </p>
                </div>
              </ScrollReveal>

              {/* Loading state */}
              {isLoading && (
                <div className="flex flex-col items-center justify-center py-20">
                  <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
                  <p className="text-muted-foreground">Načítám...</p>
                </div>
              )}

              {/* Error state */}
              {error && (
                <Alert variant="destructive" className="max-w-lg mx-auto">
                  <AlertDescription>
                    Nepodařilo se načíst data. Zkuste to prosím později.
                  </AlertDescription>
                </Alert>
              )}

              {/* Empty state */}
              {!isLoading && !error && !hasContent && (
                <div className="text-center py-20">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
                    <Calendar className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-serif font-semibold text-foreground mb-2">
                    Žádné nadcházející termíny
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Momentálně nejsou naplánovány žádné lekce ani workshopy.
                  </p>
                  <Alert className="max-w-md mx-auto bg-primary/5 border-primary/20">
                    <Info className="h-4 w-4 text-primary" />
                    <AlertDescription className="text-sm">
                      Zkontrolujte prosím náš rozvrh nebo nás kontaktujte pro více informací.
                    </AlertDescription>
                  </Alert>
                </div>
              )}

              {/* Workshops section */}
              {!isLoading && !error && hasWorkshops && (
                <ScrollReveal delay={0.1} variants={fadeUpVariants}>
                  <div className="mb-12">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 rounded-lg bg-gradient-to-br from-amber-500/20 to-orange-500/20">
                        <Sparkles className="w-5 h-5 text-amber-600" />
                      </div>
                      <h2 className="text-2xl font-serif font-semibold text-foreground">
                        Workshopy
                      </h2>
                    </div>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
                      {upcomingWorkshops.map((item, index) => (
                        <motion.div
                          key={item.workshop.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <WorkshopCard
                            workshop={item.workshop}
                            date={item.date}
                            registeredCount={item.registeredCount}
                            onSelect={() => handleSelectWorkshop(item.workshop, item.date)}
                          />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </ScrollReveal>
              )}

              {/* Classes section */}
              {!isLoading && !error && hasClasses && (
                <ScrollReveal delay={hasWorkshops ? 0.2 : 0.1} variants={fadeUpVariants}>
                  <div className="mb-12">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Calendar className="w-5 h-5 text-primary" />
                      </div>
                      <h2 className="text-2xl font-serif font-semibold text-foreground">
                        Pravidelné lekce
                      </h2>
                    </div>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
                      {upcomingClasses.map((item, index) => (
                        <motion.div
                          key={`${item.instance.id}-${index}`}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <ClassCard
                            classData={item.class}
                            instance={item.instance}
                            date={item.date}
                            registeredCount={item.registeredCount}
                            onSelect={() => handleSelectClass(item.class, item.instance, item.date)}
                          />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </ScrollReveal>
              )}

              {/* Info section */}
              {!isLoading && !error && hasContent && (
                <ScrollReveal delay={0.4} className="mt-8">
                  <div className="max-w-2xl mx-auto text-center">
                    <Alert className="bg-accent/20 border-accent/30">
                      <Info className="h-4 w-4 text-primary" />
                      <AlertDescription className="text-sm text-foreground">
                        <strong>Důležité informace:</strong> Rezervace je závazná.
                        V případě, že se nemůžete zúčastnit, kontaktujte nás prosím
                        telefonicky nebo emailem minimálně 24 hodin předem.
                      </AlertDescription>
                    </Alert>
                  </div>
                </ScrollReveal>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="relative mt-auto border-t border-border/50 bg-card/30">
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p>
              &copy; {new Date().getFullYear()} TaYoga Kroměříž. Všechna práva vyhrazena.
            </p>
            <div className="flex items-center gap-6">
              <Link to="/" className="hover:text-primary transition-colors">
                Zpět na web
              </Link>
              <a href="tel:+420774515599" className="hover:text-primary transition-colors">
                +420 774 515 599
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Rezervace
