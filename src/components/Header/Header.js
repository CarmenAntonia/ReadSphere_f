import React, { useContext } from "react";
import {useNavigate, Link, useLocation} from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import "./Header.css";
import {useLogin} from "../../context/LoginContext";

export default function Header() {
    const { userName, avatarSvg } = useContext(UserContext);
    const { setIsLoggedIn } = useLogin();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        sessionStorage.clear();
        setIsLoggedIn(false);
    };

    return (
        <header className="header">
            <div className="header-background">
                <nav className="nav">
                    <h1 className="logo">Read Sphere</h1>
                    <ul className="nav-links">
                        {location.pathname === "/profile" ? (
                            <>
                                <li><Link to="/home">Home</Link></li>
                                <li><Link onClick={handleLogout}>Log out</Link></li>
                            </>
                        ) : location.pathname === "/home" ? (
                            <>
                                <li><Link to="/profile">My Profile</Link></li>
                                <li><Link onClick={handleLogout}>Log out</Link></li>
                            </>
                        ) : (
                            <>
                                <li><Link to="/home">Home</Link></li>
                                <li><Link to="/profile">My Profile</Link></li>
                            </>
                        )}
                    </ul>
                    <div className="header-actions">
                        <div
                            className="avatar-container"
                            onClick={() => navigate("/profile")}
                            title="Profile"
                        >
                            {avatarSvg && (
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
