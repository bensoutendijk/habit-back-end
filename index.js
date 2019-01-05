const express = require('express')
const mongoose = require('mongoose')
const keys = require('./config/keys')
const passport = require('passport')
const bodyParser = require('body-parser')
const cookieSession = require('cookie-session')

require('./models/User')
require('./models/Content')

require('./services/passport')

mongoose.Promise = global.Promise
mongoose.connect(keys.mongoURI, {useNewUrlParser: true})

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [keys.cookieKey]
  })
);
app.use(passport.initialize())
app.use(passport.session())

require('./routes/authRoutes')(app)

if (['production'].includes(process.env.NODE_ENV)) {
  app.use(express.static('http://perpetual-question.surge.sh/'));

  const path = require('path');
  app.get('*', (req, res) => {
    res.sendFile(path.resolve('client', 'build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('Listening on port ', PORT)
})