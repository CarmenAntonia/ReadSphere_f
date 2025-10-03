import React from 'react';
import { useState, useEffect } from 'react';
import './Register.css';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";



export default function Register() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: '',
        email:  '',
        password: ''
    });


    const [error, setError] = useState({
        username: null,
        email: null,
        password: null
    });

    const [formError, setFormError] = useState(null);
    const [success , setSuccess] = useState(null);

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

        if (!formData.username.trim()) {
            newErrors.username = 'Username is required.';
        }

        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required.';
        } else if (!emailPattern.test(formData.email)) {
            newErrors.email = 'Invalid email format.';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required.';
        } else if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters long.';
        }

        setError(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const client_id = process.env.REACT_APP_GOOGLE_CLIENT_ID;
    const redirect_uri = process.env.REACT_APP_REDIRECT_URI;
    const backend_url = process.env.REACT_APP_BACKEND_URL;

    const handleSubmit = (event) => {
        event.preventDefault();

        setFormError(null);
        setError({ username: null, email: null, password: null });
        
        if (!formData.username && !formData.email && !formData.password) {
            setFormError('All fields are required.');
            return;
        }

        if (!validateForm()) {
            return;
        }
    
        const dataToSend = {
            name: formData.username, 
            email: formData.email,
            password: formData.password
        };

        console.log('Backend URL:', backend_url);

        fetch(`${backend_url}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dataToSend),
        })
        .then(response => {
            return response.text(); 
        })
        .then(data => {
            console.log("Response from backend:", data);
            if (data.includes('Registration successful')) {
                setSuccess('Registration successful. Please log in!');
                navigate('/');
            } else {
                throw new Error(data);  
            }
        })
        .catch(error => {
            setFormError(error.message); 
        });
    };
    
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
            })
            .then(response => response.text())
            .then(data => {
                window.location.href = '/account';
            })
            .catch(error => console.error('Error fetching access token:', error));
        }
    }, [backend_url]);

    return (
        <div className='reg-container'>
            <form className='reg-form' onSubmit={handleSubmit}>
            <h1>Register</h1>
                <label>
                    Username:
                    <br />
                    <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        value={formData.username}
                        onChange={handleInputChange} 
                    />
                </label>
                <br />
                <label>
                    Email:
                    <br />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleInputChange}
                    />
                </label>
                <br />
                <label>
                    Password:
                    <br />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleInputChange}
                    />
                </label>
                <br />
                <button type="submit" >Submit</button>
                <p className="or">or</p>
                <a className='text'  href={googleAuthUrl} >
                <FontAwesomeIcon className = 'gicon' icon={faGoogle} />
  Sign in with Google </a>
                {!formError && error.email && <p className="text" style={{ color: 'red' }}>{error.email}</p>}
                {!formError && error.password && <p className="text" style={{ color: 'red' }}>{error.password}</p>}
                {!formError && error.username && <p className="text" style={{ color: 'red' }}>{error.username}</p>}
                {formError && <p className="text" style={{ color: 'red' }}>{formError}</p>}
            </form>
            <div className = "photo">
            </div>
        </div>
    );
}
