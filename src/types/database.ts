export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      class_instances: {
        Row: {
          capacity_override: number | null
          created_at: string | null
          date: string
          id: string
          is_cancelled: boolean | null
          note: string | null
          recurring_class_id: string | null
        }
        Insert: {
          capacity_override?: number | null
          created_at?: string | null
          date: string
          id?: string
          is_cancelled?: boolean | null
          note?: string | null
          recurring_class_id?: string | null
        }
        Update: {
          capacity_override?: number | null
          created_at?: string | null
          date?: string
          id?: string
          is_cancelled?: boolean | null
          note?: string | null
          recurring_class_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "class_instances_recurring_class_id_fkey"
            columns: ["recurring_class_id"]
            isOneToOne: false
            referencedRelation: "public_class_schedule"
            referencedColumns: ["class_id"]
          },
          {
            foreignKeyName: "class_instances_recurring_class_id_fkey"
            columns: ["recurring_class_id"]
            isOneToOne: false
            referencedRelation: "recurring_classes"
            referencedColumns: ["id"]
          },
        ]
      }
      recurring_classes: {
        Row: {
          capacity: number
          created_at: string | null
          day_of_week: number
          description: string | null
          id: string
          is_active: boolean | null
          lesson_count: number | null
          price: number | null
          time_end: string
          time_start: string
          title: string
        }
        Insert: {
          capacity?: number
          created_at?: string | null
          day_of_week: number
          description?: string | null
          id?: string
          is_active?: boolean | null
          lesson_count?: number | null
          price?: number | null
          time_end: string
          time_start: string
          title: string
        }
        Update: {
          capacity?: number
          created_at?: string | null
          day_of_week?: number
          description?: string | null
          id?: string
          is_active?: boolean | null
          lesson_count?: number | null
          price?: number | null
          time_end?: string
          time_start?: string
          title?: string
        }
        Relationships: []
      }
      registrations: {
        Row: {
          class_instance_id: string | null
          created_at: string | null
          email: string
          id: string
          name: string
          note: string | null
          phone: string | null
          workshop_id: string | null
          one_time_class_id: string | null
        }
        Insert: {
          class_instance_id?: string | null
          created_at?: string | null
          email: string
          id?: string
          name: string
          note?: string | null
          phone?: string | null
          workshop_id?: string | null
          one_time_class_id?: string | null
        }
        Update: {
          class_instance_id?: string | null
          created_at?: string | null
          email?: string
          id?: string
          name?: string
          note?: string | null
          phone?: string | null
          workshop_id?: string | null
          one_time_class_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "registrations_class_instance_id_fkey"
            columns: ["class_instance_id"]
            isOneToOne: false
            referencedRelation: "class_instances"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "registrations_class_instance_id_fkey"
            columns: ["class_instance_id"]
            isOneToOne: false
            referencedRelation: "public_class_schedule"
            referencedColumns: ["instance_id"]
          },
          {
            foreignKeyName: "registrations_workshop_id_fkey"
            columns: ["workshop_id"]
            isOneToOne: false
            referencedRelation: "workshops"
            referencedColumns: ["id"]
          },
        ]
      }
      workshops: {
        Row: {
          capacity: number
          created_at: string | null
          date: string
          description: string | null
          id: string
          is_active: boolean | null
          price: number | null
          time_end: string
          time_start: string
          title: string
        }
        Insert: {
          capacity?: number
          created_at?: string | null
          date: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          price?: number | null
          time_end: string
          time_start: string
          title: string
        }
        Update: {
          capacity?: number
          created_at?: string | null
          date?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          price?: number | null
          time_end?: string
          time_start?: string
          title?: string
        }
        Relationships: []
      }
      one_time_classes: {
        Row: {
          capacity: number
          created_at: string | null
          date: string
          description: string | null
          id: string
          is_active: boolean | null
          price: number | null
          reserved_spots: number
          time_end: string
          time_start: string
          title: string
        }
        Insert: {
          capacity?: number
          created_at?: string | null
          date: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          price?: number | null
          reserved_spots?: number
          time_end: string
          time_start: string
          title: string
        }
        Update: {
          capacity?: number
          created_at?: string | null
          date?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          price?: number | null
          reserved_spots?: number
          time_end?: string
          time_start?: string
          title?: string
        }
        Relationships: []
      }
    }
    Views: {
      public_class_schedule: {
        Row: {
          capacity: number | null
          class_id: string | null
          date: string | null
          day_of_week: number | null
          description: string | null
          instance_id: string | null
          instance_note: string | null
          is_cancelled: boolean | null
          price: number | null
          registered_count: number | null
          time_end: string | null
          time_start: string | null
          title: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      check_capacity: { Args: { instance_id: string }; Returns: boolean }
      check_workshop_capacity: {
        Args: { p_workshop_id: string }
        Returns: boolean
      }
      check_one_time_class_capacity: {
        Args: { p_class_id: string }
        Returns: boolean
      }
      get_or_create_class_instance: {
        Args: { p_date: string; p_recurring_class_id: string }
        Returns: string
      }
      get_registration_count: { Args: { instance_id: string }; Returns: number }
      get_workshop_registration_count: {
        Args: { p_workshop_id: string }
        Returns: number
      }
      get_one_time_class_registration_count: {
        Args: { p_class_id: string }
        Returns: number
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

// Helper types
export type RecurringClass = Database['public']['Tables']['recurring_classes']['Row']
export type RecurringClassInsert = Database['public']['Tables']['recurring_classes']['Insert']
export type RecurringClassUpdate = Database['public']['Tables']['recurring_classes']['Update']

export type ClassInstance = Database['public']['Tables']['class_instances']['Row']
export type ClassInstanceInsert = Database['public']['Tables']['class_instances']['Insert']

export type Registration = Database['public']['Tables']['registrations']['Row']
export type RegistrationInsert = Database['public']['Tables']['registrations']['Insert']

export type Workshop = Database['public']['Tables']['workshops']['Row']
export type WorkshopInsert = Database['public']['Tables']['workshops']['Insert']
export type WorkshopUpdate = Database['public']['Tables']['workshops']['Update']

export type OneTimeClass = Database['public']['Tables']['one_time_classes']['Row']
export type OneTimeClassInsert = Database['public']['Tables']['one_time_classes']['Insert']
export type OneTimeClassUpdate = Database['public']['Tables']['one_time_classes']['Update']

export type PublicClassSchedule = Database['public']['Views']['public_class_schedule']['Row']

// Schedule item types for unified calendar view
export type LessonType = 'recurring' | 'one_time' | 'workshop'

export interface ScheduleItem {
  id: string
  type: LessonType
  title: string
  description: string | null
  date: Date
  time_start: string
  time_end: string
  capacity: number
  registeredCount: number
  price: number | null
  // Original data references
  recurringClass?: RecurringClass
  classInstance?: ClassInstance
  oneTimeClass?: OneTimeClass
  workshop?: Workshop
}

// Day of week mapping (Czech)
export const DAY_NAMES: Record<number, string> = {
  0: 'Neděle',
  1: 'Pondělí',
  2: 'Úterý',
  3: 'Středa',
  4: 'Čtvrtek',
  5: 'Pátek',
  6: 'Sobota',
}

export const DAY_NAMES_SHORT: Record<number, string> = {
  0: 'Ne',
  1: 'Po',
  2: 'Út',
  3: 'St',
  4: 'Čt',
  5: 'Pá',
  6: 'So',
}
