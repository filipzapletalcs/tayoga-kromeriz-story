import React from 'react'
import { motion } from 'framer-motion'
import { Calendar, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ScrollReveal } from '@/components/ui/scroll-animations'
import ScheduleCalendar from '@/components/reservation/ScheduleCalendar'
import logoSvg from '@/assets/TaYoga_Logo.svg'

const Rezervace: React.FC = () => {
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
              <span>Rozvrh a rezervace</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="relative container mx-auto px-6 py-12">
        {/* Page header */}
        <ScrollReveal>
          <div className="text-center mb-10">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4"
            >
              Rozvrh
              <span className="text-primary"> lekcí</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg text-muted-foreground max-w-xl mx-auto"
            >
              Vyberte si lekci a rezervujte si své místo online.
            </motion.p>
          </div>
        </ScrollReveal>

        {/* Schedule Calendar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <ScheduleCalendar />
        </motion.div>
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
