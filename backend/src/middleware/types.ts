import type { Request } from 'express'
import type { ParamsDictionary, Query } from 'express-serve-static-core'
import type { MongooseUserNoPassword } from '../models/user.models.js'

// TODO - The mongooseUser will not have a password
export interface AuthenticatedRequest<
  P = ParamsDictionary,
  // biome-ignore lint: Only using for Express.js
  ResBody = any,
  // biome-ignore lint: Only using for Express.js
  ReqBody = any,
  ReqQuery = Query,
  // biome-ignore lint: Only using for Express.js
  Locals extends Record<string, any> = Record<string, any>,
> extends Request<P, ResBody, ReqBody, ReqQuery, Locals> {
  user?: MongooseUserNoPassword
}
