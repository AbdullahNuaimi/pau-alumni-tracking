import "./graduationBook.css"

const GraduationBook = () => {

  return (
    <div className="content">
    <h2>طلب كتاب التخرج</h2>

    <div className="request-form">
        <h3>إرسال طلب للحصول على كتاب التخرج</h3>
        <form>
            <label for="name">اسم الخريج</label>
            <input type="text" id="name" name="name" required placeholder="الاسم الرباعي" />

            <label for="grad-year">سنة التخرج</label>
            <select id="grad-year" name="grad-year" required>
                <option value="">اختر سنة التخرج</option>
            </select>

            <button type="submit">إرسال الطلب</button>
        </form>
    </div>
</div>
  );
};

export default GraduationBook;