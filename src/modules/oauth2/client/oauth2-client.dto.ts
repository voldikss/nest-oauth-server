import { Transform } from 'class-transformer'

import { transformToArrayOfStrings } from './utils'

export class OAuth2ClientCreateDTO {
  name!: string

  @Transform(transformToArrayOfStrings)
  redirectUris!: string[]

  @Transform(transformToArrayOfStrings)
  grants!: string[]
}
