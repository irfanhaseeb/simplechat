import type { NextFunction, RequestHandler, Response } from 'express'
import type { AuthenticatedRequest } from './types.js'

import User from '../models/user.models.js'

export const protectRoute: RequestHandler = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ message: 'Unauthenticated: please login or signup' })
    }

    // Use jwt payload to find user in database. Don't select password
    const user = await User.findById(req.session.user.id).select('-password')

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    // Add the user's details for downstream requests
    req.user = user
    return next()
  } catch (error: unknown) {
    console.error(`Error in protect-route controller: ${error instanceof Error ? error.message : String(error)}`)
    return res.status(500).json({ message: 'Internal server error' })
  }
}
