import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom'; 
import { createAvatar } from '@dicebear/core';
import { adventurer } from '@dicebear/collection';
import './Header.css'; 

const Header = () => {
    const [darkMode, setDarkMode] = useState(() => {
        const storedTheme = localStorage.getItem('theme');
        if (storedTheme) {
            return storedTheme === 'dark';
        }
        localStorage.setItem('theme', 'light');
        return false;
    });

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userName, setUserName] = useState('user');
    const [profilePicture, setProfilePicture] = useState(null);
    const [avatarSvg, setAvatarSvg] = useState(null);
    const navigate = useNavigate();
    const [shrinkHeader, setShrinkHeader] = useState(false);

    const backend_url = process.env.REACT_APP_BACKEND_URL;

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        const userId = sessionStorage.getItem('userId');

        console.log('token:', token);
        console.log('userId:', userId);

        if (token || userId) {
            setIsLoggedIn(true);
            fetchUserName();
            fetchProfilePicture();
        } else {
            setIsLoggedIn(false);
            setUserName('user');
            setProfilePicture(null);
        }
    }, []);

    const fetchUserName = () => {
        fetch(`${backend_url}/userName`, {
            method: 'GET',
            credentials: 'include',
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.userName) {
                    setUserName(data.userName);
                }
            })
            .catch((error) => console.error('Error fetching user name:', error));
    };

    const fetchProfilePicture = () => {
    //     fetch(`${backend_url}/profilePicture`, {
    //         method: 'GET',
    //         credentials: 'include',
    //     })
    //         .then((response) => response.json())
    //         .then((data) => {
    //             if (data.profilePicture) {
    //                 setProfilePicture(data.profilePicture);
    //             }
    //         })
    //         //.catch((error) => console.error('Error fetching profile picture:', error));
     };

    useEffect(() => {
    if (darkMode) {
        document.body.classList.add('dark');
        document.body.classList.remove('light');
    } else {
        document.body.classList.add('light');
        document.body.classList.remove('dark');
    }
}, [darkMode]);

    useEffect(() => {
        if (!profilePicture) {
            const seed = userName || 'guest';
            const avatar = createAvatar(adventurer, { seed }).toString();
            setAvatarSvg(avatar);
        }
    }, [profilePicture, userName]);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setShrinkHeader(true);
            } else {
                setShrinkHeader(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleTheme = () => {
        setDarkMode((prevMode) => !prevMode);
        const newTheme = !darkMode ? 'dark' : 'light';
        localStorage.setItem('theme', newTheme);
    };

    const handleAvatarClick = () => {
        if (isLoggedIn) {
            navigate('/profile');
        }
    };

    return (
        <header className={`header ${shrinkHeader ? 'shrink' : ''}`}>
            <div className="header-background">
                <nav className="nav">
                    <h1 className="logo">Read Sphere</h1>
                    <ul className="nav-links">
                        <li><Link to="/home">Home</Link></li>
                        {isLoggedIn ? (
                            <li><Link to="/profile">My Profile</Link></li>
                        ) : (
                            <li><Link to="/login">Login</Link></li>
                        )}
                    </ul>
                    <div className="header-actions">
                        <button
                            className={`theme-toggle ${darkMode ? 'dark' : 'light'}`}
                            onClick={toggleTheme}
                        >
                            <span className="theme-toggle-icon">
                                {darkMode ? '🌙' : '☀️'}
                            </span>
                        </button>
                        <div
                            className="avatar-container"
                            onClick={handleAvatarClick}
                            title={userName ? `Hello, ${userName}` : 'User'}
                        >
                            {profilePicture ? (
                                <img
                                    src={profilePicture}
                                    alt="Profile"
                                    className="profile-picture"
                                />
                            ) : (
                                <div
                                    className="avatar"
                                    dangerouslySetInnerHTML={{ __html: avatarSvg }}
                                />
                            )}
                        </div>
                    </div>
                </nav>
            </div>
        </header>
    );
};

export default Header;
