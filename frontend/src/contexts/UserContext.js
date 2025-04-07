import { createContext, useState, useContext } from 'react';
import { DEFAULT_PROFILE_IMAGE } from '../assets/defaultPfpBase64';
const UserContext = createContext();
export const UserProvider = ({ children }) => {
    const [user, setUser] = useState({
        id: 1234567,
        name: 'محمد أحمد',
        email: 'mohamed@example.com',
        password: '',
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
        },
    });
  
    return (
      <UserContext.Provider value={{ user, setUser }}>
        {children}
      </UserContext.Provider>
    );
  };

  export const useUser = () => useContext(UserContext);
