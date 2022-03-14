import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'

import { isPublicClass, isPublicHandler } from '../decorators/access.decorator'
import { Request } from '../types'

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>()
    if (req.user) {
      return true
    }

    const ctxClass = context.getClass()
    if (isPublicClass(ctxClass)) {
      return true
    }

    const ctxHandler = context.getHandler()
    if (isPublicHandler(ctxHandler)) {
      return true
    }

    return false
  }
}
