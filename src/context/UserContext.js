import React, { createContext, useState, useEffect } from "react";
import { createAvatar } from "@dicebear/core";
import { openPeeps } from "@dicebear/collection";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [userName, setUserName] = useState("Guest");
    const [bio, setBio] = useState("");
    const [avatarSvg, setAvatarSvg] = useState(null);

    useEffect(() => {
        const seed = userName || "guest";
        const avatar = createAvatar(openPeeps, { seed }).toString();
        setAvatarSvg(avatar);
        sessionStorage.setItem("avatar", avatar);
    }, [userName]);

    useEffect(() => {
        const storedUser = sessionStorage.getItem("user");
        if (storedUser) {
            try {
                const parsed = JSON.parse(storedUser);
                if (parsed.name) setUserName(parsed.name);
                if (parsed.bio) setBio(parsed.bio);
            } catch (e) {
                console.error("Error parsing stored user", e);
            }
        }
    }, []);

    return (
        <UserContext.Provider value={{ userName, setUserName, bio, setBio, avatarSvg }}>
            {children}
        </UserContext.Provider>
    );
};
