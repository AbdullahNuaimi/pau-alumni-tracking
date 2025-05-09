import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import { getCategoryName } from '../../utils/articleUtils';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './AdminArticleEditor.css';

const AdminArticleEditor = () => {
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [featuredImage, setFeaturedImage] = useState(null);
  const [images, setImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [status, setStatus] = useState('draft');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(isEditMode);
  const fileInputRef = useRef();
  const navigate = useNavigate();


  useEffect(() => {
    if (!isEditMode) return;

    const fetchArticle = async () => {
      try {
        const res = await axios.get(`/api/v1/articles/${id}`);
        const article = res.data.data;

        setTitle(article.title);
        setContent(article.content);
        setExcerpt(article.excerpt || '');
        setFeaturedImage(article.featuredImage || null);
        setImages(article.images || []);
        setCategories(article.categories || []);
        setStatus(article.status || 'draft');
      } catch (err) {
        console.error('Error fetching article:', err);
        toast.error('حدث خطأ أثناء جلب بيانات المقال');
        navigate('/admin/articles');
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticle();
  }, [id, isEditMode, navigate]);

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    const formData = new FormData();

    files.forEach(file => {
      formData.append('images', file);
    });

    try {
      const res = await axios.post(
        '/api/v1/articles/upload',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (files.length === 1) {
        setFeaturedImage(res.data.files[0].url);
      } else {
        setImages(prev => [...prev, ...res.data.files.map(f => f.url)]);
      }
    } catch (err) {
      console.error('Upload error:', err.response?.data || err.message);
      toast.error(err.response?.data?.message || 'حدث خطأ أثناء رفع الصور');
    }
  };

  const handleSubmit = async () => {
    if (!title || !content) {
      toast.error('العنوان والمحتوى مطلوبان');
      return;
    }

    setIsSubmitting(true);
    try {
      const articleData = {
        title,
        content,
        excerpt,
        featuredImage,
        images,
        categories,
        status,
        publishedAt: status === 'published' ? new Date() : null
      };

      if (isEditMode) {
        await axios.patch(`/api/v1/articles/${id}`, articleData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        toast.success('تم تحديث المقال بنجاح');
      } else {
        await axios.post('/api/v1/articles', articleData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        toast.success('تم إنشاء المقال بنجاح');
      }

      navigate('/admin/articles');
    } catch (err) {
      console.error(err);
      toast.error(`حدث خطأ أثناء ${isEditMode ? 'تحديث' : 'إنشاء'} المقال`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="article-editor-container">جارٍ تحميل المقال...</div>;
  }

  return (
    <div className="article-editor-container">
      <h1>{isEditMode ? 'تعديل المقال' : 'إنشاء مقال جديد'}</h1>

      <div className="editor-section">
        <label>عنوان المقال</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="أدخل عنوان المقال"
        />
      </div>

      <div className="editor-section">
        <label>المحتوى</label>
        <ReactQuill
          value={content}
          onChange={setContent}
          modules={quillModules}
          formats={quillFormats}
          placeholder="اكتب محتوى المقال هنا..."
        />
      </div>

      <div className="editor-section">
        <label>ملخص المقال (اختياري)</label>
        <textarea
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          placeholder="ملخص مختصر للمقال"
          rows="3"
          maxLength="160"
        />
      </div>

      <div className="editor-section">
        <label>الصورة الرئيسية</label>
        {featuredImage ? (
          <div className="image-preview">
            <img src={featuredImage} alt="Featured" />
            <button onClick={() => setFeaturedImage(null)}>إزالة</button>
          </div>
        ) : (
          <button onClick={() => fileInputRef.current.click()}>
            اختر صورة رئيسية
          </button>
        )}
      </div>

      <div className="editor-section">
        <label>صور إضافية</label>
        <div className="gallery-preview">
          {images.map((img, index) => (
            <div key={index} className="gallery-item">
              <img src={img} alt={`Gallery ${index}`} />
              <button onClick={() => setImages(images.filter((_, i) => i !== index))}>
                إزالة
              </button>
            </div>
          ))}
        </div>
        <button onClick={() => fileInputRef.current.click()}>
          إضافة صور للمعرض
        </button>
      </div>

      <div className="editor-section">
        <label>التصنيفات</label>
        <div className="categories-select">
          {['news', 'events', 'announcements', 'photos', 'mou'].map(cat => (
            <label key={cat}>
              <input
                type="checkbox"
                checked={categories.includes(cat)}
                onChange={() => setCategories(prev =>
                  prev.includes(cat)
                    ? prev.filter(c => c !== cat)
                    : [...prev, cat]
                )}
              />
              {getCategoryName(cat)}
            </label>
          ))}
        </div>
      </div>

      <div className="editor-section">
        <label>حالة المقال</label>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="draft">مسودة</option>
          <option value="published">منشور</option>
        </select>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageUpload}
        accept="image/*"
        multiple
        style={{ display: 'none' }}
      />

      <div className="editor-actions">
        <button onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? 'جاري الحفظ...' : isEditMode ? 'تحديث المقال' : 'حفظ المقال'}
        </button>
      </div>
    </div>
  );
};

const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['link', 'image'],
    [{ direction: "rtl" }],
    ['clean'],
  ]
};

const quillFormats = [
  'header',
  'bold', 'italic', 'underline', 'strike',
  'list', 'bullet',
  'link', 'image',
  "direction"
];


export default AdminArticleEditor;