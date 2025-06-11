import React, { createContext, useState, useContext, useEffect } from "react";
import auth from '@react-native-firebase/auth';

const API_BASE = "https://api.datingtrap.com";

const ProfileContext = createContext();
export const useProfile = () => useContext(ProfileContext);

export const ProfileProvider = ({ children }) => {
  const [profile, setProfile] = useState(null); // ban đầu là null
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userId) => {
    try {
      const token = await auth().currentUser.getIdToken();
      const res = await fetch(`${API_BASE}/api/profiles/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setProfile(data);
    } catch (err) {
      console.error("Lỗi khi fetch profile:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (userId, updatedData) => {
    try {
      const token = await auth().currentUser.getIdToken();
      const res = await fetch(`${API_BASE}/api/profiles/${userId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });
      const data = await res.json();
      setProfile(data);
    } catch (err) {
      console.error("Lỗi khi update profile:", err);
    }
  };

  return (
    <ProfileContext.Provider value={{ profile, fetchProfile, updateProfile, loading }}>
      {children}
    </ProfileContext.Provider>
  );
};
