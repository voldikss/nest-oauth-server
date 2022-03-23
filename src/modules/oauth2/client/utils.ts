import { BadRequestException } from '@nestjs/common'

import { TransformFnParams } from 'class-transformer'

interface TransformOptions {
  required?: boolean
}

export function transformToArrayOfStringsFactory({ required }: TransformOptions) {
  return ({ key, value }: TransformFnParams) => {
    if (required && (!value || value.length === 0)) {
      throw new BadRequestException(`Parameter \`${key}\` is empty`)
    }
    if (typeof value === 'string') {
      return value.split(/\s*,\s*/)
    }
    if (Array.isArray(value)) {
      return value
    }
    throw new BadRequestException(`Invalid value for \`${key}\`: ${value}`)
  }
}
