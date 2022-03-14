import express from 'express'

import { User } from './modules/user/user.entity'

export interface Request extends express.Request {
  user?: User
}
