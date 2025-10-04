import React, { createContext, useState, useEffect } from "react";
import { createAvatar } from "@dicebear/core";
import { openPeeps } from "@dicebear/collection";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [userName, setUserName] = useState("Guest");
    const [bio, setBio] = useState("");
    const [avatarSvg, setAvatarSvg] = useState(null);

    const backend_url = process.env.REACT_APP_BACKEND_URL;

    useEffect(() => {
        const seed = userName || "guest";
        const avatar = createAvatar(openPeeps, { seed }).toString();
        setAvatarSvg(avatar);
        sessionStorage.setItem("avatar", avatar);
    }, [userName]);

    useEffect(() => {
        const userId = Number(sessionStorage.getItem("userId"));
        if (!userId) return;

        const fetchUser = async () => {
            try {
                const res = await fetch(`${backend_url}/user/${userId}`, {
                    method: "GET",
                    credentials: "include",
                });
                if (!res.ok) throw new Error("User not found");
                const data = await res.json();

                if (data.name) setUserName(data.name);
                if (data.bio) setBio(data.bio);

                sessionStorage.setItem("user", JSON.stringify(data));
            } catch (err) {
                console.error("Error fetching user:", err);
            }
        };

        fetchUser();
    }, [backend_url]);

    return (
        <UserContext.Provider value={{ userName, setUserName, bio, setBio, avatarSvg }}>
            {children}
        </UserContext.Provider>
    );
};
