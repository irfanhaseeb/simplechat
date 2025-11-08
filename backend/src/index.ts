import 'dotenv/config'

import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'

// File extension needed for local files with ES modules
import connectDb from './lib/db.js'
import { app, server } from './lib/socket.js'
import authRoutes from './routes/auth.routes.js'
import messageRoutes from './routes/message.routes.js'

const PORT = process.env.PORT

// Allow for json requests (post requests) in req.body
app.use(express.json({ limit: '100mb' }))
app.use(cookieParser())
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  }),
)

app.use('/api/auth', authRoutes)
app.use('/api/message', messageRoutes)

server.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`)
  connectDb()
})
