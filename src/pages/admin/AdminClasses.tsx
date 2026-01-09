import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import {
  Plus,
  Edit2,
  Trash2,
  Clock,
  Users,
  MoreVertical,
  Loader2,
  Repeat,
  Eye
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
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
  useRecurringClasses,
  useCreateClass,
  useUpdateClass,
  useDeleteClass
} from '@/hooks/useClasses'
import { DAY_NAMES, type RecurringClass, type RecurringClassInsert } from '@/types/database'
import { LessonSchedulePicker, applySelectedDates } from '@/components/admin/LessonSchedulePicker'

const AdminClasses: React.FC = () => {
  const navigate = useNavigate()
  const { data: classes, isLoading } = useRecurringClasses()
  const createClass = useCreateClass()
  const updateClass = useUpdateClass()
  const deleteClass = useDeleteClass()

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingClass, setEditingClass] = useState<RecurringClass | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [selectedDates, setSelectedDates] = useState<Set<string>>(new Set())

  const [formData, setFormData] = useState<RecurringClassInsert>({
    title: '',
    description: '',
    day_of_week: 1,
    time_start: '18:00',
    time_end: '19:30',
    capacity: 10,
    reserved_spots: 0,
    price: 250,
    lesson_count: null,
    is_active: true,
  })

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      day_of_week: 1,
      time_start: '18:00',
      time_end: '19:30',
      capacity: 10,
      reserved_spots: 0,
      price: 250,
      lesson_count: null,
      is_active: true,
    })
    setEditingClass(null)
    setSelectedDates(new Set())
  }

  const openCreateDialog = () => {
    resetForm()
    setIsDialogOpen(true)
  }

  const openEditDialog = (cls: RecurringClass) => {
    setEditingClass(cls)
    setFormData({
      title: cls.title,
      description: cls.description || '',
      day_of_week: cls.day_of_week,
      time_start: cls.time_start,
      time_end: cls.time_end,
      capacity: cls.capacity,
      reserved_spots: cls.reserved_spots || 0,
      price: cls.price || 0,
      lesson_count: cls.lesson_count,
      is_active: cls.is_active ?? true,
    })
    setIsDialogOpen(true)
  }

  const handleSubmit = async () => {
    try {
      if (editingClass) {
        await updateClass.mutateAsync({
          id: editingClass.id,
          updates: formData
        })
        toast.success('Lekce byla úspěšně upravena')
      } else {
        // Create class first
        const newClass = await createClass.mutateAsync(formData)

        // Apply selected dates (creates instances for replacements, cancels skipped regular dates)
        if (selectedDates.size > 0 && newClass?.id) {
          await applySelectedDates(newClass.id, selectedDates, formData.day_of_week)
        }
        toast.success('Lekce byla úspěšně vytvořena')
      }
      setIsDialogOpen(false)
      resetForm()
    } catch (error) {
      console.error('Error saving class:', error)
      toast.error('Nepodařilo se uložit lekci. Zkuste to znovu.')
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteClass.mutateAsync(id)
      toast.success('Lekce byla úspěšně smazána')
      setDeleteConfirm(null)
    } catch (error) {
      console.error('Error deleting class:', error)
      toast.error('Nepodařilo se smazat lekci. Zkuste to znovu.')
      setDeleteConfirm(null)
    }
  }

  const formatTime = (time: string) => time.slice(0, 5)

  // Group classes by day
  const classesByDay = classes?.reduce((acc, cls) => {
    const day = cls.day_of_week
    if (!acc[day]) acc[day] = []
    acc[day].push(cls)
    return acc
  }, {} as Record<number, RecurringClass[]>) ?? {}

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground">Lekce</h1>
          <p className="text-muted-foreground mt-1">
            Správa pravidelných týdenních lekcí
          </p>
        </div>
        <Button onClick={openCreateDialog} className="w-fit">
          <Plus className="w-4 h-4 mr-2" />
          Přidat lekci
        </Button>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      )}

      {/* Empty state */}
      {!isLoading && (!classes || classes.length === 0) && (
        <Card className="bg-card/80 border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Clock className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Žádné lekce
            </h3>
            <p className="text-muted-foreground text-center mb-4">
              Začněte přidáním první pravidelné lekce.
            </p>
            <Button onClick={openCreateDialog}>
              <Plus className="w-4 h-4 mr-2" />
              Přidat první lekci
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Classes by day */}
      {!isLoading && classes && classes.length > 0 && (
        <div className="space-y-6">
          {[1, 2, 3, 4, 5, 6, 0].map((day) => {
            const dayClasses = classesByDay[day]
            if (!dayClasses?.length) return null

            return (
              <motion.div
                key={day}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h2 className="text-lg font-semibold text-foreground mb-3">
                  {DAY_NAMES[day]}
                </h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {dayClasses
                    .sort((a, b) => a.time_start.localeCompare(b.time_start))
                    .map((cls) => (
                      <Card
                        key={cls.id}
                        className={`
                          bg-card/80 border-border/50 transition-all duration-200
                          ${!cls.is_active ? 'opacity-60' : ''}
                        `}
                      >
                        <CardContent className="p-5">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold text-foreground">
                                  {cls.title}
                                </h3>
                                {!cls.is_active && (
                                  <Badge variant="secondary" className="text-xs">
                                    Neaktivní
                                  </Badge>
                                )}
                              </div>
                              {cls.description && (
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                  {cls.description}
                                </p>
                              )}
                            </div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreVertical className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => openEditDialog(cls)}>
                                  <Edit2 className="w-4 h-4 mr-2" />
                                  Upravit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => navigate(`/admin/visitors?filter=${encodeURIComponent(cls.title)}`)}
                                >
                                  <Eye className="w-4 h-4 mr-2" />
                                  Zobrazit návštěvníky
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => setDeleteConfirm(cls.id)}
                                  className="text-destructive"
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Smazat
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>

                          <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {formatTime(cls.time_start)} - {formatTime(cls.time_end)}
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              <span>{cls.capacity} míst</span>
                              <span className="text-muted-foreground/60">·</span>
                              <span className={Math.max(0, cls.capacity - (cls.reserved_spots || 0)) === 0 ? 'text-destructive font-medium' : 'text-primary font-medium'}>
                                {Math.max(0, cls.capacity - (cls.reserved_spots || 0))} volných
                              </span>
                            </div>
                            {cls.lesson_count && (
                              <div className="flex items-center gap-1">
                                <Repeat className="w-4 h-4" />
                                {cls.lesson_count} lekcí
                              </div>
                            )}
                          </div>

                          {cls.price && (
                            <div className="mt-3 pt-3 border-t border-border/50">
                              <span className="text-lg font-bold text-primary">
                                {cls.price} Kč
                              </span>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </motion.div>
            )
          })}
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-serif">
              {editingClass ? 'Upravit lekci' : 'Přidat lekci'}
            </DialogTitle>
            <DialogDescription>
              {editingClass
                ? 'Upravte detaily pravidelné lekce'
                : 'Vytvořte novou pravidelnou lekci'}
            </DialogDescription>
          </DialogHeader>

          <div className="grid md:grid-cols-2 gap-6 py-4">
            {/* Left column - Form fields */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Název lekce</Label>
                <Input
                  id="title"
                  placeholder="např. Kurz začátečníci"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Popis (volitelné)</Label>
                <Textarea
                  id="description"
                  placeholder="Krátký popis lekce..."
                  rows={2}
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>Den v týdnu</Label>
                <Select
                  value={String(formData.day_of_week)}
                  onValueChange={(v) => setFormData({ ...formData, day_of_week: parseInt(v) })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(DAY_NAMES).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="time_start">Začátek</Label>
                  <Input
                    id="time_start"
                    type="time"
                    value={formData.time_start}
                    onChange={(e) => setFormData({ ...formData, time_start: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="time_end">Konec</Label>
                  <Input
                    id="time_end"
                    type="time"
                    value={formData.time_end}
                    onChange={(e) => setFormData({ ...formData, time_end: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="capacity">Celková kapacita</Label>
                  <Input
                    id="capacity"
                    type="number"
                    min={1}
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 1 })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reserved_spots">Již obsazeno</Label>
                  <Input
                    id="reserved_spots"
                    type="number"
                    min={0}
                    max={formData.capacity - 1}
                    value={formData.reserved_spots || 0}
                    onChange={(e) => setFormData({ ...formData, reserved_spots: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>

              {/* Capacity preview */}
              <div className="rounded-lg bg-muted/50 p-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Volná místa:</span>
                  <span className="font-semibold">
                    {Math.max(0, (formData.capacity || 0) - (formData.reserved_spots || 0))} z {formData.capacity || 0}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Cena (Kč)</Label>
                  <Input
                    id="price"
                    type="number"
                    min={0}
                    value={formData.price || ''}
                    onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lesson_count">Počet lekcí</Label>
                  <Input
                    id="lesson_count"
                    type="number"
                    min={1}
                    placeholder="volitelné"
                    value={formData.lesson_count || ''}
                    onChange={(e) => setFormData({ ...formData, lesson_count: e.target.value ? parseInt(e.target.value) : null })}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <Label htmlFor="is_active">Aktivní lekce</Label>
                <Switch
                  id="is_active"
                  checked={formData.is_active ?? true}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
              </div>
            </div>

            {/* Right column - Schedule picker */}
            <div>
              <LessonSchedulePicker
                dayOfWeek={formData.day_of_week}
                lessonCount={formData.lesson_count}
                recurringClassId={editingClass?.id}
                selectedDates={editingClass ? undefined : selectedDates}
                onSelectedDatesChange={editingClass ? undefined : setSelectedDates}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Zrušit
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!formData.title || createClass.isPending || updateClass.isPending}
            >
              {(createClass.isPending || updateClass.isPending) ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : null}
              {editingClass ? 'Uložit' : 'Vytvořit'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <AlertDialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Smazat lekci?</AlertDialogTitle>
            <AlertDialogDescription>
              Tato akce je nevratná. Lekce a všechny její instance budou trvale smazány.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Zrušit</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteClass.isPending ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : null}
              Smazat
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default AdminClasses
