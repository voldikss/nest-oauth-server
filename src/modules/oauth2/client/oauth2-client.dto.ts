import { Transform } from 'class-transformer'
import { IsIn, IsNotEmpty } from 'class-validator'

import { transformToArrayOfStringsFactory } from './utils'

export class OAuth2ClientCreateDTO {
  @IsNotEmpty()
  name!: string

  // @IsUrl(undefined, { each: true })
  @Transform(
    transformToArrayOfStringsFactory({
      required: true,
    }),
  )
  redirectUris!: string[]

  @IsIn(
    ['authorization_code', 'client_credentials', 'refresh_token', 'password'],
    { each: true },
  )
  @IsNotEmpty()
  @Transform(transformToArrayOfStringsFactory({ required: true }))
  grants!: string[]

  @Transform(
    transformToArrayOfStringsFactory({
      required: false,
    }),
  )
  scope?: string[]
}
