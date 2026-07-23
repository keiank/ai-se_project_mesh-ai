import { createContext, useContext, useEffect, useState } from "react";
import type { CurrentUser } from "../types"
import { getCurrentUser } from "../utils/api";

type AuthContextValue = {
    currentUser: CurrentUser | null;
    isAuthenticated: boolean;
    login: (token: string, user: CurrentUser) => void;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextValue>({
    currentUser: null,
    isAuthenticated: false,
    login: () => {},
    logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    function login(token: string, user: CurrentUser) {
        localStorage.setItem('auth-token', token);
        setIsAuthenticated(true);
        setCurrentUser(user);
    }

    function logout() {
        localStorage.removeItem('auth-token');
        setIsAuthenticated(false);
        setCurrentUser(null);
    }

    useEffect(() => {
        const token = localStorage.getItem('auth-token');
        if (!token) {
            setIsLoading(false);
            return;
        }
        getCurrentUser()
            .then((res) => {
                if (res.data) {
                    setCurrentUser(res.data.user);
                    setIsAuthenticated(true);
                }
            })
            .catch(() => {
                localStorage.removeItem('auth-token');
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, []);

    return (
        <AuthContext.Provider value={{ currentUser, isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}