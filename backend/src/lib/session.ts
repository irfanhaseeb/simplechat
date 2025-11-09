import { RedisStore } from 'connect-redis'
import session from 'express-session'
// import { Redis } from 'ioredis'
import { createClient } from 'redis'

import { getEnvVariable } from './utils.js'

const redisClient = createClient({ url: 'redis://localhost:6379' })
await redisClient.connect()

export const sessionMiddleware = session({
  store: new RedisStore({ client: redisClient, ttl: 60 * 60 }),
  secret: getEnvVariable('SESSION_SECRET'),
  resave: false,
  saveUninitialized: false,
  rolling: true,
  cookie: {
    httpOnly: true,
    secure: getEnvVariable('NODE_ENV') === 'production',
    sameSite: 'strict',
    maxAge: 1000 * 60 * 60,
  },
})
