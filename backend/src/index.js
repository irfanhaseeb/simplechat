import express from 'express'
import cookieParser from 'cookie-parser'
import { config } from 'dotenv'

// File extension needed for local files with ES modules
import connectDb from './lib/db.js'
import authRoutes from './routes/auth.routes.js'
import messageRoutes from './routes/message.routes.js'

config()
const app = express()

const PORT = process.env.PORT

// Allow for json requests (post requests) in req.body
app.use(express.json())
app.use(cookieParser())

app.use('/api/auth', authRoutes)
app.use('/api/message', messageRoutes)

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`)
  connectDb()
})
