import React, { useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";

export default function Login() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const [error, setError] = useState({
        email: null,
        password: null
    });
    const [formError, setFormError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));

        setError(prevError => ({
            ...prevError,
            [name]: null
        }));
    };

    const validateForm = () => {
        const newErrors = {};

        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required.';
        } else if (!emailPattern.test(formData.email)) {
            newErrors.email = 'Invalid email format.';
        }
        if(!formData.password){
            newErrors.password = 'Password is required.';
        }

        setError(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        setFormError(null);
        setError(null);

        if (!formData.email && !formData.password) {
            setFormError('Please fill out all fields.');
            return;
        }

        if (!validateForm()) {
            return;
        }
    
    fetch(`${backend_url}/logIn`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
            credentials: 'include',
        })
        .then(response => {
            return response.text();  
        })
        .then(data => {
            if (!data.includes('Login failed')) {
                setSuccess("Login successful");
                return fetch(`${backend_url}/userId`, {
                    method: 'GET',
                    credentials: 'include',
                });
            } else {
                throw new Error(data);  
            }
        })
        .then(response => {
            if (response) {
                return response.text();
            } else {
                throw new Error('userId was undefined');
            }
        })
        .then(userId => {
            sessionStorage.clear();
            sessionStorage.setItem('userId', userId);  
            navigate('/home');
        })
        .catch(error => {
            console.error('Error:', error);  
            setFormError(error.message);  
        });
    };        

    const client_id = process.env.REACT_APP_GOOGLE_CLIENT_ID;
    const redirect_uri = process.env.REACT_APP_REDIRECT_URI;
    const backend_url = process.env.REACT_APP_BACKEND_URL;

    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?redirect_uri=${redirect_uri}&response_type=code&client_id=${client_id}&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile+openid&access_type=offline&prompt=select_account`;

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        
        if (code) {
           fetch(`${backend_url}/account?code=${code}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => response.text())
        .catch(error => console.error('Error fetching access token:', error));
    }
}, [backend_url]);

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleSubmit}>
            <h1 className="login-h1">Log in</h1>
                <label className="login-label">
                    Email:
                    <br />
                    <input className="login-input"
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleInputChange}
                    />
                </label>
                <br />
                <label className="login-label">
                    Password:
                    <br />
                    <input className="login-input"
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleInputChange}
                    />
                </label>
                <br />
                <button className="login-button" type="submit">Submit</button>
                <p className="login-or">or</p>
                <a className="login-text"  href={googleAuthUrl} >
                <FontAwesomeIcon className = 'gicon' icon={faGoogle} />
                Sign in with Google
</a>
                <p className="login-text">Don't have an account yet?</p>
                <a className= "login-text" href="/register">Register</a>
                {!formError && error.email && <p className="login-text" style={{color: 'red'}} >{error.email}</p>}
                {!formError && error.password && <p className="login-text" style={{color: 'red'}}>{error.password}</p>}
                {formError && <p className="login-text" style={{color: 'red'}}>{formError}</p>}
            </form>
            <div className = "login-photo">
            </div>
        </div>
    );
}
