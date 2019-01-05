const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  name: String
});

mongoose.model('User', userSchema);