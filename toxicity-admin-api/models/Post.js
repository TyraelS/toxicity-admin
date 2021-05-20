const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  status: {
	type: String,
	required: true,
	default: 'open'
  }
});

module.exports = Post = mongoose.model('post', PostSchema);
