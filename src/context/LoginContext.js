import { createContext, useContext, useState } from "react";

export const LoginContext = createContext();

export const useLogin = () => useContext(LoginContext);

export function LoginProvider({ children }) {
    const [isLoggedIn, setIsLoggedIn] = useState(
        sessionStorage.getItem('userId')
    );

    return (
        <LoginContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
            {children}
        </LoginContext.Provider>
    );
}
