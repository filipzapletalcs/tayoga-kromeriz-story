import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Plus,
  Edit2,
  Trash2,
  Clock,
  Users,
  MoreVertical,
  Loader2,
  CalendarCheck,
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
  useOneTimeClassesWithCounts,
  useCreateOneTimeClass,
  useUpdateOneTimeClass,
  useDeleteOneTimeClass,
  type OneTimeClassWithCount,
} from '@/hooks/useOneTimeClasses'
import { format } from 'date-fns'
import { cs } from 'date-fns/locale'
import type { OneTimeClassInsert } from '@/types/database'
import InlineDatePicker from '@/components/admin/InlineDatePicker'

const AdminOneTimeClasses: React.FC = () => {
  const navigate = useNavigate()
  const { data: classes, isLoading } = useOneTimeClassesWithCounts()
  const createClass = useCreateOneTimeClass()
  const updateClass = useUpdateOneTimeClass()
  const deleteClass = useDeleteOneTimeClass()

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingClass, setEditingClass] = useState<OneTimeClassWithCount | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const [formData, setFormData] = useState<OneTimeClassInsert>({
    title: '',
    description: '',
    date: '',
    time_start: '09:00',
    time_end: '10:30',
    capacity: 12,
    reserved_spots: 0,
    price: 250,
    is_active: true,
  })

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      date: '',
      time_start: '09:00',
      time_end: '10:30',
      capacity: 12,
      reserved_spots: 0,
      price: 250,
      is_active: true,
    })
    setEditingClass(null)
  }

  const openCreateDialog = () => {
    resetForm()
    setIsDialogOpen(true)
  }

  const openEditDialog = (cls: OneTimeClassWithCount) => {
    setEditingClass(cls)
    setFormData({
      title: cls.title,
      description: cls.description || '',
      date: cls.date,
      time_start: cls.time_start,
      time_end: cls.time_end,
      capacity: cls.capacity,
      reserved_spots: cls.reserved_spots || 0,
      price: cls.price || 0,
      is_active: cls.is_active ?? true,
    })
    setIsDialogOpen(true)
  }

  const handleSubmit = async () => {
    if (editingClass) {
      await updateClass.mutateAsync({
        id: editingClass.id,
        updates: formData
      })
    } else {
      await createClass.mutateAsync(formData)
    }
    setIsDialogOpen(false)
    resetForm()
  }

  const handleDelete = async (id: string) => {
    await deleteClass.mutateAsync(id)
    setDeleteConfirm(null)
  }

  const formatTime = (time: string) => time.slice(0, 5)

  // Separate past and upcoming classes
  const today = new Date().toISOString().split('T')[0]
  const upcomingClasses = classes?.filter(c => c.date >= today) ?? []
  const pastClasses = classes?.filter(c => c.date < today) ?? []

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground">Jednorázové lekce</h1>
          <p className="text-muted-foreground mt-1">
            Speciální lekce s konkrétním datem
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
              <CalendarCheck className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Žádné jednorázové lekce
            </h3>
            <p className="text-muted-foreground text-center mb-4">
              Začněte přidáním první jednorázové lekce.
            </p>
            <Button onClick={openCreateDialog}>
              <Plus className="w-4 h-4 mr-2" />
              Přidat první lekci
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Upcoming classes */}
      {!isLoading && upcomingClasses.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Nadcházející</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {upcomingClasses.map((cls) => (
              <motion.div
                key={cls.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card
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
                        <p className="text-sm font-medium text-primary">
                          {format(new Date(cls.date), 'EEEE d. MMMM yyyy', { locale: cs })}
                        </p>
                        {cls.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
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
                        <span className={(cls.registeredCount + (cls.reserved_spots || 0)) >= cls.capacity ? 'text-destructive font-medium' : ''}>
                          {cls.registeredCount + (cls.reserved_spots || 0)}/{cls.capacity}
                        </span>
                        {(cls.registeredCount + (cls.reserved_spots || 0)) >= cls.capacity && (
                          <Badge variant="secondary" className="text-xs ml-1">Obsazeno</Badge>
                        )}
                      </div>
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
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Past classes */}
      {!isLoading && pastClasses.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-muted-foreground">Proběhlé</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {pastClasses.map((cls) => (
              <Card
                key={cls.id}
                className="bg-card/50 border-border/30 opacity-60"
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">
                        {cls.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(cls.date), 'd. MMMM yyyy', { locale: cs })}
                      </p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
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

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {formatTime(cls.time_start)} - {formatTime(cls.time_end)}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {cls.registeredCount + (cls.reserved_spots || 0)}/{cls.capacity}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-serif">
              {editingClass ? 'Upravit lekci' : 'Přidat jednorázovou lekci'}
            </DialogTitle>
            <DialogDescription>
              {editingClass
                ? 'Upravte detaily jednorázové lekce'
                : 'Vytvořte novou jednorázovou lekci'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Název lekce</Label>
              <Input
                id="title"
                placeholder="např. Ranní speciální lekce"
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

            {/* Inline Date Picker */}
            <InlineDatePicker
              label="Datum lekce"
              value={formData.date}
              onChange={(date) => setFormData({ ...formData, date })}
              minDate={new Date()}
            />

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
                <p className="text-xs text-muted-foreground">
                  Např. telefonické rezervace mimo systém
                </p>
              </div>
            </div>

            {/* Show available spots preview */}
            {formData.capacity > 0 && (
              <div className="p-3 rounded-lg bg-accent/30 border border-border/50">
                <p className="text-sm text-muted-foreground">
                  Volná místa pro online rezervace:{' '}
                  <span className="font-semibold text-foreground">
                    {Math.max(0, formData.capacity - (formData.reserved_spots || 0))}
                  </span>
                  {' '}z {formData.capacity}
                </p>
              </div>
            )}

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

            <div className="flex items-center justify-between pt-2">
              <Label htmlFor="is_active">Aktivní lekce</Label>
              <Switch
                id="is_active"
                checked={formData.is_active ?? true}
                onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Zrušit
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!formData.title || !formData.date || createClass.isPending || updateClass.isPending}
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
              Tato akce je nevratná. Lekce a všechny její registrace budou trvale smazány.
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

export default AdminOneTimeClasses
