export interface UpdateAccessTokenRepository {
  updateAccessToekn (id: string, token: string): Promise<void>
}
