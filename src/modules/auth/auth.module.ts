import { Module } from '@nestjs/common'

import { UserModule } from '../user/user.module'

import { AuthHelper } from './auth.helper'

@Module({
  imports: [UserModule],
  providers: [AuthHelper],
  exports: [AuthHelper],
})
export class AuthModule {}
