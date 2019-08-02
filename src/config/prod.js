module.exports = {
  mongoURI: process.env.MONGO_URI,
  cookieKey: process.env.COOKIE_KEY,
  jwtHttpOnlyKey: process.env.JWT_SECRET_HTTP,
  jwtKey: process.env.JWT_SECRET,
  awsAccessKey: process.env.AWS_ACCESS_KEY,
  awsSecretAccessKey: process.env.AWS_SECRET_KEY,
};
