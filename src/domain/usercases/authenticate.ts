export interface AuthenticateModel {
  email: string
  password: string
}

export interface Authenticate {
  auth (authenticate: AuthenticateModel): Promise<string>
}
