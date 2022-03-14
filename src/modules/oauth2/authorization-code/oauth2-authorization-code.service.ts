import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { Repository } from 'typeorm'

import { BaseService } from '../../base/base.service'

import {
  OAuth2AuthorizationCode,
  OAuth2AuthorizationCodePopulateSpec,
} from './oauth2-authorization-code.entity'

@Injectable()
export class OAuth2AuthorizationCodeService extends BaseService<
  OAuth2AuthorizationCode,
  OAuth2AuthorizationCodePopulateSpec
> {
  constructor(
    @InjectRepository(OAuth2AuthorizationCode)
    protected readonly repository: Repository<OAuth2AuthorizationCode>,
  ) {
    super()
  }
}
