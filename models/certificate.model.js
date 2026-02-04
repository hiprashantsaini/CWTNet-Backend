import mongoose from 'mongoose';

const certificateSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  issuer: {
    type: String,
    required: true,
    trim: true
  },
  issue_date: {
    type: Date,
    required: true
  },
  expiration_date: {
    type: Date,
    default: null
  },
  credential_id: {  //certificate Id
    type: String,
    trim: true
  },
  credential_url: {
    type: String,
    trim: true,
  },
  image:{
    type:String,
  },
  description: {
    type: String,
    trim: true
  },
  visibility: {
    type: String,
    enum: ['public', 'connections', 'private'],
    default: 'public'
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Create index for efficient queries
certificateSchema.index({ user_id: 1, title: 1 });
certificateSchema.index({ issuer: 1 });

const Certificate = mongoose.model('Certificate', certificateSchema);

export default Certificate;