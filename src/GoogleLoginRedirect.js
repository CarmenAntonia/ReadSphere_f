import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {useLogin} from "./context/LoginContext";

export default function GoogleLoginRedirect() {
    const navigate = useNavigate();
    const backend_url = process.env.REACT_APP_BACKEND_URL;
    const { setIsLoggedIn } = useLogin();

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');

        if (code) {
            fetch(`${backend_url}/account?code=${code}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include'
            })
            .then(res => res.json())
            .then(userId => {
                sessionStorage.setItem('userId', userId);
                console.log(userId);
                setIsLoggedIn(true);
                navigate('/home');
            })
            .catch(err => {
                console.error('Google login failed', err);
                navigate('/');
            });
        }
    }, [backend_url, navigate]);

    return <p>Logging you in...</p>;
}
