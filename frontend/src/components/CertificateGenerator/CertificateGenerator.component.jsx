import React, { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import './CertificateGenerator.css';
import universityStamp from '../../assets/university-stamp.PNG';

const CertificateGenerator = () => {
  const [formData, setFormData] = useState({
    studentName: '',
    trainingName: '',
    startDate: '',
    endDate: ''
  });

  const certificateRef = useRef();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const generatePDF = async () => {
    if (!formData.studentName || !formData.trainingName || !formData.startDate || !formData.endDate) {
      alert('الرجاء ملء جميع الحقول المطلوبة');
      return;
    }

    try {
      const element = certificateRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: true
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm'
      });

      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`شهادة_${formData.studentName}_${formData.trainingName}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('حدث خطأ أثناء إنشاء ملف PDF');
    }
  };

  return (
    <div className="certificate-generator-container">
      <div className="form-container">
        <h2>إنشاء شهادة تدريب</h2>
        <div className="form-group">
          <label>اسم الطالب:</label>
          <input
            type="text"
            name="studentName"
            value={formData.studentName}
            onChange={handleChange}
            placeholder="أدخل اسم الطالب"
            required
          />
        </div>
        <div className="form-group">
          <label>اسم التدريب:</label>
          <input
            type="text"
            name="trainingName"
            value={formData.trainingName}
            onChange={handleChange}
            placeholder="أدخل اسم التدريب"
            required
          />
        </div>
        <div className="form-group">
          <label>تاريخ البداية:</label>
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>تاريخ النهاية:</label>
          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            required
          />
        </div>
        <button 
          onClick={generatePDF}
          disabled={!formData.studentName || !formData.trainingName || !formData.startDate || !formData.endDate}
        >
          تحميل الشهادة كPDF
        </button>
      </div>

      <div className="certificate-preview">
        <div className="certificate" ref={certificateRef}>
          <div className="certificate-border">
            <div className="certificate-header">
              <h1>جامعة فلسطين الأهلية</h1>
              <h2>Palestine Ahliya University</h2>
              <div className="header-decoration"></div>
            </div>
            
            <div className="certificate-body">
              <p className="certificate-text">
                تشهد جامعة فلسطين الأهلية أن الطالب <strong>{formData.studentName || "__________"}</strong><br />
                انهى تدريب <strong>{formData.trainingName || "__________"}</strong><br />
                من تاريخ <strong>{formData.startDate ? new Date(formData.startDate).toLocaleDateString('ar-EG') : "__________"}</strong><br />
                حتى تاريخ <strong>{formData.endDate ? new Date(formData.endDate).toLocaleDateString('ar-EG') : "__________"}</strong>
              </p>
              
              <div className="signatures">
                <div className="signature">
                  <div className="signature-line"></div>
                  <p>رئيس الجامعة</p>
                </div>
                <div className="university-stamp">
                  <img src={universityStamp} alt="ختم الجامعة" />
                </div>
                <div className="signature">
                  <div className="signature-line"></div>
                  <p>مدير التدريب</p>
                </div>
              </div>
            </div>
            
            <div className="certificate-footer">
              <p>شهادة رقم: {Math.floor(Math.random() * 10000)}</p>
              <p>تاريخ الإصدار: {new Date().toLocaleDateString('ar-EG')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificateGenerator;