import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

import { getCategoryName } from '../../utils/articleUtils';

import axios from 'axios';
import './ArticleDetail.css';

const ArticleDetail = () => {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await axios.get(`/api/v1/articles/${slug}`);
        setArticle(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [slug]);

  if (loading) {
    return <div className="loading">جاري التحميل...</div>;
  }

  if (!article) {
    return <div className="error">المقال غير موجود</div>;
  }

  return (
    <div className="article-detail-container">
      <article className="article-content">
        <h1>{article.title}</h1>
        
        <div className="meta">
          <span className="date">
            نشر في {new Date(article.publishedAt).toLocaleDateString('ar-EG')}
          </span>
          <span className="category">
            {getCategoryName(article.categories[0])}
          </span>
        </div>

        {article.featuredImage && (
          <div className="featured-image">
            <img src={article.featuredImage} alt={article.title} />
          </div>
        )}

        <div 
          className="content"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        {article.images?.length > 0 && (
          <div className="gallery">
            <h2>معرض الصور</h2>
            <div className="gallery-grid">
              {article.images.map((img, index) => (
                <div key={index} className="gallery-item">
                  <img src={img} alt={`Gallery ${index + 1}`} />
                </div>
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  );
};

export default ArticleDetail;