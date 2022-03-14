import * as config from 'config'

export const AUTH_JWT_SECRET = config.get<string>('auth.jwtSecret')
export const AUTH_SESSION_EXPIRES_SECONDS = config.get<number>(
  'auth.sessionExpiresSeconds',
)

export const AUTH_JWT_NAME = 'token'
