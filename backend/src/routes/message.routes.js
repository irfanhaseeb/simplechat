import express from 'express'

import { getUsersForSidebar } from '../controllers/message.controllers.js'
import { protectRoute } from '../middleware/auth.middleware.js'

const router = express.Router()

router.get('/users', protectRoute, getUsersForSidebar)

export default router
