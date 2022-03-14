import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { Repository } from 'typeorm'

import { BaseService } from '../../base/base.service'

import { OAuth2Client, OAuth2ClientPopulateSpec } from './oauth2-client.entity'

@Injectable()
export class OAuth2ClientService extends BaseService<
  OAuth2Client,
  OAuth2ClientPopulateSpec
> {
  constructor(
    @InjectRepository(OAuth2Client)
    protected readonly repository: Repository<OAuth2Client>,
  ) {
    super()
  }
}
