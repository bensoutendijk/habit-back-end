const mongoose = require('mongoose');

const { Schema } = mongoose;

const articleSchema = new Schema({
  type: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
  },
});

const sectionSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  children: [articleSchema],
});

const projectSchema = new Schema({
  localUser: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    index: true,
    required: true,
  },
  visibility: {
    type: String,
    enum: ['public', 'private'],
    required: true,
  },
  sections: [sectionSchema],
});

mongoose.model('Project', projectSchema);
