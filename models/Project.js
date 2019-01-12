const mongoose = require('mongoose');

const { Schema } = mongoose;

const projectSchema = new Schema({
  userId: String,
  children: [{
    name: String,
    path: String,
    body: String,
  }],
});

mongoose.model('Project', projectSchema);
