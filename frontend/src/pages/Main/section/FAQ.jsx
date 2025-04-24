import './sections.css';
const FAQ = () => {
    const faqs = [
      {
        question: "كيف أسجل في النظام؟",
        answer: "يمكنك التسجيل باستخدام البريد الجامعي الخاص بك عبر صفحة تسجيل الدخول"
      },
      {
        question: "هل يمكنني تحديث بياناتي بعد التخرج؟",
        answer: "نعم، يمكنك تحديث معلوماتك الشخصية والمهنية في أي وقت"
      },
      {
        question: "كيف أستفيد من شبكة الخريجين؟",
        answer: "يمكنك تصفح دليل الخريجين والاتصال بزملائك في نفس التخصص أو المنطقة الجغرافية"
      },
      {
        question: "هل توجد رسوم للاشتراك؟",
        answer: "الخدمة مجانية بالكامل لجميع خريجي الجامعة"
      }
    ];
  
    return (
      <section className="faq-section">
        <h2>الأسئلة المتكررة</h2>
        <div className="faq-list">
          {faqs.map((faq, index) => (
            <details key={index} className="faq-item">
              <summary>{faq.question}</summary>
              <p>{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>
    );
  };

export default  FAQ;