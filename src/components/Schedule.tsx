import React, { useState, useCallback, lazy, Suspense } from 'react';
import { Calendar as CalendarIcon, Clock, CreditCard, Info, Loader2, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ScrollReveal, fadeUpVariants } from '@/components/ui/scroll-animations';
import { motion } from 'framer-motion';
import { Calendar } from '@/components/ui/calendar';
import { Skeleton } from '@/components/ui/skeleton';
import { format, addMonths, startOfDay } from 'date-fns';
import { useUpcomingSchedule, getLessonWithRegistrations } from '@/hooks/useUpcomingSchedule';
import type { ScheduleItem } from '@/types/database';

// Lazy load components that need Supabase
const LessonPicker = lazy(() => import('@/components/LessonPicker'));
const LessonDetailModal = lazy(() => import('@/components/reservation/LessonDetailModal'));

const Schedule = () => {
  // Responsive months count - start with 2 (SSR default), update on client
  const [months, setMonths] = React.useState(2);

  // Data from hook
  const { weeklySchedule, lessonsByDate, lessonDates, isLoading, error } = useUpcomingSchedule(6);

  // Modal states
  const [selectedLesson, setSelectedLesson] = useState<ScheduleItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Picker state (for multiple lessons on same day)
  const [pickerDate, setPickerDate] = useState<Date | null>(null);
  const [pickerItems, setPickerItems] = useState<ScheduleItem[]>([]);
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  // Loading state for single lesson click
  const [loadingDay, setLoadingDay] = useState<string | null>(null);

  // Responsive listener
  React.useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(max-width: 640px)');
    const update = () => setMonths(mq.matches ? 1 : 2);
    update();
    mq.addEventListener?.('change', update) ?? mq.addListener?.(update);
    return () => {
      mq.removeEventListener?.('change', update) ?? mq.removeListener?.(update);
    };
  }, []);

  // Handle day click on calendar
  const handleDayClick = useCallback(async (day: Date) => {
    const dateKey = format(day, 'yyyy-MM-dd');
    const items = lessonsByDate.get(dateKey);

    if (!items || items.length === 0) return;

    if (items.length === 1) {
      // Single lesson - load details and open modal directly
      setLoadingDay(dateKey);
      try {
        const fullItem = await getLessonWithRegistrations(items[0]);
        setSelectedLesson(fullItem);
        setIsModalOpen(true);
      } catch (err) {
        console.error('Error loading lesson:', err);
        // Fall back to basic info
        setSelectedLesson(items[0]);
        setIsModalOpen(true);
      } finally {
        setLoadingDay(null);
      }
    } else {
      // Multiple lessons - show picker
      setPickerDate(day);
      setPickerItems(items);
      setIsPickerOpen(true);
    }
  }, [lessonsByDate]);

  // Handle lesson selection from picker
  const handleSelectLesson = useCallback((item: ScheduleItem) => {
    setSelectedLesson(item);
    setIsModalOpen(true);
  }, []);

  // Calendar date range
  const today = startOfDay(new Date());
  const monthEnd = addMonths(today, 6);

  return (
    <section id="schedule" className="relative py-20 px-4 bg-gradient-to-br from-secondary/20 via-background to-accent/10 dark:from-background dark:via-card/50 dark:to-background">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <ScrollReveal>
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
              Rozvrh lekcí
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Kurzy jógy s pomůckami pod vedením Barbory Zapletalové
            </p>
          </div>
        </ScrollReveal>

        {/* Grid layout */}
        <div className="lg:grid lg:grid-cols-[450px,1fr] lg:gap-8 lg:items-start">
          {/* Left sticky panel - Weekly schedule */}
          <div className="lg:sticky lg:top-24 mb-8 lg:mb-0">
            <ScrollReveal delay={0.1} variants={fadeUpVariants}>
              <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                <Card className="h-full shadow-lg hover:shadow-xl transition-all duration-300 bg-card/90 backdrop-blur-sm border-primary/10">
                  <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-t-lg">
                    <CardTitle className="flex items-center gap-2 text-2xl font-serif text-foreground">
                      <CalendarIcon className="w-6 h-6 text-primary" />
                      Týdenní rozvrh
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">Pravidelné lekce během týdne</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    {isLoading ? (
                      // Loading skeleton
                      <div className="space-y-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <div key={i} className="flex border-b border-border/50 pb-3">
                            <Skeleton className="w-28 h-5" />
                            <div className="flex-1 space-y-2">
                              <Skeleton className="h-5 w-3/4" />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : error ? (
                      // Error state
                      <div className="text-center py-8 text-muted-foreground">
                        <p>Nepodařilo se načíst rozvrh</p>
                      </div>
                    ) : (
                      // Weekly schedule - elegant grid layout (only days with lessons)
                      <div className="space-y-0">
                        {weeklySchedule.filter(day => day.slots.length > 0).map((day, dayIdx) => (
                          <motion.div
                            key={day.day}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: dayIdx * 0.04 }}
                            className="grid grid-cols-[90px_1fr] gap-3 py-3 border-b border-border/40 last:border-0"
                          >
                            {/* Day name - fixed width, aligned top */}
                            <div className="font-semibold text-foreground/90 pt-0.5">
                              {day.day}
                            </div>

                            {/* Lessons column */}
                            <div>
                              {day.slots.length > 0 ? (
                                <div className="space-y-2.5">
                                  {day.slots.map((slot, idx) => (
                                    <div
                                      key={idx}
                                      className="group relative pl-3 border-l-2 border-primary/30 hover:border-primary/60 transition-colors"
                                    >
                                      {/* Lesson name */}
                                      <div className="text-foreground font-medium leading-snug">
                                        {slot.label}
                                      </div>
                                      {/* Time */}
                                      <div className="flex items-center gap-1.5 mt-0.5 text-sm text-muted-foreground">
                                        <Clock className="w-3 h-3 text-primary/50" />
                                        <span>{slot.time}</span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <span className="text-muted-foreground/40 italic">—</span>
                              )}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}

                    <Alert className="mt-6 bg-primary/10 border-primary/30 dark:bg-primary/20">
                      <Info className="h-4 w-4 text-primary" />
                      <AlertDescription className="text-sm font-medium">
                        <strong className="text-foreground">Rezervace předem nutná!</strong>
                        <br />
                        <span className="text-muted-foreground">Klikněte na den v kalendáři pro rezervaci.</span>
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>
              </motion.div>
            </ScrollReveal>
          </div>

          {/* Right panel - Alert + Interactive calendar */}
          <ScrollReveal delay={0.2} variants={fadeUpVariants} className="flex flex-col h-full">
            {/* Studio closure alert */}
            <div className="mb-4">
              <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/5">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground text-sm mb-1">Upozornění</h4>
                    <p className="text-sm text-muted-foreground">
                      V termínu <span className="font-medium text-foreground">26. 1. až 16. 2.</span> je studio uzavřeno.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Calendar card */}
            <motion.div whileHover={{ scale: 1.01 }} transition={{ duration: 0.2 }} className="flex-1">
              <Card className="h-full shadow-lg hover:shadow-xl transition-all duration-300 bg-card/80 backdrop-blur-sm border-accent/10">
                <CardHeader className="bg-gradient-to-r from-accent/10 to-secondary/10 rounded-t-lg">
                  <CardTitle className="flex items-center gap-2 text-2xl font-serif text-foreground">
                    <Clock className="w-6 h-6 text-primary" />
                    Kalendář lekcí
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Klikněte na zvýrazněný den pro rezervaci
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  {isLoading ? (
                    // Loading skeleton for calendar
                    <div className="space-y-4">
                      <Skeleton className="h-8 w-32 mx-auto" />
                      <Skeleton className="h-64 w-full" />
                    </div>
                  ) : error ? (
                    // Error state
                    <div className="text-center py-8 text-muted-foreground">
                      <p>Nepodařilo se načíst kalendář</p>
                    </div>
                  ) : lessonDates.length === 0 ? (
                    // Empty state
                    <div className="text-center py-8 text-muted-foreground">
                      <CalendarIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Žádné nadcházející lekce</p>
                    </div>
                  ) : (
                    // Interactive calendar
                    <div className="space-y-4">
                      <Calendar
                        mode="multiple"
                        selected={lessonDates}
                        defaultMonth={today}
                        fromMonth={today}
                        toMonth={monthEnd}
                        numberOfMonths={months}
                        onDayClick={handleDayClick}
                        modifiers={{
                          hasLesson: lessonDates,
                          loading: loadingDay ? [new Date(loadingDay)] : [],
                        }}
                        modifiersClassNames={{
                          hasLesson: 'cursor-pointer hover:scale-110 transition-transform',
                          loading: 'animate-pulse',
                        }}
                        disabled={(date) => {
                          const dateKey = format(date, 'yyyy-MM-dd');
                          return !lessonsByDate.has(dateKey) || (lessonsByDate.get(dateKey)?.length ?? 0) === 0;
                        }}
                        className="pointer-events-auto"
                      />

                      {/* Legend */}
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground pt-2 border-t border-border/50">
                        <div className="flex items-center gap-2">
                          <span className="inline-block h-3 w-3 rounded-full bg-primary/60" />
                          <span>Den s lekcí</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="inline-block h-3 w-3 rounded-full bg-muted" />
                          <span>Bez lekce</span>
                        </div>
                      </div>

                      {/* Loading indicator */}
                      {loadingDay && (
                        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Načítám detaily...</span>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </ScrollReveal>
        </div>

        {/* Pricing section - refined */}
        <ScrollReveal delay={0.4} variants={fadeUpVariants} className="mt-12">
          <Card className="shadow-lg bg-card/95 border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl font-serif text-foreground">
                <CreditCard className="w-6 h-6 text-primary" />
                Ceník
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                {/* Otevřená lekce */}
                <div className="h-full p-5 rounded-xl border border-border/50 bg-background/50 hover:border-primary/40 hover:shadow-sm transition-all duration-300">
                  <div className="flex items-start justify-between mb-4">
                    <h4 className="font-serif text-lg font-semibold text-foreground">
                      Otevřená lekce
                    </h4>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-primary">250</span>
                      <span className="text-sm text-muted-foreground ml-1">Kč</span>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground mb-4">75 minut</p>

                  <div className="space-y-2 pt-3 border-t border-border/40">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Pro frekventanty kurzů</span>
                      <span className="font-medium text-primary">210 Kč</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">3 zkušební lekce</span>
                      <span className="font-medium text-foreground">210 Kč</span>
                    </div>
                  </div>
                </div>

                {/* Individuální lekce */}
                <div className="h-full p-5 rounded-xl border border-border/50 bg-background/50 hover:border-primary/40 hover:shadow-sm transition-all duration-300">
                  <div className="flex items-start justify-between mb-4">
                    <h4 className="font-serif text-lg font-semibold text-foreground">
                      Individuální lekce
                    </h4>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-primary">1000</span>
                      <span className="text-sm text-muted-foreground ml-1">Kč</span>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground mb-4">60 minut</p>

                  <div className="space-y-2 pt-3 border-t border-border/40">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="w-1 h-1 bg-primary/60 rounded-full" />
                      Osobní přístup
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="w-1 h-1 bg-primary/60 rounded-full" />
                      Lekce na míru
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </ScrollReveal>
      </div>

      {/* Lazy loaded modals */}
      <Suspense fallback={null}>
        {/* Lesson picker for multiple lessons */}
        {pickerDate && (
          <LessonPicker
            items={pickerItems}
            date={pickerDate}
            open={isPickerOpen}
            onOpenChange={setIsPickerOpen}
            onSelectLesson={handleSelectLesson}
          />
        )}

        {/* Lesson detail modal */}
        <LessonDetailModal
          item={selectedLesson}
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
        />
      </Suspense>
    </section>
  );
};

export default Schedule;
