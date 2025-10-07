import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
  },
  name: {
    type: String,
  },
  path: {
    type: String,
    required: true,
  },
  hint1: {
    type: String,
  },
  hint2: {
    type: String,
  },
  right: {
    type: String,
    required: true,
  },
  wrong1: {
    type: String,
    required: true,
  },
  wrong2: {
    type: String,
    required: true,
  },
  wrong3: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Question = mongoose.model('Question', questionSchema);

export default Question;
