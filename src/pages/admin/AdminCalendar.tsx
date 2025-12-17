import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Calendar as CalendarIcon,
  Users,
  Clock,
  X,
  Trash2,
  Mail,
  Phone,
  MessageSquare,
  Loader2,
  AlertCircle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Calendar } from '@/components/ui/calendar'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useUpcomingClasses, useCancelInstance } from '@/hooks/useClasses'
import { useInstanceRegistrations, useDeleteRegistration } from '@/hooks/useRegistrations'
import { format, startOfMonth, endOfMonth, addMonths, subMonths } from 'date-fns'
import { cs } from 'date-fns/locale'
import type { RecurringClass, ClassInstance } from '@/types/database'

interface SelectedLesson {
  classData: RecurringClass
  instance: ClassInstance
  date: Date
  registeredCount: number
}

const AdminCalendar: React.FC = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedLesson, setSelectedLesson] = useState<SelectedLesson | null>(null)
  const [cancelConfirm, setCancelConfirm] = useState<SelectedLesson | null>(null)
  const [deleteRegistrationId, setDeleteRegistrationId] = useState<string | null>(null)

  const { data: upcomingClasses, isLoading } = useUpcomingClasses(60) // 60 days
  const cancelInstance = useCancelInstance()
  const deleteRegistration = useDeleteRegistration()
  const { data: registrations, isLoading: registrationsLoading } = useInstanceRegistrations(
    selectedLesson?.instance.id
  )

  // Get dates that have classes
  const classDates = upcomingClasses?.map(c => c.date) ?? []

  // Get classes for selected date
  const getClassesForDate = (date: Date) => {
    return upcomingClasses?.filter(c =>
      format(c.date, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    ) ?? []
  }

  const handleSelectDate = (date: Date | undefined) => {
    if (!date) return
    const classes = getClassesForDate(date)
    if (classes.length === 1) {
      const c = classes[0]
      setSelectedLesson({
        classData: c.class,
        instance: c.instance,
        date: c.date,
        registeredCount: c.registeredCount
      })
    }
  }

  const handleCancelLesson = async () => {
    if (!cancelConfirm) return
    await cancelInstance.mutateAsync({
      id: cancelConfirm.instance.id,
      cancelled: true
    })
    setCancelConfirm(null)
    setSelectedLesson(null)
  }

  const handleDeleteRegistration = async () => {
    if (!deleteRegistrationId) return
    await deleteRegistration.mutateAsync(deleteRegistrationId)
    setDeleteRegistrationId(null)
  }

  const formatTime = (time: string) => time.slice(0, 5)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-serif font-bold text-foreground">Kalendář</h1>
        <p className="text-muted-foreground mt-1">
          Přehled lekcí a registrovaných účastníků
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[350px,1fr]">
        {/* Calendar */}
        <Card className="bg-card/80 border-border/50">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-serif">
                {format(currentMonth, 'LLLL yyyy', { locale: cs })}
              </CardTitle>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedLesson?.date}
              onSelect={handleSelectDate}
              month={currentMonth}
              onMonthChange={setCurrentMonth}
              modifiers={{
                hasClass: classDates
              }}
              modifiersStyles={{
                hasClass: {
                  backgroundColor: 'hsl(var(--primary) / 0.2)',
                  fontWeight: 'bold'
                }
              }}
              className="rounded-md"
            />
            <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground">
              <span className="w-4 h-4 rounded bg-primary/20" />
              <span>Dny s lekcemi</span>
            </div>
          </CardContent>
        </Card>

        {/* Lesson list / details */}
        <Card className="bg-card/80 border-border/50">
          <CardHeader>
            <CardTitle className="text-lg font-serif">
              {selectedLesson
                ? format(selectedLesson.date, 'EEEE d. MMMM yyyy', { locale: cs })
                : 'Lekce v tomto období'}
            </CardTitle>
            <CardDescription>
              {selectedLesson
                ? 'Detail lekce a registrovaní účastníci'
                : 'Vyberte den v kalendáři pro detail'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AnimatePresence mode="wait">
              {/* No selection - show upcoming list */}
              {!selectedLesson && (
                <motion.div
                  key="list"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin text-primary" />
                    </div>
                  ) : !upcomingClasses?.length ? (
                    <p className="text-center text-muted-foreground py-8">
                      Žádné nadcházející lekce
                    </p>
                  ) : (
                    <div className="space-y-3 max-h-[500px] overflow-y-auto">
                      {upcomingClasses.slice(0, 10).map((item) => (
                        <motion.div
                          key={item.instance.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-4 rounded-lg bg-accent/30 border border-border/50 cursor-pointer hover:bg-accent/50 transition-colors"
                          onClick={() => setSelectedLesson({
                            classData: item.class,
                            instance: item.instance,
                            date: item.date,
                            registeredCount: item.registeredCount
                          })}
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="font-semibold text-foreground">
                                {item.class.title}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {format(item.date, 'EEEE d. MMMM', { locale: cs })}
                              </p>
                            </div>
                            <div className="text-right">
                              <Badge variant={item.registeredCount >= item.class.capacity ? 'secondary' : 'outline'}>
                                {item.registeredCount}/{item.instance.capacity_override ?? item.class.capacity}
                              </Badge>
                              <p className="text-xs text-muted-foreground mt-1">
                                {formatTime(item.class.time_start)}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {/* Selected lesson detail */}
              {selectedLesson && (
                <motion.div
                  key="detail"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  {/* Lesson info */}
                  <div className="p-4 rounded-lg bg-accent/30 border border-border/50">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-foreground">
                          {selectedLesson.classData.title}
                        </h3>
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {formatTime(selectedLesson.classData.time_start)} - {formatTime(selectedLesson.classData.time_end)}
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {selectedLesson.registeredCount}/{selectedLesson.instance.capacity_override ?? selectedLesson.classData.capacity}
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSelectedLesson(null)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setCancelConfirm(selectedLesson)}
                      >
                        <AlertCircle className="w-4 h-4 mr-2" />
                        Zrušit lekci
                      </Button>
                    </div>
                  </div>

                  {/* Registrations */}
                  <div>
                    <h4 className="font-semibold text-foreground mb-3">
                      Registrovaní účastníci ({registrations?.length ?? 0})
                    </h4>

                    {registrationsLoading ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="w-6 h-6 animate-spin text-primary" />
                      </div>
                    ) : !registrations?.length ? (
                      <p className="text-center text-muted-foreground py-8">
                        Zatím žádné registrace
                      </p>
                    ) : (
                      <div className="rounded-lg border border-border overflow-hidden">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Jméno</TableHead>
                              <TableHead>Kontakt</TableHead>
                              <TableHead>Poznámka</TableHead>
                              <TableHead className="w-[50px]"></TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {registrations.map((reg) => (
                              <TableRow key={reg.id}>
                                <TableCell className="font-medium">
                                  {reg.name}
                                </TableCell>
                                <TableCell>
                                  <div className="space-y-1">
                                    <div className="flex items-center gap-1 text-sm">
                                      <Mail className="w-3 h-3 text-muted-foreground" />
                                      <a href={`mailto:${reg.email}`} className="hover:text-primary">
                                        {reg.email}
                                      </a>
                                    </div>
                                    {reg.phone && (
                                      <div className="flex items-center gap-1 text-sm">
                                        <Phone className="w-3 h-3 text-muted-foreground" />
                                        <a href={`tel:${reg.phone}`} className="hover:text-primary">
                                          {reg.phone}
                                        </a>
                                      </div>
                                    )}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  {reg.note && (
                                    <div className="flex items-start gap-1 text-sm text-muted-foreground">
                                      <MessageSquare className="w-3 h-3 mt-0.5 flex-shrink-0" />
                                      <span className="line-clamp-2">{reg.note}</span>
                                    </div>
                                  )}
                                </TableCell>
                                <TableCell>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                    onClick={() => setDeleteRegistrationId(reg.id)}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </div>

      {/* Cancel lesson confirmation */}
      <AlertDialog open={!!cancelConfirm} onOpenChange={() => setCancelConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Zrušit lekci?</AlertDialogTitle>
            <AlertDialogDescription>
              Opravdu chcete zrušit lekci "{cancelConfirm?.classData.title}" dne{' '}
              {cancelConfirm && format(cancelConfirm.date, 'd. MMMM yyyy', { locale: cs })}?
              {cancelConfirm && cancelConfirm.registeredCount > 0 && (
                <span className="block mt-2 font-medium text-destructive">
                  Na tuto lekci je registrováno {cancelConfirm.registeredCount} účastníků!
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Ne, ponechat</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancelLesson}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {cancelInstance.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Ano, zrušit
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete registration confirmation */}
      <AlertDialog open={!!deleteRegistrationId} onOpenChange={() => setDeleteRegistrationId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Smazat registraci?</AlertDialogTitle>
            <AlertDialogDescription>
              Opravdu chcete smazat tuto registraci? Tato akce je nevratná.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Zrušit</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteRegistration}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteRegistration.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Smazat
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default AdminCalendar
