import bcrypt from 'bcryptjs'

import User from '../models/user.models.js'
import { generateToken } from '../lib/utils.js'

// Create user in DB and log user in with a JWT session cookie
export const signup = async (req, res) => {
  const { fullName, email, password } = req.body

  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({
        message: 'fullName, email, and password fields are required',
      })
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: 'Password must be at least 6 characters',
      })
    }

    // If user already exists, don't allow signup
    const user = await User.findOne({ email })
    if (user) {
      return res.status(400).json({ message: `A user with email ${email} already exists` })
    }

    // Create hashed password + salt to store in DB
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    })

    // Check if user was successfully created by mongoose
    if (!newUser) {
      return res.status(400).json({ message: 'Invalid user data' })
    }

    // Generate and send JWT token to client
    generateToken(newUser._id, res)

    // Create a new user in the DB and send a 201 response
    await newUser.save()
    res.status(201).json({
      _id: newUser._id,
      fullName: newUser.fullName,
      email: newUser.email,
      profilePic: newUser.profilePic,
    })
  } catch (error) {
    console.error('Error in signup controller: ', error.message)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

export const login = (req, res) => {
  res.send('login route')
}

export const logout = (req, res) => {
  res.send('logout route')
}
