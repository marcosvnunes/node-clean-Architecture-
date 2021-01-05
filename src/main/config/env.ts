export const env = {
  port: process.env.PORT || 5050,
  mongoUrl: process.env.MONGO_URL ||
  'mongodb+srv://tickedev:651588@cluster0.9vtgm.mongodb.net/<dbname>?retryWrites=true&w=majority',
  secretKey: process.env.SECRET_KEY || '0000000000'

}
