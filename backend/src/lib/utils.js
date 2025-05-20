import jwt from 'jsonwebtoken'

export const generateToken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
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
