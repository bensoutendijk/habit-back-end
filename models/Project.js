const mongoose = require('mongoose');

const { Schema } = mongoose;

const projectSchema = new Schema({
  name: {
    type: String,
    index: true,
    unique: true,
    required: true,
  },
  sections: [{
    name: {
      type: String,
      unique: true,
      required: true,
    },
    children: [{
      type: {
        type: String,
        required: true,
      },
      name: {
        type: String,
        unique: true,
        required: true,
      },
      slug: {
        type: String,
        unique: true,
        required: true,
      },
    }],
  }],
});

mongoose.model('Project', projectSchema);
