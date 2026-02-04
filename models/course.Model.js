import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema(
  {
    provider_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Provider ID is required'],
      index: true, 
    },
    title: {
      type: String,
      required: [true, 'Course title is required'],
      trim: true,
      maxlength: [100, 'Course title cannot exceed 100 characters'],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true,
    },
    description: {
      type: String,
      required: [true, 'Course description is required'],
      trim: true,
      maxlength: [5000, 'Course description cannot exceed 5000 characters'],
    },
    short_description: {
      type: String,
      trim: true,
      maxlength: [200, 'Short description cannot exceed 200 characters'],
    },
    category: {
      type: String,
      required: [true, 'Course category is required'],
      trim: true,
      index: true,
    },
    subcategory: {
      type: String,
      trim: true,
    },
    tags: [{
      type: String,
      trim: true,
    }],
    level: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced', 'all-levels'],
      default: 'all-levels',
    },
    duration: {
      type: String,
      required: [true, 'Course duration is required'],
      trim: true,
    },
    duration_hours: {
      type: Number,
      min: 0,
    },
    price: {
      type: Number,
      required: [true, 'Course price is required'],
      min: 0,
    },
    discounted_price: {
      type: Number,
      min: 0,
      validate: {
        validator: function(value) {
          return value <= this.price;
        },
        message: 'Discounted price must be less than or equal to regular price'
      }
    },
    currency: {
      type: String,
      default: 'USD',
      enum: ['USD', 'EUR', 'GBP', 'INR', 'CAD', 'AUD'],
    },
    students_enrolled: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }],
    enrollment_count: {
      type: Number,
      default: 0,
    },
    language: {
      type: String,
      default: 'English',
    },
    prerequisites: [{
      type: String,
      trim: true,
    }],
    learning_outcomes: [{
      type: String,
      trim: true,
    }],
    course_content: [{
      section_title: {
        type: String,
        required: true,
      },
      lessons: [{
        title: {
          type: String,
          required: true,
        },
        type: {
          type: String,
          enum: ['video', 'quiz', 'assignment', 'text', 'downloadable'],
          default: 'video',
        },
        duration_minutes: {
          type: Number,
          min: 0,
        },
        is_free_preview: {
          type: Boolean,
          default: false,
        },
      }],
    }],
    thumbnail: {
      type: String, // URL to image
      default: '/default-course-thumbnail.jpg',
    },
    promotional_video: {
      type: String, // URL to video
    },
    rating: {
      average: {
        type: Number,
        min: 0,
        max: 5,
        default: 0,
      },
      count: {
        type: Number,
        default: 0,
      }
    },
    status: {
      type: String,
      enum: ['draft', 'published', 'archived', 'under_review'],
      default: 'draft',
    },
    is_featured: {
      type: Boolean,
      default: false,
    },
    certificate_available: {
      type: Boolean,
      default: false,
    },
    access_period: {
      type: String,
      enum: ['lifetime', '6-months', '1-year', '2-years'],
      default: 'lifetime',
    },
  },
  {
    timestamps: true, // Creates createdAt and updatedAt
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Create slug from the title before saving
courseSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^\w ]+/g, '')
      .replace(/ +/g, '-');
  }
  next();
});


courseSchema.virtual('enrollment_percentage').get(function() {
 
  const maxEnrollment = 1000;
  return Math.min(100, (this.enrollment_count / maxEnrollment) * 100).toFixed(1);
});

// Indexes for common query patterns
courseSchema.index({ provider_id: 1, status: 1 });
courseSchema.index({ category: 1, subcategory: 1 });
courseSchema.index({ price: 1 });
courseSchema.index({ 'rating.average': 1 });
courseSchema.index({ is_featured: 1 });
courseSchema.index({ createdAt: 1 });

const Course = mongoose.model('Course', courseSchema);

export default Course;
