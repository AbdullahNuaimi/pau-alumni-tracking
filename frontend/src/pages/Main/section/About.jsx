import './sections.css';
const About = () => {
  return (
    <section className="about-section">
      <h2>من نحن؟</h2>
      <div className="content-box">
        <p>
          نظام متابعة الخريجين هو منصة إلكترونية تقدمها <strong>جامعة فلسطين الأهلية</strong> لتكون حلقة الوصل بين الجامعة وخريجيها، حيث نسعى إلى:
        </p>
        <ul>
          <li>تعزيز التواصل بين الخريجين والجامعة</li>
          <li>توفير فرص تدريبية ووظيفية للخريجين</li>
          <li>بناء شبكة مهنية قوية بين الخريجين</li>
          <li>تحديث بيانات الخريجين بشكل مستمر</li>
        </ul>

        <div className="mission-vision">
          <div className="card">
            <h3>رؤيتنا</h3>
            <p>أن نكون المنصة الرائدة في توثيق العلاقة بين الخريجين والجامعة </p>
          </div>
          <div className="card">
            <h3>رسالتنا</h3>
            <p>تمكين الخريجين من الاستفادة من شبكة الخريجين وموارد الجامعة لتطوير مسيرتهم المهنية</p>
          </div>
        </div>
      </div>
    </section>
  );
};
export default About;