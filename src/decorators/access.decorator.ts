import { SetMetadata } from '@nestjs/common'

import 'reflect-metadata'

const PublicAPIToken = Symbol('public-api-token')

export function Public() {
  return (target: Object, key: string, descriptor: PropertyDescriptor) => {
    SetMetadata(PublicAPIToken, true)(target, key, descriptor)
  }
}

export function isPublicClass(ctxClass: object) {
  return Reflect.getMetadata(PublicAPIToken, ctxClass)
}

export function isPublicHandler(ctxHandler: Function) {
  return Reflect.getMetadata(PublicAPIToken, ctxHandler)
}
