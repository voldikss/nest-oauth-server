import OAuth2Server from 'oauth2-server'
import { Column, Entity, ManyToOne } from 'typeorm'

import { BaseEntity, BasePopulateSpec } from '../../base/base.entity'
import { User } from '../../user/user.entity'
import { OAuth2Client } from '../client/oauth2-client.entity'

@Entity({ name: 'oauth2accesstokens' })
export class OAuth2AccessToken extends BaseEntity implements OAuth2Server.Token {
  @Column({ unique: true })
  accessToken!: string

  @Column({ nullable: true })
  accessTokenExpiresAt?: Date

  @Column({ unique: true })
  refreshToken?: string

  @Column()
  refreshTokenExpiresAt?: Date

  @Column({ type: 'simple-array', nullable: true, array: true })
  scope?: string[]

  @ManyToOne(() => OAuth2Client)
  client!: OAuth2Client

  @ManyToOne(() => User)
  user!: User
}

export class OAuth2AccessTokenPopulateSpec extends BasePopulateSpec {
  client!: OAuth2Client

  user!: User
}
