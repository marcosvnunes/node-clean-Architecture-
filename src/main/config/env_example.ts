export const env = {
  port: process.env.PORT || 5050,
  mongoUrl: process.env.MONGO_URL ||
  'url_mongo_here',
  secretKey: process.env.SECRET_KEY || '0000000000'

}
