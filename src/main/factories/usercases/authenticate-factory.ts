import { AccountMongoRepository } from '../../../infra/db/mongodb/account/account-repository'
import { BcryptAdapter } from '../../../infra/criptography/bcrypt-adapter/bcrypt-adapter'
import { DbAuthenticate } from '../../../data/usecases/authenticate/db-authenticate'
import { JwtAdapter } from '../../../infra/criptography/jwt-adapter/jwt-adapter'
import { env } from '../../config/env'
import { Authenticate } from '../../../domain/usercases/authenticate'

export const makeAuthenticate = (): Authenticate => {
  const salt = 12
  const accountMongoRepository = new AccountMongoRepository()
  const jwtAdapter = new JwtAdapter(env.secretKey)
  const bcryptAdapter = new BcryptAdapter(salt)
  return new DbAuthenticate(accountMongoRepository, bcryptAdapter, jwtAdapter, accountMongoRepository)
}
