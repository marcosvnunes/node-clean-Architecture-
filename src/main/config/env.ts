export const env = {
  port: process.env.PORT || 5050,
  mongoUrl: process.env.MONGO_URL ||
  '',
  secretKey: process.env.SECRET_KEY || '0000000000'

}
