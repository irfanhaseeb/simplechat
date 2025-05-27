import toast from 'react-hot-toast'
import { create } from 'zustand'

import { axiosInstance } from '../lib/axios'

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
}))
