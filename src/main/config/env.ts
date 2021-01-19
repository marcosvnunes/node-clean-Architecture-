export const env = {
  port: process.env.PORT || 5050,
  mongoUrl: process.env.MONGO_URL ||
  'mongodb://localhost:27017/clean-node-api',
  secretKey: process.env.SECRET_KEY || '0000000000'
}
