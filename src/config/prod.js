module.exports = {
  mongoURI: process.env.MONGO_URI,
  cookieKey: process.env.COOKIE_KEY,
  jwtHttpOnlyKey: process.env.JWT_SECRET_HTTP,
  jwtKey: process.env.JWT_SECRET,
};
