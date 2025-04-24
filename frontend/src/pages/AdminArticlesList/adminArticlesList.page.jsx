import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import './adminArticlesList.css';

const AdminArticlesList = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await axios.get('/api/v1/articles/admin/list', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setArticles(res.data.data);
      } catch (err) {
        console.error(err);
        toast.error('حدث خطأ أثناء جلب المقالات');
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا المقال؟')) return;
    
    try {
      setDeletingId(id);
      await axios.delete(`/api/v1/articles/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setArticles(articles.filter(article => article._id !== id));
      toast.success('تم حذف المقال بنجاح');
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'حدث خطأ أثناء حذف المقال');
    } finally {
      setDeletingId(null);
    }
  };

  const getCategoryName = (category) => {
    const categoriesMap = {
      'news': 'أخبار',
      'events': 'أحداث',
      'announcements': 'إعلانات',
      'photos': 'صور'
    };
    return categoriesMap[category] || category;
  };

  if (loading) return <div className="loading">جاري تحميل المقالات...</div>;

  return (
    <div className="admin-articles-list">
      <div className="list-header">
        <h2>إدارة المقالات</h2>
        <Link to="/admin/articles/new" className="btn-primary">
          + مقال جديد
        </Link>
      </div>
      
      {articles.length === 0 ? (
        <div className="no-articles">
          <p>لا توجد مقالات متاحة</p>
          <Link to="/admin/articles/new" className="btn-primary">
            إنشاء مقال جديد
          </Link>
        </div>
      ) : (
        <table className="articles-table">
          <thead>
            <tr>
              <th>العنوان</th>
              <th>التصنيف</th>
              <th>الحالة</th>
              <th>تاريخ النشر</th>
              <th>الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {articles.map(article => (
              <tr key={article._id}>
                <td>{article.title}</td>
                <td>
                  {article.categories.map(cat => getCategoryName(cat)).join('، ')}
                </td>
                <td>
                  <span className={`status-badge ${article.status}`}>
                    {article.status === 'published' ? 'منشور' : 'مسودة'}
                  </span>
                </td>
                <td>
                  {article.publishedAt 
                    ? new Date(article.publishedAt).toLocaleDateString('ar-EG')
                    : '--'}
                </td>
                <td className="actions">
                  <Link 
                    to={`/admin/articles/edit/${article._id}`}
                    className="btn-edit"
                  >
                    تعديل
                  </Link>
                  <button
                    onClick={() => handleDelete(article._id)}
                    className="btn-delete"
                    disabled={deletingId === article._id}
                  >
                    {deletingId === article._id ? 'جاري الحذف...' : 'حذف'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminArticlesList;