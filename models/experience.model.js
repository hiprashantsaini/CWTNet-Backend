import mongoose from 'mongoose';

const experienceSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    job_title: {
      type: String,
      required: true,
      trim: true,
    },
    company: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    start_date: {
      type: Date,
      required: true,
    },
    end_date: {
      type: Date,
      default: null,
    },
    description: {
      type: String,
      trim: true,
    }
  },
  {
    timestamps: true, // Adds createdAt and updatedAt timestamps automatically
  }
);

const Experience=mongoose.model("Experience", experienceSchema)
export default Experience;
