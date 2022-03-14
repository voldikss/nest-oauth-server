import OAuth2Server from 'oauth2-server'
import { Column, Entity, ManyToOne } from 'typeorm'

import { BaseEntity, BasePopulateSpec } from '../../base/base.entity'
import { User } from '../../user/user.entity'
import { OAuth2Client } from '../client/oauth2-client.entity'

@Entity({ name: 'oauth2authorizationcodes' })
export class OAuth2AuthorizationCode
  extends BaseEntity
  implements OAuth2Server.AuthorizationCode
{
  @Column({ unique: true })
  authorizationCode!: string

  @Column()
  expiresAt!: Date

  @Column()
  redirectUri!: string

  @Column({ type: 'simple-array', array: true })
  scope!: string[]

  @ManyToOne(() => OAuth2Client)
  client!: OAuth2Client

  @ManyToOne(() => User)
  user!: User
}

export class OAuth2AuthorizationCodePopulateSpec extends BasePopulateSpec {
  client!: OAuth2Client

  user!: User
}
