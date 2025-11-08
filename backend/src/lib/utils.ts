import type { Response } from 'express'

import jwt from 'jsonwebtoken'

export const generateToken = (userId: string, res: Response): string => {
  const token = jwt.sign({ userId }, getEnvVariable('JWT_SECRET'), {
    // TODO: Long expiration time
    expiresIn: '7d',
  })

  res.cookie('jwt', token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, // In milliseconds
    httpOnly: true, // Prevent XSS (javascript access)
    sameSite: 'strict', // Prevent CSRF attacks
    secure: process.env.NODE_ENV !== 'development', // https only
  })

  return token
}

export function getEnvVariable(name: string): string {
  const value = process.env[name]
  if (!value) {
    throw new Error(`Environment variable ${name} is missing or empty`)
  }
  return value
}
