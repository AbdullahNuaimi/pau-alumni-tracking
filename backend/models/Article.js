import mongoose from 'mongoose';

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Article title is required'],
    trim: true,
    unique: true
  },
  content: {
    type: String,
    required: [true, 'Article content is required']
  },
  excerpt: {
    type: String,
    maxlength: [160, 'Excerpt cannot exceed 160 characters']
  },
  featuredImage: {
    type: String,
    default: null
  },
  images: [{
    type: String
  }],
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  categories: [{
    type: String,
    enum: {
      values: ['news', 'events', 'announcements', 'photos', 'mou'],
      message: 'Invalid category'
    }
  }],
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  publishedAt: {
    type: Date,
    default: null
  },
  metaTitle: String,
  metaDescription: String
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});


articleSchema.virtual('formattedPublishedAt').get(function() {
  return this.publishedAt?.toLocaleDateString('ar-EG') || 'Not published';
});

const Article = mongoose.model('Article', articleSchema);

export default Article;