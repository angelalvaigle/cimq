import mongoose from 'mongoose';

const statSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
  },
  gameId: {
    type: String,
    required: true,
  },
  questionId: {
    type: String,
    required: true,
  },
  right: {
    type: Boolean,
    required: true,
  },
  time: {
    type: Number,
    required: true,
  },
  points: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Stat = mongoose.model('Stat', statSchema);

export default Stat;
