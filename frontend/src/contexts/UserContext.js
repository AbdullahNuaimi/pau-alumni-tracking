import { createContext, useState, useContext } from 'react';
import { DEFAULT_PROFILE_IMAGE } from '../assets/defaultPfpBase64';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState({
        id: 1234567,
        name: 'محمد أحمد',
        email: 'mohamed@example.com',
        password: '',
        phone: '0512345678',
        socialMedia: [
          {
            label: 'LinkedIn',
            url: 'https://linkedin.com/in/username'
          },
          {
            label: 'Twitter',
            url: 'https://twitter.com/username'
          }
        ],
        isAdmin: true,
        profilePic: DEFAULT_PROFILE_IMAGE,
        resume: null,
        education: [
            {
                college: 'جامعة الأهلية الفلسطينية',
                major: 'هندسة الحاسوب',
                degree: 'بكالوريوس'
            },
            {
                college: 'جامعة القاهرة',
                major: 'علوم الحاسوب',
                degree: 'ماجستير'
            }
        ],
        career: [
          {
            employed: true,
            company: 'شركة التقنية الحديثة',
            title: 'مهندس برمجيات',
            duration: '2020/01/01 - 2023/12/31'
          },
          {
            employed: true,
            company: 'شركة البرمجيات المتقدمة', 
            title: 'مطور أول',
            duration: '2024/01/01 - الحاضر'
          }
        ]
    });
  
    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);