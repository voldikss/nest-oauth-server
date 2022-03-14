import { TransformFnParams } from 'class-transformer'

export const transformToArrayOfStrings = ({ value }: TransformFnParams) => {
  if (typeof value === 'string') {
    return value.split(/\s*,\s*/)
  }
  if (Array.isArray(value)) {
    return value
  }
  throw new Error(`Invalid parameter: ${value}`)
}
