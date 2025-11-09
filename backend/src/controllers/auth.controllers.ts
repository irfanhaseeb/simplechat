import type { Request } from 'express'
import type {
  CheckAuthRequest,
  CheckAuthResponse,
  LoginRequest,
  LoginResponse,
  LogoutResponse,
  SignupRequest,
  SignupResponse,
  UpdateProfileRequest,
  UpdateProfileResponse,
} from './types.js'

import bcrypt from 'bcryptjs'

import cloudinary from '../lib/cloudinary.js'
import User from '../models/user.models.js'

// Create new user and session
export const signup = async (req: SignupRequest, res: SignupResponse): Promise<SignupResponse> => {
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

    // Create a new user in the DB and send a 201 response
    await newUser.save()

    // Set user session
    req.session.user = { id: newUser._id.toString() }

    return res.status(201).json({
      _id: newUser._id.toString(),
      fullName: newUser.fullName,
      email: newUser.email,
      profilePic: newUser.profilePic,
      createdAt: newUser.createdAt,
      updatedAt: newUser.updatedAt,
    })
  } catch (error: unknown) {
    console.error(`Error in signup controller: ${error instanceof Error ? error.message : String(error)}`)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

// Create session for user
export const login = async (req: LoginRequest, res: LoginResponse): Promise<LoginResponse> => {
  const { email, password } = req.body

  try {
    // Ensure user exists
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' })
    }

    // bcrypt extracts salt and work factor from the db hash (metadata is included)
    const isPasswordCorrect = await bcrypt.compare(password, user.password)
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: 'Invalid credentials' })
    }

    // Set user session
    req.session.user = { id: user._id.toString() }

    return res.status(200).json({
      _id: user._id.toString(),
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    })
  } catch (error: unknown) {
    console.error(`Error in login controller: ${error instanceof Error ? error.message : String(error)}`)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

export const logout = (req: Request<never, never, never, never>, res: LogoutResponse): LogoutResponse => {
  try {
    req.session.destroy((_error: unknown) => {
      throw new Error('failed to destroy session')
    })

    return res.status(200).json({ message: 'Logged out successfully' })
  } catch (error: unknown) {
    console.error(`Error in logout controller: ${error instanceof Error ? error.message : String(error)}`)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

// Update profile - only profile pic can be updated (hosted on cloudinary)
export const updateProfile = async (
  req: UpdateProfileRequest,
  res: UpdateProfileResponse,
): Promise<UpdateProfileResponse> => {
  try {
    // User is from middleware
    const { profilePic } = req.body
    if (!req.user) {
      throw new Error('middleware error - no user in authenticated request')
    }
    const userId = req.user._id

    if (!profilePic) {
      return res.status(400).json({ message: 'profilePic is required' })
    }

    // Upload to cloudinary (profilePic is a base-64 encoded image)
    const uploadResponse = await cloudinary.uploader.upload(profilePic)

    // Update user with new image url, no select needed as we filter out the passwd in middleware
    const updatedUser = await User.findByIdAndUpdate(userId, { profilePic: uploadResponse.secure_url }, { new: true })
    if (!updatedUser) {
      throw new Error('unexpected: could not update user in MongoDB')
    }

    return res.status(200).json({ updatedProfilePic: updatedUser?.profilePic })
  } catch (error: unknown) {
    console.error(`Error in update-profile controller: ${error instanceof Error ? error.message : String(error)}`)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

export const checkAuth = (req: CheckAuthRequest, res: CheckAuthResponse) => {
  try {
    if (!req.user) {
      throw new Error('middleware error - no user in authenticated request')
    }
    return res.status(200).json(req.user)
  } catch (error: unknown) {
    console.error(`Error in check auth controller: ${error instanceof Error ? error.message : String(error)}`)
    return res.status(500).json({ message: 'Internal server error' })
  }
}
