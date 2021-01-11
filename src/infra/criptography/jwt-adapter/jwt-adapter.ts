import jwt from 'jsonwebtoken'
import { Decrypter } from '../../../data/protocols/cryptography/decrypter'
import { Encrypter } from '../../../data/protocols/cryptography/encrypter'

export class JwtAdapter implements Encrypter, Decrypter {
  constructor (private readonly secret: string) {}

  async encrypt (value: string): Promise<string> {
    const accessToekn = await jwt.sign({ id: value }, this.secret)
    return accessToekn
  }

  async decrypt (token: string): Promise<string> {
    const accessToekn: any = await jwt.verify(token, this.secret)
    return accessToekn
  }
}
