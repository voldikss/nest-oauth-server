import { Injectable, NestMiddleware } from '@nestjs/common'

import * as chalk from 'chalk'
import { Response } from 'express'

import { Request } from '../types'

import onHeaders = require('on-headers')

@Injectable()
export class ReqPathLoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: Function) {
    addRequestLogger(`${chalk.green()} ${req.path}`, res, req)
    next()
  }
}

const addRequestLogger = (text: string, res: Response, req?: Request) => {
  console.info(`${chalk.gray('BEGIN')} ${req?.method} ${text}`)
  const startAt = process.hrtime()
  onHeaders(res, () => {
    const cost = process.hrtime(startAt)
    const suffix = (cost[0] * 1e3 + cost[1] * 1e-6).toFixed(4) + 'ms'
    console.info(
      `${chalk.gray('  END')} ${req?.method} ${text} ${chalk.gray(suffix)}`,
    )
  })
}
