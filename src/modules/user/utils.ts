import * as bcrypt from 'bcrypt'

export async function encrypt(password: string) {
  const salt = await bcrypt.genSalt(10)
  return await bcrypt.hash(password, salt)
}

export async function verify(data: string, encrypted: string) {
  return await bcrypt.compare(data, encrypted)
}
