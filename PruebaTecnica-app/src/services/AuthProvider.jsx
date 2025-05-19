import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from './AuthService'; // Asegúrate de importar authService correctamente
import {
    TOKEN_STORAGE_KEY, USER_STORAGE_KEY,
} from '../utils/constantes';

export const AuthContext = React.createContext({
    user: null,
    signin: () => { },
    signout: () => { },
    isLoading: false,

});

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);


    useEffect(() => {
        const initializeAuth = async () => {
            const token = localStorage.getItem(TOKEN_STORAGE_KEY);
            if (token) {
                setIsLoading(false);
                try {

                    const user = localStorage.getItem(USER_STORAGE_KEY);
                    setUser(user);
                    AuthContext.user = user;
                    setIsLoading(false);
                } catch (error) {
                    setIsLoading(false);
                    console.error('Error al validar el token:', error);
                }
            } else {

                setIsLoading(false);
                navigate('/login');
                setUser('');
            }
        };
        initializeAuth();
    }, []);


    const signin = async (endpoint, method, data, additionalHeaders) => {
        setIsLoading(true);
        try {
            const userData = await AuthService.fetchWithAuth(endpoint, method, data, additionalHeaders);

            if (userData.result.codigo === 200) {

                localStorage.setItem(TOKEN_STORAGE_KEY, userData.result.accessToken);
                setUser(userData.result);
                setIsLoading(false);
                localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData.result.user));
                document.cookie = `refreshToken=${userData.result.refreshToken}; path=/; max-age=${60 * 60 * 24 * 7}; secure; samesite=strict`;
                navigate('/home');
            } else {
                navigate('/login');
                setIsLoading(false);
                return userData;
            }
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
            setIsLoading(false);
        }
    };



    // Cerrar sesión 
    const signout = async (endpoint, method, data) => {
        setIsLoading(true);
        try {
            
            const userData = await AuthService.fetchWithAuth(endpoint, method, data);
            if (userData.result.codigo === 200) {
                localStorage.removeItem(TOKEN_STORAGE_KEY);
                localStorage.removeItem(USER_STORAGE_KEY);
                localStorage.clear();
                setUser(null);
                setIsLoading(false);
            } else {
                setIsLoading(false);
            }
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
            setIsLoading(false);
            navigate('/login');
        }
    };

    const value = { user, signin, signout, isLoading };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};