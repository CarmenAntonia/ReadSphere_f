import React, { useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import "./Header.css";

const Header = () => {
    const { userName, avatarSvg } = useContext(UserContext);
    const navigate = useNavigate();

    return (
        <header className="header">
            <div className="header-background">
                <nav className="nav">
                    <h1 className="logo">Read Sphere</h1>
                    <ul className="nav-links">
                        <li><Link to="/home">Home</Link></li>
                        <li><Link to="/profile">My Profile</Link></li>
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
                        <span className="username">{userName}</span>
                    </div>
                </nav>
            </div>
        </header>
    );
};

export default Header;
