const mongoose = require('mongoose');
const { Schema } = mongoose;

const documentSchema = new Schema({
  parent: String,
  name: String,
  children: [{
    type: String
  }],
  body: {
    type: String
  }
});

documentSchema.methods.toJSON = function() {
  return {
    _id: this._id,
    name: this.name,
  };
};

mongoose.model('Document', documentSchema);