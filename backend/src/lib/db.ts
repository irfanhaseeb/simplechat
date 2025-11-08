import mongoose from 'mongoose'

import { getEnvVariable } from './utils.js'

const connectDb = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(getEnvVariable('MONGODB_URI'))
    console.log(`MongoDB connected: ${conn.connection.host}`)
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(`MongoDB connection error: ${error.message}`)
    } else {
      console.error(`MongoDB connection error: ${String(error)}`)
    }
  }
}

export default connectDb
