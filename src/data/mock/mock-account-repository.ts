import { mockAccountModel, mockAccountModelDB } from '../../domain/Fakes'
import { AccountModel } from '../../domain/models/account'
import { AddAccountParams } from '../../domain/usercases/add-account'
import { AddSurveyParams } from '../../domain/usercases/add-Survey'
import { AddAccountRepository } from '../protocols/db/account/add-account-repository'
import { LoadAccountByTokenRepository } from '../protocols/db/account/load-account-by-token-repository'
import { AddSurveyRepository } from '../protocols/db/survey/add-survey-repository'
import { LoadAccountByEmailRepository } from '../usecases/add-account/db-add-account-protocols'
import { UpdateAccessTokenRepository } from '../usecases/authenticate/db-authenticate-protocols'

export const mockAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add (account: AddAccountParams): Promise<AccountModel> {
      return Promise.resolve(mockAccountModelDB())
    }
  }
  return new AddAccountRepositoryStub()
}

export const mockLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async loadByEmail (email: string): Promise<AccountModel> {
      return Promise.resolve(mockAccountModelDB())
    }
  }
  return new LoadAccountByEmailRepositoryStub()
}

export const mockAddSurveyRepository = (): AddSurveyRepository => {
  class AddSurveyRepositoryStub implements AddSurveyRepository {
    async add (SurveyData: AddSurveyParams): Promise<void> {
      return Promise.resolve()
    }
  }
  return new AddSurveyRepositoryStub()
}

export const mockUpdateAccessTokenRepository = (): UpdateAccessTokenRepository => {
  class UpdateAccessTokenRepositoryStub implements UpdateAccessTokenRepository {
    async updateAccessToken (id: string, token: string): Promise<void> {
      return Promise.resolve()
    }
  }
  return new UpdateAccessTokenRepositoryStub()
}

export const mockLoadAccountByTokenRepositorystub = (): LoadAccountByTokenRepository => {
  class LoadAccountByTokenRepositorystub implements LoadAccountByTokenRepository {
    async loadByToken (token: string, role?: string): Promise<AccountModel> {
      return Promise.resolve(mockAccountModel())
    }
  }
  return new LoadAccountByTokenRepositorystub()
}
