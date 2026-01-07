import { supabase } from '@/lib/supabase'
import type { LessonType } from '@/types/database'
import { format } from 'date-fns'
import { cs } from 'date-fns/locale'

interface RegistrationNotificationParams {
  lessonType: LessonType
  lessonTitle: string
  lessonDate: Date
  timeStart: string
  timeEnd: string
  participantName: string
  participantEmail: string
  participantPhone?: string | null
  participantNote?: string | null
  registeredCount: number
  capacity: number
}

/**
 * Formats time string (HH:MM:SS or HH:MM) to HH:MM
 */
function formatTime(time: string): string {
  const parts = time.split(':')
  return `${parts[0]}:${parts[1]}`
}

/**
 * Sends a Telegram notification for a new registration.
 * This is fire-and-forget - failures are logged but don't block the registration.
 */
export async function sendRegistrationNotification(params: RegistrationNotificationParams): Promise<void> {
  try {
    const dayName = format(params.lessonDate, 'EEEE', { locale: cs })
    const dayNameCapitalized = dayName.charAt(0).toUpperCase() + dayName.slice(1)
    const dateFormatted = format(params.lessonDate, 'd. MMMM yyyy', { locale: cs })

    await supabase.functions.invoke('send-registration-notification', {
      body: {
        lessonType: params.lessonType,
        lessonTitle: params.lessonTitle,
        lessonDate: `${dayNameCapitalized}, ${dateFormatted}`,
        lessonTime: `${formatTime(params.timeStart)} - ${formatTime(params.timeEnd)}`,
        participantName: params.participantName,
        participantEmail: params.participantEmail,
        participantPhone: params.participantPhone || undefined,
        participantNote: params.participantNote || undefined,
        registeredCount: params.registeredCount,
        capacity: params.capacity,
      },
    })

    console.log('Registration notification sent successfully')
  } catch (error) {
    // Log but don't throw - notification failure shouldn't block registration
    console.warn('Registration notification failed:', error)
  }
}
