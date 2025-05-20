import express from 'express'
import { config } from 'dotenv'

// File extension needed for local files with ES modules
import authRoutes from './routes/auth.routes.js'

config()
const app = express()

const PORT = process.env.PORT

app.use('/api/auth', authRoutes)

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`)
})
