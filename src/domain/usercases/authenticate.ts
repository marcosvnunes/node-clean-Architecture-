export interface Authenticate {
  auth (email: string, password: string): Promise<string>
}
