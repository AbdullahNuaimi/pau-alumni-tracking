import { FaBook, FaCalendarAlt, FaDownload } from 'react-icons/fa';
import './graduationBook.css';

const GraduationBook = () => {
  const graduationBooks = [
    {
      year: '2023',
      downloadUrl: 'https://paluniv.edu.ps/wp-content/uploads/2014/10/%D9%83%D8%AA%D8%A7%D8%A8-%D8%A7%D9%84%D8%AA%D8%AE%D8%B1%D9%8A%D8%AC-%D9%86%D8%B3%D8%AE%D8%A9-%D9%86%D9%87%D8%A7%D8%A6%D9%8A-9-9-2023.pdf',
      coverImage: 'https://grad.paluniv.edu.ps/assets/img/hero/grad-Bg.jpg',
      description: 'كتاب التخرج السنوي يحتوي على جميع خريجي دفعة 2023'
    },
    {
      year: '2022',
      downloadUrl: 'https://paluniv.edu.ps/wp-content/uploads/2022/10/%D9%83%D8%AA%D8%A7%D8%A8-%D8%A7%D9%84%D8%AA%D8%AE%D8%B1%D9%8A%D8%AC.pdf',
      coverImage: 'https://paluniv.edu.ps/wp-content/uploads/2022/08/6-scaled.jpg',
      description: 'كتاب التخرج السنوي يحتوي على جميع خريجي دفعة 2022'
    },
    {
      year: '2021',
      downloadUrl: 'https://paluniv.edu.ps/wp-content/uploads/2021/12/%D9%83%D8%AA%D8%A7%D8%A8-%D8%A7%D9%84%D8%AE%D8%B1%D9%8A%D8%AC%D9%8A%D9%86-%D8%A7%D9%84%D9%81%D9%88%D8%AC-%D8%A7%D9%84%D8%AD%D8%A7%D8%AF%D9%8A-%D8%B9%D8%B4%D8%B11.pdf',
      coverImage: 'https://paluniv.edu.ps/wp-content/uploads/2021/07/IMG_4594-scaled.jpg',
      description: 'كتاب التخرج السنوي يحتوي على جميع خريجي دفعة 2021'
    },
  ];

  return (
    <div className="graduation-book-page">
      <header className="page-header">
        <h1><FaBook /> كتب التخرج السنوية</h1>
        <p>تصفح كتب التخرج للدفعات السابقة</p>
      </header>

      <div className="books-container">
        {graduationBooks.map((book) => (
          <a 
            key={book.year}
            href={book.downloadUrl}
            className="book-card"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="book-cover">
              <img 
                src={book.coverImage} 
                alt={`كتاب التخرج ${book.year}`}
              />
              <div className="book-year">
                <FaCalendarAlt /> {book.year}
              </div>
            </div>
            <div className="book-details">
              <h3>كتاب التخرج السنوي لعام {book.year}</h3>
              <p>{book.description}</p>
              <div className="download-btn">
                <FaDownload /> تحميل الكتاب
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default GraduationBook;