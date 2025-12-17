import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Users,
  Mail,
  Phone,
  Calendar,
  ChevronDown,
  ChevronUp,
  Search,
  Loader2,
  Sparkles,
  BookOpen,
  Filter,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { format } from 'date-fns'
import { cs } from 'date-fns/locale'
import { useVisitors, type Visitor } from '@/hooks/useRegistrations'

type FilterType = 'all' | 'class' | 'workshop' | string

const AdminVisitors: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const { data: visitors, isLoading, error } = useVisitors()
  const [searchTerm, setSearchTerm] = useState('')
  const [expandedVisitor, setExpandedVisitor] = useState<string | null>(null)
  const [filterType, setFilterType] = useState<FilterType>('all')

  // Read filter from URL on mount
  useEffect(() => {
    const urlFilter = searchParams.get('filter')
    if (urlFilter) {
      setFilterType(urlFilter)
    }
  }, [searchParams])

  // Update URL when filter changes
  const handleFilterChange = (newFilter: FilterType) => {
    setFilterType(newFilter)
    if (newFilter === 'all') {
      searchParams.delete('filter')
    } else {
      searchParams.set('filter', newFilter)
    }
    setSearchParams(searchParams)
  }

  // Get unique event titles for filtering
  const eventTitles = React.useMemo(() => {
    if (!visitors) return []
    const titles = new Set<string>()
    visitors.forEach(v => {
      v.registrations.forEach(r => titles.add(r.title))
    })
    return Array.from(titles).sort()
  }, [visitors])

  const filteredVisitors = visitors?.filter(visitor => {
    // Text search
    const search = searchTerm.toLowerCase()
    const matchesSearch =
      visitor.name.toLowerCase().includes(search) ||
      visitor.email.toLowerCase().includes(search) ||
      (visitor.phone && visitor.phone.includes(search))

    if (!matchesSearch) return false

    // Type/event filter
    if (filterType === 'all') return true
    if (filterType === 'class') {
      return visitor.registrations.some(r => r.type === 'class')
    }
    if (filterType === 'workshop') {
      return visitor.registrations.some(r => r.type === 'workshop')
    }
    // Filter by specific event title
    return visitor.registrations.some(r => r.title === filterType)
  })

  const toggleExpand = (email: string) => {
    setExpandedVisitor(expandedVisitor === email ? null : email)
  }

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-'
    try {
      return format(new Date(dateStr), 'd. M. yyyy', { locale: cs })
    } catch {
      return dateStr
    }
  }

  const formatDateTime = (dateStr: string) => {
    if (!dateStr) return '-'
    try {
      return format(new Date(dateStr), 'd. M. yyyy HH:mm', { locale: cs })
    } catch {
      return dateStr
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-20 text-destructive">
        Nepodařilo se načíst data návštěvníků
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Návštěvníci</h1>
          <p className="text-muted-foreground">
            {filteredVisitors?.length || 0} z {visitors?.length || 0} návštěvníků
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Event filter */}
          <Select value={filterType} onValueChange={handleFilterChange}>
            <SelectTrigger className={`w-full sm:w-[200px] ${filterType !== 'all' ? 'border-primary' : ''}`}>
              <div className="flex items-center gap-2">
                {filterType !== 'all' && <Filter className="w-3 h-3 text-primary" />}
                <SelectValue placeholder="Filtrovat podle..." />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Všichni návštěvníci</SelectItem>
              <SelectItem value="class">
                <span className="flex items-center gap-2">
                  <BookOpen className="w-3 h-3 text-primary" />
                  Pouze lekce
                </span>
              </SelectItem>
              <SelectItem value="workshop">
                <span className="flex items-center gap-2">
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  Pouze workshopy
                </span>
              </SelectItem>
              {eventTitles.length > 0 && (
                <>
                  <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground border-t mt-1 pt-2">
                    Konkrétní akce
                  </div>
                  {eventTitles.map(title => (
                    <SelectItem key={title} value={title}>
                      {title}
                    </SelectItem>
                  ))}
                </>
              )}
            </SelectContent>
          </Select>

          {/* Search */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Hledat podle jména, emailu..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{visitors?.length || 0}</p>
                <p className="text-sm text-muted-foreground">Celkem návštěvníků</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/10">
                <BookOpen className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {visitors?.reduce((sum, v) => sum + v.registrations.filter(r => r.type === 'class').length, 0) || 0}
                </p>
                <p className="text-sm text-muted-foreground">Registrací na lekce</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-500/10">
                <Sparkles className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {visitors?.reduce((sum, v) => sum + v.registrations.filter(r => r.type === 'workshop').length, 0) || 0}
                </p>
                <p className="text-sm text-muted-foreground">Registrací na workshopy</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Visitors list */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Seznam návštěvníků
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!filteredVisitors || filteredVisitors.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              {searchTerm || filterType !== 'all'
                ? 'Žádní návštěvníci nenalezeni pro zvolený filtr'
                : 'Zatím žádní návštěvníci'}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredVisitors.map((visitor) => (
                <VisitorCard
                  key={visitor.email}
                  visitor={visitor}
                  isExpanded={expandedVisitor === visitor.email}
                  onToggle={() => toggleExpand(visitor.email)}
                  formatDate={formatDate}
                  formatDateTime={formatDateTime}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

interface VisitorCardProps {
  visitor: Visitor
  isExpanded: boolean
  onToggle: () => void
  formatDate: (date: string) => string
  formatDateTime: (date: string) => string
}

const VisitorCard: React.FC<VisitorCardProps> = ({
  visitor,
  isExpanded,
  onToggle,
  formatDate,
  formatDateTime,
}) => {
  const classCount = visitor.registrations.filter(r => r.type === 'class').length
  const workshopCount = visitor.registrations.filter(r => r.type === 'workshop').length

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="border border-border rounded-lg overflow-hidden"
    >
      {/* Main row */}
      <button
        onClick={onToggle}
        className="w-full p-4 flex items-center justify-between hover:bg-accent/50 transition-colors text-left"
      >
        <div className="flex items-center gap-4 flex-1 min-w-0">
          {/* Avatar placeholder */}
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <span className="text-sm font-semibold text-primary">
              {visitor.name.charAt(0).toUpperCase()}
            </span>
          </div>

          {/* Info */}
          <div className="min-w-0 flex-1">
            <p className="font-medium text-foreground truncate">{visitor.name}</p>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1 truncate">
                <Mail className="w-3 h-3 flex-shrink-0" />
                <span className="truncate">{visitor.email}</span>
              </span>
              {visitor.phone && (
                <span className="hidden sm:flex items-center gap-1">
                  <Phone className="w-3 h-3" />
                  {visitor.phone}
                </span>
              )}
            </div>
          </div>

          {/* Badges */}
          <div className="hidden md:flex items-center gap-2">
            {classCount > 0 && (
              <Badge variant="secondary" className="bg-primary/10 text-primary border-0">
                <BookOpen className="w-3 h-3 mr-1" />
                {classCount} {classCount === 1 ? 'lekce' : classCount < 5 ? 'lekce' : 'lekcí'}
              </Badge>
            )}
            {workshopCount > 0 && (
              <Badge variant="secondary" className="bg-amber-500/10 text-amber-600 border-0">
                <Sparkles className="w-3 h-3 mr-1" />
                {workshopCount} {workshopCount === 1 ? 'workshop' : workshopCount < 5 ? 'workshopy' : 'workshopů'}
              </Badge>
            )}
          </div>

          {/* Stats */}
          <div className="hidden lg:block text-right">
            <p className="text-sm text-muted-foreground">
              První návštěva: {formatDate(visitor.firstVisit)}
            </p>
            <p className="text-sm text-muted-foreground">
              Poslední: {formatDate(visitor.lastVisit)}
            </p>
          </div>
        </div>

        {/* Expand button */}
        <div className="ml-4">
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-5 h-5 text-muted-foreground" />
          )}
        </div>
      </button>

      {/* Expanded content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 border-t border-border bg-accent/30">
              {/* Mobile badges */}
              <div className="flex items-center gap-2 py-3 md:hidden">
                {classCount > 0 && (
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-0">
                    <BookOpen className="w-3 h-3 mr-1" />
                    {classCount} {classCount === 1 ? 'lekce' : classCount < 5 ? 'lekce' : 'lekcí'}
                  </Badge>
                )}
                {workshopCount > 0 && (
                  <Badge variant="secondary" className="bg-amber-500/10 text-amber-600 border-0">
                    <Sparkles className="w-3 h-3 mr-1" />
                    {workshopCount} {workshopCount === 1 ? 'workshop' : workshopCount < 5 ? 'workshopy' : 'workshopů'}
                  </Badge>
                )}
              </div>

              {/* Contact info for mobile */}
              {visitor.phone && (
                <div className="flex items-center gap-2 py-2 sm:hidden text-sm text-muted-foreground">
                  <Phone className="w-4 h-4" />
                  <a href={`tel:${visitor.phone}`} className="hover:text-primary">
                    {visitor.phone}
                  </a>
                </div>
              )}

              {/* Visit dates for mobile/tablet */}
              <div className="flex flex-col sm:flex-row sm:gap-6 py-2 lg:hidden text-sm text-muted-foreground">
                <span>První návštěva: {formatDate(visitor.firstVisit)}</span>
                <span>Poslední návštěva: {formatDate(visitor.lastVisit)}</span>
              </div>

              {/* Registrations list */}
              <div className="mt-3">
                <p className="text-sm font-medium text-foreground mb-2">Historie registrací:</p>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {visitor.registrations
                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                    .map((reg) => (
                      <div
                        key={reg.id}
                        className="flex items-center justify-between p-2 rounded-lg bg-background/50 text-sm"
                      >
                        <div className="flex items-center gap-2">
                          {reg.type === 'class' ? (
                            <BookOpen className="w-4 h-4 text-primary" />
                          ) : (
                            <Sparkles className="w-4 h-4 text-amber-500" />
                          )}
                          <span className="font-medium">{reg.title}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="w-3 h-3" />
                          <span>{formatDate(reg.date)}</span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default AdminVisitors
