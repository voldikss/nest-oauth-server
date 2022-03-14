import crypto from 'crypto'

export async function generateRandomToken() {
  const bytes = crypto.randomBytes(256)
  return crypto.createHash('sha1').update(bytes).digest('hex')
}
