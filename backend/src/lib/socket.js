import express from 'express'
import { Server } from 'socket.io'
import { createServer } from 'http' // built into node

const app = express()
const server = createServer(app)

const io = new Server(server, {
  cors: {
    origin: ['http://localhost:5173'],
  },
})

// Used to map socket.io id's with user ids from database
// {userId: socketId}
const userSocketMap = {}

export const getReceiverSocketId = (userId) => {
  return userSocketMap[userId]
}

io.on('connection', (socket) => {
  // Actions to do when a user first connects to the socket server
  // Get userId from client, add to map
  console.log('A user connected', socket.id)
  const userId = socket.handshake.query.userId
  if (userId) {
    userSocketMap[userId] = socket.id
  }

  // io.emit is used to send events to all the connected clients
  io.emit('getOnlineUsers', Object.keys(userSocketMap))

  socket.on('disconnect', () => {
    console.log('A user disconnected', socket.id)
    delete userSocketMap[userId]
    io.emit('getOnlineUsers', Object.keys(userSocketMap))
  })
})

export { io, app, server }
