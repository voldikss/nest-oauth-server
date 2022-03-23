import {
  ArgumentsHost,
  ExceptionFilter,
  ForbiddenException,
  HttpException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'

import { Request, Response } from 'express'
import { URLSearchParams } from 'url'

export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: Error | HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const req = ctx.getRequest<Request>()
    const res = ctx.getResponse<Response>()

    if (
      exception instanceof ForbiddenException ||
      exception instanceof UnauthorizedException
    ) {
      const redirectUrl = new URLSearchParams()
      redirectUrl.append('redirect', req.url)
      return res.redirect(`/users/login?${redirectUrl}`)
    } else if (
      exception instanceof NotFoundException &&
      req.url.endsWith('/null')
    ) {
      return res.json({
        message: exception.message,
        statusCode: exception.getStatus(),
      })
    } else if (exception instanceof HttpException) {
      const extra = exception.getResponse()
      console.error(exception)
      return res.json({
        message: exception.message,
        statusCode: exception.getStatus(),
        ...(typeof extra === 'string' ? { extra } : extra),
      })
    } else {
      console.error(exception)
      return res.json({
        message: exception.message,
        statusCode: 500,
      })
    }
  }
}
