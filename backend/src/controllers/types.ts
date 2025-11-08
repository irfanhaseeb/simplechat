import type { Request, Response } from 'express'
import type { AuthenticatedRequest } from '../middleware/types.js'
import type { MongooseUserNoPassword } from '../models/user.models.js'

type DefaultResponseBody = {
  message: string
}

export type SignupRequest = Request<never, never, { fullName: string; email: string; password: string }, never>
export type SignupResponse = Response<
  | {
      _id: string
      fullName: string
      email: string
      profilePic: string
      createdAt: NativeDate
      updatedAt: NativeDate
    }
  | DefaultResponseBody
>

export type LoginRequest = Request<never, never, { email: string; password: string }, never>
export type LoginResponse = Response<
  | {
      _id: string
      fullName: string
      email: string
      profilePic: string
      createdAt: NativeDate
      updatedAt: NativeDate
    }
  | DefaultResponseBody
>

export type LogoutRequest = Request<never, never, never, never>
export type LogoutResponse = Response<DefaultResponseBody>

export type UpdateProfileRequest = AuthenticatedRequest<never, never, { profilePic: string }, never>
export type UpdateProfileResponse = Response<{ updatedProfilePic: string } | DefaultResponseBody>

export type CheckAuthRequest = AuthenticatedRequest<never, never, never, never>
export type CheckAuthResponse = Response<MongooseUserNoPassword | DefaultResponseBody>
