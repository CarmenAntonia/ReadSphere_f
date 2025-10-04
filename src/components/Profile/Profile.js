import React, { useState, useContext } from "react";
import { Pencil } from "lucide-react";
import { UserContext } from "../../context/UserContext";
import "./Profile.css";
import UserShelves from "../UserShelves/UserShelves";

const Profile = () => {
    const { userName, setUserName, bio, setBio, avatarSvg } = useContext(UserContext);
    const [isEditing, setIsEditing] = useState(false);

    const userId = Number(sessionStorage.getItem("userId"));
    const backend_url = process.env.REACT_APP_BACKEND_URL;

    const handleSave = async () => {
        try {
            const storedUser = JSON.parse(sessionStorage.getItem("user")) || {};
            if (bio !== storedUser.bio) {
                const res = await fetch(`${backend_url}/user/userBio/${userId}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: bio,
                });
                if (res.ok) {
                    const updatedUser = await res.json();
                    setBio(updatedUser.bio);
                    storedUser.bio = updatedUser.bio;
                }
            }

            if (userName !== storedUser.name) {
                const res = await fetch(`${backend_url}/user/userName/${userId}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: userName,
                });
                if (res.ok) {
                    const updatedUser = await res.json();
                    setUserName(updatedUser.name);
                    storedUser.name = updatedUser.name;
                }
            }

            sessionStorage.setItem("user", JSON.stringify(storedUser));
        } catch (err) {
            console.error("Error saving user data:", err);
        }

        setIsEditing(false);
    };

    return (
        <div className="profile-container">
            <div className="profile-card">
                <div className="profile-avatar">
                    {avatarSvg ? (
                        <div
                            className="avatar-img"
                            dangerouslySetInnerHTML={{ __html: avatarSvg }}
                        />
                    ) : (
                        <div className="avatar-placeholder">?</div>
                    )}
                </div>

                <div className="profile-name">
                    {isEditing ? (
                        <input
                            type="text"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            className="name-input"
                        />
                    ) : (
                        <h2>
                            {userName}
                            <button
                                onClick={() => setIsEditing(true)}
                                className="edit-icon-btn"
                                title="Edit Name"
                            >
                                <Pencil size={18} />
                            </button>
                        </h2>
                    )}
                </div>

                <div className="profile-bio">
                    {isEditing ? (
                        <div>
                <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows="4"
                    className="bio-textarea"
                    placeholder="Write something about yourself..."
                />
                            <div className="button-group">
                                <button onClick={handleSave} className="btn save-btn">Save</button>
                                <button onClick={() => setIsEditing(false)} className="btn cancel-btn">Cancel</button>
                            </div>
                        </div>
                    ) : (
                        <div className="bio-box">
                            <p>{bio || "No bio yet. Add one!"}</p>
                        </div>
                    )}
                </div>
            </div>
            <div className="shelves-card">
                <UserShelves/>
            </div>
        </div>
    );
};

export default Profile;
