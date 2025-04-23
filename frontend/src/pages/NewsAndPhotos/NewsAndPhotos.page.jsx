import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

import { getCategoryName } from '../../utils/articleUtils';


import './NewsAndPhotos.css';

const NewsAndPhotos = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await axios.get('/api/v1/articles', {
          params: { 
            status: 'published',
            category: activeCategory === 'all' ? undefined : activeCategory
          }
        });
        setArticles(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [activeCategory]);

  if (loading) {
    return <div className="loading">جاري التحميل...</div>;
  }

  return (
    <div className="news-photos-container">
      <h1>أخبار وصور</h1>
      
      <div className="categories-filter">
        <button 
          className={activeCategory === 'all' ? 'active' : ''}
          onClick={() => setActiveCategory('all')}
        >
          الكل
        </button>
        {['news', 'events', 'announcements', 'photos'].map(cat => (
          <button
            key={cat}
            className={activeCategory === cat ? 'active' : ''}
            onClick={() => setActiveCategory(cat)}
          >
            {getCategoryName(cat)}
          </button>
        ))}
      </div>

      <div className="articles-grid">
        {articles.length > 0 ? (
          articles.map(article => (
            <ArticleCard key={article._id} article={article} />
          ))
        ) : (
          <div className="no-articles">لا توجد مقالات متاحة</div>
        )}
      </div>
    </div>
  );
};

const ArticleCard = ({ article }) => (
  <Link to={`/articles/${article._id}`} className="article-card">
    {article.featuredImage && (
      <div className="article-image">
        <img src={article.featuredImage} alt={article.title} />
      </div>
    )}
    <div className="article-content">
      <h3>{article.title}</h3>
      <p className="excerpt">{article.excerpt}</p>
      <div className="meta">
        <span className="date">
          {new Date(article.publishedAt).toLocaleDateString('ar-EG')}
        </span>
        <span className="category">
          {getCategoryName(article.categories[0])}
        </span>
      </div>
    </div>
  </Link>
);


export default NewsAndPhotos;