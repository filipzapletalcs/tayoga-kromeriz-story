import React from 'react'
import { motion } from 'framer-motion'
import { Calendar, Users, BookOpen, TrendingUp, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useRecurringClasses, useUpcomingClasses } from '@/hooks/useClasses'
import { format } from 'date-fns'
import { cs } from 'date-fns/locale'

const AdminDashboard: React.FC = () => {
  const { data: recurringClasses } = useRecurringClasses()
  const { data: upcomingClasses } = useUpcomingClasses(7)

  const activeClassesCount = recurringClasses?.filter(c => c.is_active).length ?? 0
  const totalUpcomingRegistrations = upcomingClasses?.reduce(
    (sum, c) => sum + c.registeredCount, 0
  ) ?? 0
  const upcomingLessonsCount = upcomingClasses?.length ?? 0

  const stats = [
    {
      title: 'Aktivní lekce',
      value: activeClassesCount,
      icon: BookOpen,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30',
    },
    {
      title: 'Lekce tento týden',
      value: upcomingLessonsCount,
      icon: Calendar,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-100 dark:bg-green-900/30',
    },
    {
      title: 'Registrace tento týden',
      value: totalUpcomingRegistrations,
      icon: Users,
      color: 'text-amber-600 dark:text-amber-400',
      bgColor: 'bg-amber-100 dark:bg-amber-900/30',
    },
  ]

  // Next 3 upcoming classes
  const nextClasses = upcomingClasses?.slice(0, 3) ?? []

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-serif font-bold text-foreground">Přehled</h1>
        <p className="text-muted-foreground mt-1">
          Vítejte v administraci rezervačního systému TaYoga
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="bg-card/80 border-border/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-3xl font-bold text-foreground mt-1">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Quick actions and upcoming classes */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Quick actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="h-full bg-card/80 border-border/50">
            <CardHeader>
              <CardTitle className="text-xl font-serif">Rychlé akce</CardTitle>
              <CardDescription>Správa rezervačního systému</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link to="/admin/classes">
                <Button variant="outline" className="w-full justify-between h-12 group">
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-5 h-5 text-primary" />
                    <span>Spravovat lekce</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/admin/calendar">
                <Button variant="outline" className="w-full justify-between h-12 group">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-primary" />
                    <span>Zobrazit kalendář</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <a href="/rezervace" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="w-full justify-between h-12 group">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    <span>Zobrazit rezervační stránku</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                </Button>
              </a>
            </CardContent>
          </Card>
        </motion.div>

        {/* Upcoming classes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="h-full bg-card/80 border-border/50">
            <CardHeader>
              <CardTitle className="text-xl font-serif">Nejbližší lekce</CardTitle>
              <CardDescription>Následující 3 lekce</CardDescription>
            </CardHeader>
            <CardContent>
              {nextClasses.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  Žádné nadcházející lekce
                </p>
              ) : (
                <div className="space-y-3">
                  {nextClasses.map((item, index) => (
                    <motion.div
                      key={item.instance.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className="flex items-center justify-between p-3 rounded-lg bg-accent/30 border border-border/50"
                    >
                      <div>
                        <p className="font-medium text-foreground">{item.class.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {format(item.date, 'EEEE d. MMMM', { locale: cs })} v {item.class.time_start.slice(0, 5)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-foreground">
                          {item.registeredCount}/{item.instance.capacity_override ?? item.class.capacity}
                        </p>
                        <p className="text-xs text-muted-foreground">registrací</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

export default AdminDashboard
