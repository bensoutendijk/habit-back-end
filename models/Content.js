const mongoose = require('mongoose');
const { Schema } = mongoose;

const contentSchema = new Schema({
  body: String
});

mongoose.model('Content', contentSchema);