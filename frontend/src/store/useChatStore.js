import toast from 'react-hot-toast'
import { create } from 'zustand'

import { axiosInstance } from '../lib/axios'
import { useAuthStore } from './useAuthStore'

// Note: order of the get/set matters
export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  isMessageSending: false,

  setSelectedUser: (selectedUser) => set({ selectedUser }),

  getUsers: async () => {
    set({ isUsersLoading: true })
    try {
      const res = await axiosInstance.get('/message/users')
      set({ users: res.data })
    } catch (error) {
      toast.error(error.response.data.message)
    } finally {
      set({ isUsersLoading: false })
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true })
    try {
      const res = await axiosInstance.get(`/message/${userId}`)
      set({ messages: res.data })
    } catch (error) {
      toast.error(error.response.data.message)
    } finally {
      set({ isMessagesLoading: false })
    }
  },

  // Send message to selected user
  sendMessage: async (messageData) => {
    set({ isMessageSending: true })
    const { selectedUser, messages } = get()
    try {
      const res = await axiosInstance.post(`/message/send/${selectedUser._id}`, messageData)
      // Append new message to messages array
      set({ messages: [...messages, res.data] })
    } catch (error) {
      toast.error(error.response.data.message)
    } finally {
      set({ isMessageSending: false })
    }
  },

  subscribeToMessages: () => {
    const { selectedUser } = get()
    if (!selectedUser) {
      return
    }

    // Getting state from another store
    const socket = useAuthStore.getState().socket

    // Add message to state with a socket event
    socket.on('newMessage', (newMessage) => {
      // Only recieve from person we are chatting with currently
      if (newMessage.senderId != get().selectedUser._id) {
        return
      }
      set({ messages: [...get().messages, newMessage] })
    })
  },

  unsubscribeToMessages: () => {
    const socket = useAuthStore.getState().socket
    socket.off('newMessage')
  },
}))
