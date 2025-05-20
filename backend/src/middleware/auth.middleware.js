import jwt from 'jsonwebtoken'

import User from '../models/user.models.js'

export const protectRoute = async (req, res, next) => {
  try {
    // jwt is the name of the cookie we have set
    // Note: grabbing cookies is done using cookieparser library
    const token = req.cookies.jwt
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized: no JWT token in cookies' })
    }

    const decodedJwt = jwt.verify(token, process.env.JWT_SECRET)

    if (!decodedJwt) {
      return res.status(401).json({ message: 'Unauthorized: invalid token' })
    }

    // Use jwt payload to find user in database. Don't select password
    const user = await User.findById(decodedJwt.userId).select('-password')

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    // Add the user's details to the request, then call the next handler
    req.user = user
    next()
  } catch (error) {
    console.error('Error in protect-route controller: ', error.message)
    return res.status(500).json({ message: 'Internal server error' })
  }
}
