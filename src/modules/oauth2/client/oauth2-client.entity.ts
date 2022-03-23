import OAuth2Server from 'oauth2-server'
import { Column, Entity, ManyToOne } from 'typeorm'

import { BaseEntity, BasePopulateSpec } from '../../base/base.entity'
import { User } from '../../user/user.entity'

@Entity({ name: 'oauth2clients' })
export class OAuth2Client extends BaseEntity implements OAuth2Server.Client {
  @Column()
  name!: string

  @Column()
  clientId!: string

  @Column()
  clientSecret!: string

  @Column({ type: 'simple-array', array: true })
  redirectUris!: string[]

  @Column({
    enum: [
      'authorization_code',
      'client_credentials',
      'refresh_token',
      'password',
    ],
    type: 'simple-array',
    array: true,
  })
  grants!: string[]

  @Column({ type: 'simple-array', array: true })
  scope!: string[]

  @ManyToOne(() => User, (user: User) => user.clients)
  user!: User
}

export class OAuth2ClientPopulateSpec extends BasePopulateSpec {
  user!: User
}
