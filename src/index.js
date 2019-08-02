import '@babel/polyfill';

import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import keys from './config/keys';

const app = express();

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

mongoose.Promise = global.Promise;
mongoose.connect(keys.mongoURI, { useNewUrlParser: true });

require('./models/User');
require('./models/Project');

require('./services/passport');

app.use(require('./routes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('Listening on port ', PORT);
});
