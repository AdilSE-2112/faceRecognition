import React, { useState, useEffect, useContext, createContext } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext()

const AuthProvider = ({ children }) => {
    const [auth_user_id, setAuth_user_id] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("jwtToken") || ""); 
    const devMode = false;

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('jwtToken');
        
        if (token) {
            setToken(token);
            setAuth_user_id(localStorage.getItem('auth_user_id'));
        }
    }, []);

    const loginAction = async (data) => {
        setToken(data.access);
        setAuth_user_id(data.auth_user_id)

        localStorage.setItem("jwtToken", data.access);
        localStorage.setItem("auth_user_id", data.auth_user_id);

        navigate('/');
    }

    const logOut = (data) => {
        setToken("");
        setAuth_user_id("");
        localStorage.removeItem("jwtToken");
        localStorage.removeItem("auth_user_id");
        navigate("/login");
    }

    return (
        <AuthContext.Provider 
            value={{ auth_user_id, setAuth_user_id, loginAction, logOut, token, setToken, devMode }} 
        >
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;

export const useAuth = () => {
    return useContext(AuthContext)
}
