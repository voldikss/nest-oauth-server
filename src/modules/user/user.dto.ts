import { IsNotEmpty, IsOptional } from 'class-validator'

export class UserCreateDTO {
  @IsNotEmpty()
  username!: string

  @IsNotEmpty()
  password!: string

  // @IsEmail()
  @IsOptional()
  email?: string
}

export class UserLoginDTO {
  @IsNotEmpty()
  username!: string

  @IsNotEmpty()
  password!: string
}
