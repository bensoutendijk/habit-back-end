const express = require('express')
const cors = require('cors');
const session = require('express-session');
const mongoose = require('mongoose')
const keys = require('./config/keys')
const bodyParser = require('body-parser')

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors());
app.use(session({ 
  secret: 'passport-tutorial',
  cookie: { maxAge: 60000 },
  resave: false,
  saveUninitialized: false,
}));

mongoose.Promise = global.Promise
mongoose.connect(keys.mongoURI, {useNewUrlParser: true})

require('./models/User')
require('./models/Document')

require('./services/passport')

app.use(require('./routes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('Listening on port ', PORT)
})