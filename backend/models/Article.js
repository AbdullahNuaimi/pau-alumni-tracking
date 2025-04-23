import mongoose from 'mongoose';
import slugify from 'slugify';


const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  sslug: { type: String, unique: true },
  content: {
    type: String,
    required: true
  },
  excerpt: {
    type: String,
    maxlength: 160
  },
  featuredImage: String,
  images: [String],
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  categories: [{
    type: String,
    enum: ['news', 'events', 'announcements', 'photos']
  }],
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  publishedAt: Date,
  metaTitle: String,
  metaDescription: String
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true } 
});


articleSchema.pre('save', function(next) {
    if (!this.slug) {
      this.slug = slugify(this.title, { 
        lower: true,
        strict: true 
      });
    }
    next();
  });
  

export default mongoose.model('Article', articleSchema);