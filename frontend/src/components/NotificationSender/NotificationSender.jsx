import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaPaperPlane } from 'react-icons/fa';

const NotificationSender = ({ colleges, onSend }) => {
  const [content, setContent] = useState('');
  const [link, setLink] = useState('');
  const [targetType, setTargetType] = useState('all');
  const [targetValue, setTargetValue] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) {
      toast.error('يرجى إدخال محتوى الإشعار');
      return;
    }

    
    if (link.trim() && !/^https?:\/\//i.test(link.trim())) {
      toast.error('الرابط يجب أن يبدأ بـ http:// أو https://');
      return;
    }

    setIsSending(true);
    try {
      await axios.post('/api/v1/notifications', {
        content,
        link: link.trim() || undefined,
        targetType,
        targetValue: targetType === 'all' ? undefined : targetValue
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      toast.success('تم إرسال الإشعار بنجاح');
      setContent('');
      setLink('');
      setTargetType('all');
      setTargetValue('');
      if (onSend) onSend();
    } catch (error) {
      console.error('Error sending notification:', error);
      toast.error('فشل إرسال الإشعار');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="notification-sender" style={{
      background: 'white',
      padding: '1.5rem',
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
      marginBottom: '2rem'
    }}>
      <h2 style={{ marginBottom: '1.5rem', color: '#444' }}>إرسال إشعار</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', color: '#555' }}>محتوى الإشعار</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            style={{
              width: '100%',
              padding: '0.8rem',
              border: '1px solid #ddd',
              borderRadius: '6px',
              minHeight: '100px'
            }}
            required
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', color: '#555' }}>رابط اختياري</label>
          <input
            type="url"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            style={{
              width: '100%',
              padding: '0.8rem',
              border: '1px solid #ddd',
              borderRadius: '6px'
            }}
            placeholder="https://example.com"
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', color: '#555' }}>إرسال إلى</label>
          <select
            value={targetType}
            onChange={(e) => {
              setTargetType(e.target.value);
              setTargetValue('');
            }}
            style={{
              width: '100%',
              padding: '0.8rem',
              border: '1px solid #ddd',
              borderRadius: '6px',
              marginBottom: '1rem'
            }}
          >
            <option value="all">جميع المستخدمين</option>
            <option value="college">كلية محددة</option>
            <option value="employment">حالة وظيفية</option>
          </select>

          {targetType === 'college' && (
            <select
              value={targetValue}
              onChange={(e) => setTargetValue(e.target.value)}
              style={{
                width: '100%',
                padding: '0.8rem',
                border: '1px solid #ddd',
                borderRadius: '6px'
              }}
              required
            >
              <option value="">اختر الكلية</option>
              {colleges.map(college => (
                <option key={college} value={college}>{college}</option>
              ))}
            </select>
          )}

          {targetType === 'employment' && (
            <select
              value={targetValue}
              onChange={(e) => setTargetValue(e.target.value)}
              style={{
                width: '100%',
                padding: '0.8rem',
                border: '1px solid #ddd',
                borderRadius: '6px'
              }}
              required
            >
              <option value="">اختر الحالة الوظيفية</option>
              <option value="employed">موظفين</option>
              <option value="unemployed">غير موظفين</option>
            </select>
          )}
        </div>

        <button
          type="submit"
          disabled={isSending}
          style={{
            background: '#4CAF50',
            color: 'white',
            border: 'none',
            padding: '0.8rem 1.5rem',
            borderRadius: '6px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginRight: 'auto'
          }}
        >
          <FaPaperPlane />
          {isSending ? 'جاري الإرسال...' : 'إرسال الإشعار'}
        </button>
      </form>
    </div>
  );
};

export default NotificationSender;