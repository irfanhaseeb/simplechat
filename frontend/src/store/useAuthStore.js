import { create } from 'zustand'
import toast from 'react-hot-toast'
import { axiosInstance } from '../lib/axios'
import { io } from 'socket.io-client'

const BASE_URL = 'http://localhost:5001'

// Global state management using zustand, to avoid prop drilling
export const useAuthStore = create((set, get) => ({
  // Having these as global states allows any component
  // to access it, that's the upside of this.
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  onlineUsers: [],
  socket: null,

  isCheckingAuth: true,

  // Check if the user is authenticated, set state accordingly
  checkAuth: async () => {
    try {
      const response = await axiosInstance.get('/auth/check')
      set({ authUser: response.data })
      // Connect to socket server
      get().connectSocket()
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
      // Connect to socket server
      get().connectSocket()
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
      // Connect to the socket.io server
      get().connectSocket()
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
      get().disconnectSocket()
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

  connectSocket: () => {
    const { authUser } = get()
    if (!authUser || get().socket?.connected) {
      return
    }
    get().socket = io(BASE_URL, {
      query: {
        userId: get().authUser._id,
      },
    })
    get().socket.connect()

    // Listen for updates in the users
    get().socket.on('getOnlineUsers', (userIds) => {
      set({ onlineUsers: userIds })
    })
  },

  disconnectSocket: () => {
    if (get().socket?.connected) {
      get().socket.disconnect()
    }
  },
}))
