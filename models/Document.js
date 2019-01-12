const mongoose = require('mongoose');

const { Schema } = mongoose;

const documentSchema = new Schema({
  parent: String,
  name: String,
  children: [{
    type: String,
  }],
  body: {
    type: String,
  },
});

mongoose.model('Document', documentSchema);
