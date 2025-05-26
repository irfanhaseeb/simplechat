import { create } from 'zustand'
import toast from 'react-hot-toast'
import { axiosInstance } from '../lib/axios'

// Global state management using zustand, to avoid prop drilling
export const useAuthStore = create((set) => ({
  // Having these as global states allows any component
  // to access it, that's the upside of this.
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  onlineUsers: [],

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

  signup: async (data) => {
    set({ isSigningUp: true })
    try {
      const res = await axiosInstance.post('/auth/signup', data)
      set({ authUser: res.data })
      toast.success('Account created successfully')
    } catch (error) {
      // In our API, any errors have the message field where the error is described
      toast.error(error.response.data.message)
    } finally {
      set({ isSigningUp: false })
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true })
    try {
      const res = await axiosInstance.post('/auth/login', data)
      set({ authUser: res.data })
      toast.success('Logged in successfully')
    } catch (error) {
      toast.error(error.response.data.message)
    } finally {
      set({ isLoggingIn: false })
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post('/auth/logout')
      set({ authUser: null })
      toast.success('Logged out successfully')
    } catch (error) {
      toast.error(error.response.data.message)
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true })
    try {
      const res = await axiosInstance.put('/auth/update-profile', data)
      set({ authUser: res.data })
      toast.success('Profile updated successfully')
    } catch (error) {
      console.log(error)
      toast.error(error.response.data.message)
      console.error('error in update profile: ', error.response.data.message)
    } finally {
      set({ isUpdatingProfile: false })
    }
  },
}))
