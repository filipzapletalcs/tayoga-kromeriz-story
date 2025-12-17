import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react'
import { supabase, signInAdmin, signOutAdmin } from '@/lib/supabase'
import type { User, Session } from '@supabase/supabase-js'

interface AdminContextType {
  user: User | null
  session: Session | null
  isLoading: boolean
  isAuthenticated: boolean
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>
  signOut: () => Promise<void>
}

const AdminContext = createContext<AdminContextType | null>(null)

export function AdminProvider({ children }: { children: ReactNode }): React.JSX.Element {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setIsLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
        setIsLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    setIsLoading(true)
    const { error } = await signInAdmin(email, password)
    setIsLoading(false)
    return { error: error as Error | null }
  }

  const signOut = async () => {
    setIsLoading(true)
    await signOutAdmin()
    setUser(null)
    setSession(null)
    setIsLoading(false)
  }

  return (
    <AdminContext.Provider
      value={{
        user,
        session,
        isLoading,
        isAuthenticated: !!session,
        signIn,
        signOut,
      }}
    >
      {children}
    </AdminContext.Provider>
  )
}

export function useAdmin() {
  const context = useContext(AdminContext)
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider')
  }
  return context
}
