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
  CalendarDays,
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
  useWorkshops,
  useCreateWorkshop,
  useUpdateWorkshop,
  useDeleteWorkshop
} from '@/hooks/useWorkshops'
import { format } from 'date-fns'
import { cs } from 'date-fns/locale'
import type { Workshop, WorkshopInsert } from '@/types/database'
import InlineDatePicker from '@/components/admin/InlineDatePicker'

const AdminWorkshops: React.FC = () => {
  const navigate = useNavigate()
  const { data: workshops, isLoading } = useWorkshops()
  const createWorkshop = useCreateWorkshop()
  const updateWorkshop = useUpdateWorkshop()
  const deleteWorkshop = useDeleteWorkshop()

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingWorkshop, setEditingWorkshop] = useState<Workshop | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const [formData, setFormData] = useState<WorkshopInsert>({
    title: '',
    description: '',
    date: '',
    time_start: '10:00',
    time_end: '14:00',
    capacity: 15,
    price: 500,
    is_active: true,
  })

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      date: '',
      time_start: '10:00',
      time_end: '14:00',
      capacity: 15,
      price: 500,
      is_active: true,
    })
    setEditingWorkshop(null)
  }

  const openCreateDialog = () => {
    resetForm()
    setIsDialogOpen(true)
  }

  const openEditDialog = (workshop: Workshop) => {
    setEditingWorkshop(workshop)
    setFormData({
      title: workshop.title,
      description: workshop.description || '',
      date: workshop.date,
      time_start: workshop.time_start,
      time_end: workshop.time_end,
      capacity: workshop.capacity,
      price: workshop.price || 0,
      is_active: workshop.is_active ?? true,
    })
    setIsDialogOpen(true)
  }

  const handleSubmit = async () => {
    if (editingWorkshop) {
      await updateWorkshop.mutateAsync({
        id: editingWorkshop.id,
        updates: formData
      })
    } else {
      await createWorkshop.mutateAsync(formData)
    }
    setIsDialogOpen(false)
    resetForm()
  }

  const handleDelete = async (id: string) => {
    await deleteWorkshop.mutateAsync(id)
    setDeleteConfirm(null)
  }

  const formatTime = (time: string) => time.slice(0, 5)

  // Separate past and upcoming workshops
  const today = new Date().toISOString().split('T')[0]
  const upcomingWorkshops = workshops?.filter(w => w.date >= today) ?? []
  const pastWorkshops = workshops?.filter(w => w.date < today) ?? []

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground">Workshopy</h1>
          <p className="text-muted-foreground mt-1">
            Jednorázové akce s konkrétním datem
          </p>
        </div>
        <Button onClick={openCreateDialog} className="w-fit">
          <Plus className="w-4 h-4 mr-2" />
          Přidat workshop
        </Button>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      )}

      {/* Empty state */}
      {!isLoading && (!workshops || workshops.length === 0) && (
        <Card className="bg-card/80 border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <CalendarDays className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Žádné workshopy
            </h3>
            <p className="text-muted-foreground text-center mb-4">
              Začněte přidáním prvního workshopu.
            </p>
            <Button onClick={openCreateDialog}>
              <Plus className="w-4 h-4 mr-2" />
              Přidat první workshop
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Upcoming workshops */}
      {!isLoading && upcomingWorkshops.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Nadcházející</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {upcomingWorkshops.map((workshop) => (
              <motion.div
                key={workshop.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card
                  className={`
                    bg-card/80 border-border/50 transition-all duration-200
                    ${!workshop.is_active ? 'opacity-60' : ''}
                  `}
                >
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-foreground">
                            {workshop.title}
                          </h3>
                          {!workshop.is_active && (
                            <Badge variant="secondary" className="text-xs">
                              Neaktivní
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm font-medium text-primary">
                          {format(new Date(workshop.date), 'EEEE d. MMMM yyyy', { locale: cs })}
                        </p>
                        {workshop.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                            {workshop.description}
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
                          <DropdownMenuItem onClick={() => openEditDialog(workshop)}>
                            <Edit2 className="w-4 h-4 mr-2" />
                            Upravit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => navigate(`/admin/visitors?filter=${encodeURIComponent(workshop.title)}`)}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            Zobrazit návštěvníky
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setDeleteConfirm(workshop.id)}
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
                        {formatTime(workshop.time_start)} - {formatTime(workshop.time_end)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {workshop.capacity} míst
                      </div>
                    </div>

                    {workshop.price && (
                      <div className="mt-3 pt-3 border-t border-border/50">
                        <span className="text-lg font-bold text-primary">
                          {workshop.price} Kč
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

      {/* Past workshops */}
      {!isLoading && pastWorkshops.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-muted-foreground">Proběhlé</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {pastWorkshops.map((workshop) => (
              <Card
                key={workshop.id}
                className="bg-card/50 border-border/30 opacity-60"
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">
                        {workshop.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(workshop.date), 'd. MMMM yyyy', { locale: cs })}
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
                          onClick={() => navigate(`/admin/visitors?filter=${encodeURIComponent(workshop.title)}`)}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Zobrazit návštěvníky
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setDeleteConfirm(workshop.id)}
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
                      {formatTime(workshop.time_start)} - {formatTime(workshop.time_end)}
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
              {editingWorkshop ? 'Upravit workshop' : 'Přidat workshop'}
            </DialogTitle>
            <DialogDescription>
              {editingWorkshop
                ? 'Upravte detaily workshopu'
                : 'Vytvořte nový jednorázový workshop'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Název workshopu</Label>
              <Input
                id="title"
                placeholder="např. Víkendový workshop jógy"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Popis (volitelné)</Label>
              <Textarea
                id="description"
                placeholder="Krátký popis workshopu..."
                rows={2}
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            {/* Inline Date Picker */}
            <InlineDatePicker
              label="Datum workshopu"
              value={formData.date}
              onChange={(date) => setFormData({ ...formData, date })}
              minDate={new Date()}
            />

            <div className="space-y-2">
              <Label htmlFor="capacity">Kapacita</Label>
              <Input
                id="capacity"
                type="number"
                min={1}
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 1 })}
              />
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
              <Label htmlFor="is_active">Aktivní workshop</Label>
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
              disabled={!formData.title || !formData.date || createWorkshop.isPending || updateWorkshop.isPending}
            >
              {(createWorkshop.isPending || updateWorkshop.isPending) ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : null}
              {editingWorkshop ? 'Uložit' : 'Vytvořit'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <AlertDialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Smazat workshop?</AlertDialogTitle>
            <AlertDialogDescription>
              Tato akce je nevratná. Workshop a všechny jeho registrace budou trvale smazány.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Zrušit</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteWorkshop.isPending ? (
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

export default AdminWorkshops
