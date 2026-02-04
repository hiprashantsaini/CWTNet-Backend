import mongoose from "mongoose";

const educationSchema = new mongoose.Schema({
  institutionName: {
    type: String,
    required: true,
    trim: true,
  },
  degree: {
    type: String,
    required: true,
    trim: true,
  },
  fieldOfStudy: {
    type: String,
    required: true,
    trim: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    // Not required to accommodate currently studying
  },
  isCurrentlyStudying: {
    type: Boolean,
    default: false,
  },
  grade: {
    type: String,
    trim: true,
  },
  activities: [{
    type: String,
    trim: true,
  }],
  description: {
    type: String,
    trim: true,
    maxLength: 2000, // LinkedIn-like limit
  },
  location: {
    type: String,
    trim: true,
  },
  media: [{
    title: String,
    url: String,
    type: {
      type: String,
      enum: ['image', 'document', 'link'],
    }
  }],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  }
}, {
  timestamps: true,
});

// Indexes for common queries
educationSchema.index({ user: 1, startDate: -1 });
educationSchema.index({ institutionName: 'text', fieldOfStudy: 'text' });

const Education = mongoose.model('Education', educationSchema);

export default Education;