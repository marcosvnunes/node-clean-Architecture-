import { HttpRequest, HttpResponse } from './http'
export interface Middlewares {
  handle (httpRequest: HttpRequest): Promise<HttpResponse>
}
