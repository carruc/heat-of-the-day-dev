import mongoose from 'mongoose';

const recordSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  position: {
    type: String,
    required: true
  },
  level: {
    type: String,
    required: true
  }
});

export default mongoose.model('Record', recordSchema); 