import { useState, useEffect } from 'react';
import { useUser } from '../../contexts/UserContext';
import axios from 'axios';
import { toast, Bounce } from 'react-toastify';
import './careerEditor.css';

const CareerEditor = () => {
  const { user, setUser } = useUser();
  const [editMode, setEditMode] = useState(false);
  const [careers, setCareers] = useState(user?.career || []);
  const [newCareer, setNewCareer] = useState({
    company: '',
    position: '',
    startDate: '',
    endDate: '',
    currentlyWorking: false
  });

  useEffect(() => {
    setCareers(user?.career || []);
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewCareer(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleCareerChange = (index, field, value) => {
    const updatedCareers = [...careers];
    updatedCareers[index][field] = value;
    setCareers(updatedCareers);
  };

  const addCareer = () => {
    if (!newCareer.company || !newCareer.position || !newCareer.startDate) {
      toast.error('الرجاء إدخال الشركة والمسمى الوظيفي وتاريخ البدء', { transition: Bounce });
      return;
    }

    setCareers(prev => [
      ...prev,
      {
        ...newCareer,
        startDate: new Date(newCareer.startDate),
        endDate: newCareer.currentlyWorking ? null : new Date(newCareer.endDate)
      }
    ]);

    setNewCareer({
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      currentlyWorking: false
    });
  };

  const removeCareer = (index) => {
    setCareers(prev => prev.filter((_, i) => i !== index));
  };

  const saveCareers = async () => {
    try {
      const response = await axios.put(
        '/api/v1/auth/updateCareer',
        {
          id: user._id,
          career: careers.map(c => ({
            ...c,
            startDate: new Date(c.startDate),
            endDate: c.currentlyWorking ? null : (c.endDate ? new Date(c.endDate) : null)
          }))
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (response.data.success) {
        setUser(response.data.data);
        localStorage.setItem('user', JSON.stringify(response.data.data));
        toast.success('تم تحديث المسار الوظيفي بنجاح', { transition: Bounce });
        setEditMode(false);
      }
    } catch (error) {
      console.error('Error updating career:', error);
      toast.error(error.response?.data?.message || 'حدث خطأ أثناء التحديث', { 
        transition: Bounce 
      });
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'حتى الآن';
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-EG');
  };

  return (
    <div className="career-editor">
      <div className="career-header">
        <h3>المسار الوظيفي</h3>
        <button 
          className={`edit-toggle-btn ${editMode ? 'cancel' : ''}`}
          onClick={() => setEditMode(!editMode)}
        >
          {editMode ? 'إلغاء' : 'تعديل'}
        </button>
      </div>

      {editMode ? (
        <div className="edit-career">
          <div className="career-form">
            <div className="form-group">
              <label>الشركة</label>
              <input
                type="text"
                name="company"
                value={newCareer.company}
                onChange={handleInputChange}
                placeholder="اسم الشركة"
              />
            </div>

            <div className="form-group">
              <label>المسمى الوظيفي</label>
              <input
                type="text"
                name="position"
                value={newCareer.position}
                onChange={handleInputChange}
                placeholder="المسمى الوظيفي"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>تاريخ البدء</label>
                <input
                  type="date"
                  name="startDate"
                  value={newCareer.startDate}
                  onChange={handleInputChange}
                />
              </div>

              {!newCareer.currentlyWorking && (
                <div className="form-group">
                  <label>تاريخ الانتهاء</label>
                  <input
                    type="date"
                    name="endDate"
                    value={newCareer.endDate}
                    onChange={handleInputChange}
                    disabled={newCareer.currentlyWorking}
                  />
                </div>
              )}
            </div>

            <div className="form-checkbox">
              <label>
                <input
                  type="checkbox"
                  name="currentlyWorking"
                  checked={newCareer.currentlyWorking}
                  onChange={handleInputChange}
                />
                ما زلت أعمل هنا
              </label>
            </div>

            <button 
              className="add-career-btn"
              onClick={addCareer}
            >
              إضافة وظيفة
            </button>
          </div>

          <div className="career-list">
            {careers.map((career, index) => (
              <div key={index} className="career-item">
                <div className="career-details">
                  <input
                    type="text"
                    value={career.company}
                    onChange={(e) => handleCareerChange(index, 'company', e.target.value)}
                    placeholder="الشركة"
                  />
                  <input
                    type="text"
                    value={career.position}
                    onChange={(e) => handleCareerChange(index, 'position', e.target.value)}
                    placeholder="المسمى الوظيفي"
                  />
                  <div className="date-inputs">
                    <input
                      type="date"
                      value={career.startDate instanceof Date ? career.startDate.toISOString().split('T')[0] : career.startDate}
                      onChange={(e) => handleCareerChange(index, 'startDate', e.target.value)}
                    />
                    {!career.currentlyWorking && (
                      <input
                        type="date"
                        value={career.endDate instanceof Date ? career.endDate.toISOString().split('T')[0] : career.endDate}
                        onChange={(e) => handleCareerChange(index, 'endDate', e.target.value)}
                      />
                    )}
                    <label>
                      <input
                        type="checkbox"
                        checked={career.currentlyWorking}
                        onChange={(e) => handleCareerChange(index, 'currentlyWorking', e.target.checked)}
                      />
                      ما زلت أعمل هنا
                    </label>
                  </div>
                </div>
                <button
                  className="remove-career-btn"
                  onClick={() => removeCareer(index)}
                >
                  حذف
                </button>
              </div>
            ))}
          </div>

          <div className="form-actions">
            <button 
              className="save-btn"
              onClick={saveCareers}
              disabled={careers.length === 0}
            >
              حفظ التغييرات
            </button>
          </div>
        </div>
      ) : (
        <div className="view-career">
          {careers.length > 0 ? (
            <ul className="career-timeline">
              {careers.map((career, index) => (
                <li key={index} className="timeline-item">
                  <div className="timeline-content">
                    <h4>{career.position}</h4>
                    <p className="company">{career.company}</p>
                    <p className="duration">
                      {formatDate(career.startDate)} - {formatDate(career.endDate)}
                      {career.currentlyWorking && ' (حتى الآن)'}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="no-career">لا توجد معلومات عن المسار الوظيفي</p>
          )}
        </div>
      )}
    </div>
  );
};

export default CareerEditor;