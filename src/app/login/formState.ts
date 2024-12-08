import { create } from 'zustand'

interface FormState {
  email: string
  error: string | null
  setEmail: (email: string) => void
  setError: (error: string | null) => void
  reset: () => void
}

export const useFormState = create<FormState>((set) => ({
  email: '',
  error: null,
  setEmail: (email) => set({ email }),
  setError: (error) => set({ error }),
  reset: () => set({ email: '', error: null })
}))
