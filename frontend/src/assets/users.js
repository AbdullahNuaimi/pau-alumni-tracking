import { DEFAULT_PROFILE_IMAGE } from './defaultPfpBase64.js';
export const usersList = [
    {
      name: 'محمد أحمد',
      email: 'mohamed@example.com',
      password: 'Tech2024!',
      isAdmin: true,
      profilePic: DEFAULT_PROFILE_IMAGE,
      education: {
        college: 'جامعة الأهلية الفلسطينية',
        major: 'هندسة الحاسوب',
        degree: 'بكالوريوس'
      },
      career: {
        employed: true,
        company: 'شركة التقنية الحديثة',
        title: 'مهندس برمجيات',
        duration: '2020 - الحاضر'
      }
    },
    {
      name: 'سارة يوسف',
      email: 'sara@example.com',
      password: 'Codegirl9',
      isAdmin: false,
      profilePic: DEFAULT_PROFILE_IMAGE,
      education: {
        college: 'جامعة القدس',
        major: 'علوم الحاسوب',
        degree: 'بكالوريوس'
      },
      career: {
        employed: false,
        company: '',
        title: '',
        duration: ''
      }
    },
    {
      name: 'خالد ناصر',
      email: 'khaled@example.com',
      password: 'DevPower7',
      isAdmin: false,
      profilePic: DEFAULT_PROFILE_IMAGE,
      education: {
        college: 'جامعة بيرزيت',
        major: 'هندسة أنظمة الحاسوب',
        degree: 'بكالوريوس'
      },
      career: {
        employed: true,
        company: 'شركة حلول النخبة',
        title: 'مطور نظم',
        duration: '2019 - الحاضر'
      }
    },
    {
      name: 'رنا عدنان',
      email: 'rana@example.com',
      password: 'SecurePass3',
      isAdmin: true,
      profilePic: DEFAULT_PROFILE_IMAGE,
      education: {
        college: 'الجامعة العربية الأمريكية',
        major: 'هندسة البرمجيات',
        degree: 'بكالوريوس'
      },
      career: {
        employed: true,
        company: 'شركة داتا تك',
        title: 'محللة نظم',
        duration: '2021 - الحاضر'
      }
    }
  ];