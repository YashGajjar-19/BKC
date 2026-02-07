import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    // ... existing firebase logic ... (Placeholder if you add Firebase later)

    // ADD THIS FUNCTION
    const login = (memberData) => {
        // We manually set the user state to the selected member
        setUser(memberData);
        // Optional: Save to localStorage so refresh doesn't kill session
        localStorage.setItem("bakchodi_user", JSON.stringify(memberData));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("bakchodi_user");
        // Also sign out of firebase if you use it later
        // signOut(auth); 
    };

    // On mount, check if user is in localStorage (for persistence)
    useEffect(() => {
        const saved = localStorage.getItem("bakchodi_user");
        if (saved) setUser(JSON.parse(saved));
    }, []);

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};