import mongoose from 'mongoose';

const EventSchema = new mongoose.Schema({
  coverImage: {
    type: String,
    default: null
  },
  eventType: {
    type: String,
    enum: ['ONLINE', 'IN_PERSON'],
    required: true
  },
  eventName: {
    type: String,
    required: true,
    trim: true
  },
  startDate: {
    type: String,
    required: true
  },
  startTime: {
    type: String,
    required: true
  },
  endDate: {
    type: String,
  },
  endTime: {
    type: String,
  },
  externalLink: {
    type: String,
    validate: {
      validator: function(v) {
        return v === '' || /^https?:\/\//.test(v);
      },
      message: 'External link must be a valid URL or empty'
    }
  },
  description: {
    type: String,
    trim: true
  },
  hostName: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['CLASS', 'Q&A_SESSION', 'SEMINAR','WORKSHOP','BOOTCAMP','WEBINAR'],
    required: true
  },
  user:{type:mongoose.Schema.Types.ObjectId,ref:'User'},
  participants:[{type:mongoose.Schema.Types.ObjectId,ref:'User'}]
}, {
  timestamps: true
});

export default mongoose.model('Event', EventSchema);