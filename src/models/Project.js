const mongoose = require('mongoose');

const { Schema } = mongoose;

const articleSchema = new Schema({
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
});

const sectionSchema = new Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  },
  children: [articleSchema],
});

const projectSchema = new Schema({
  name: {
    type: String,
    index: true,
    unique: true,
    required: true,
  },
  sections: [sectionSchema],
});

mongoose.model('Project', projectSchema);
