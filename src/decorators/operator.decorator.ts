import { ExecutionContext, createParamDecorator } from '@nestjs/common'

import { Request } from '../types'

export const Operator = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>()
    return request.user
  },
)
