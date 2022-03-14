import OAuth2Server from 'oauth2-server'
import { Column, Entity, OneToMany } from 'typeorm'

import { BaseEntity, BasePopulateSpec } from '../base/base.entity'
import { OAuth2Client } from '../oauth2/client/oauth2-client.entity'

@Entity({ name: 'users' })
export class User extends BaseEntity implements OAuth2Server.User {
  @Column()
  username!: string

  @Column({ select: false })
  password!: string

  @Column({ nullable: true })
  email?: string

  @OneToMany(() => OAuth2Client, (client: OAuth2Client) => client.user)
  clients!: OAuth2Client[]
}

export class UserPopulateSpec extends BasePopulateSpec {
  clients!: OAuth2Client[]
}
