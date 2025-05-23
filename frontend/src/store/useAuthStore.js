import { create } from 'zustand'
import { axiosInstance } from '../lib/axios'

// Global state management using zustand, to avoid prop drilling
export const useAuthStore = create((set) => ({
  // Having these as global states allows any component
  // to access it, that's the upside of this.
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,

  isCheckingAuth: true,

  // Check if the user is authenticated, set state accordingly
  checkAuth: async () => {
    try {
      const response = await axiosInstance.get('/auth/check')
      set({ authUser: response.data })
    } catch (error) {
      console.error(`error in checkAuth: ${error.message}`)
      set({ authUser: null })
    } finally {
      set({ isCheckingAuth: false })
    }
  },

  signup: async (data) => {},
}))
