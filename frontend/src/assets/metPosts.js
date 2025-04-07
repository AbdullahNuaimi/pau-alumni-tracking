export const examplePosts = [
  {
    id: 1,
    author: "أحمد محمد",
    authorImage: "https://images.pexels.com/photos/7862484/pexels-photo-7862484.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", // Arabic male avatar
    content: "أبحث عن فرصة عمل في مجال تطوير الويب",
    type: "job",
    status: "approved",
    date: "١٥ يونيو ٢٠٢٣",
    metadata: {
      location: "رام الله, فلسطين",
      contact: "ahmed@example.com",
      salary: "٣٠٠٠-٤٠٠٠ شيكل",
      tags: ["وظائف", "تكنولوجيا"],
      image: "https://img.freepik.com/free-vector/man-search-hiring-job-online-from-laptop_1150-52728.jpg" // Job search photo
    }
  },
  {
    id: 2,
    author: "سارة خالد",
    authorImage: "https://static.vecteezy.com/system/resources/previews/001/993/889/non_2x/beautiful-latin-woman-avatar-character-icon-free-vector.jpg", // Arabic female avatar
    content: "حصلت على قبول في جامعة هارفارد!",
    type: "success",
    status: "approved",
    date: "١٠ مايو ٢٠٢٣",
    metadata: {
      achievement: "قبول ماجستير",
      university: "هارفارد",
      major: "هندسة الحاسوب",
      image: "https://ual-media-res.cloudinary.com/image/fetch/c_fill,f_auto,fl_lossy,q_auto,w_2000,g_auto,g_auto/https://www.arts.ac.uk/__data/assets/image/0027/446724/R6AC3315.jpg" // Graduation photo
    }
  },
  {
    id: 3,
    author: "جامعة الأهلية",
    authorImage: "https://paluniv.edu.ps/wp-content/uploads/2023/01/logo-page-print.png", // University logo
    content: "ورشة عمل عن الذكاء الاصطناعي يوم الخميس القادم",
    type: "announcement",
    status: "pending",
    date: "٢٠ يونيو ٢٠٢٣",
    metadata: {
      eventDate: "٢٢ يونيو ٢٠٢٣",
      time: "١٠ صباحاً - ١٢ ظهراً",
      location: "المبنى الرئيسي - قاعة المؤتمرات",
      image: "https://st2.depositphotos.com/3591429/5246/i/450/depositphotos_52466041-stock-illustration-business-people-at-the-meeting.jpg" // Workshop photo
    }
  }
];