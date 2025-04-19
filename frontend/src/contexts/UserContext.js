import { createContext, useState, useContext } from 'react';
import { DEFAULT_PROFILE_IMAGE } from '../assets/defaultPfpBase64';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState({
        id: "",
        name: "",
        email: '',
        password: '',
        phone: '',
        socialMedia: [],
        isAdmin: true,
        role: 'admin',
        profilePic: DEFAULT_PROFILE_IMAGE,
        resume: null,
        education: [],
        career: []
    });
  
    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);