import mongoose, { type HydratedDocumentFromSchema } from 'mongoose'

// Define a MongoDB model schema for users
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    profilePic: {
      type: String,
      default: '',
    },
  },
  { timestamps: true },
)

// Singular and first character as uppercase (mongoose standards)
const User = mongoose.model('User', userSchema)

export type MongooseUser = HydratedDocumentFromSchema<typeof userSchema>
export type MongooseUserNoPassword = Omit<MongooseUser, 'password'>

export default User
