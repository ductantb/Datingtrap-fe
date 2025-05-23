import React, { createContext, useState, useContext } from "react";

const defaultProfile = {
  username: "Bobby",
  gender: "male",
  job: "Developer",
  avatarUrl:
    "https://i.pinimg.com/736x/49/67/4c/49674ccc074f5b28829c058d293cad60.jpg",
  age: 20,
  hobbies: [
    { id: 1, name: "Hiking" },
    { id: 3, name: "Photography" },
    { id: 5, name: "Reading" },
  ],
  bio: "I am a developer and I love to travel",
  preference: {
    interestedGender: "female",
    maxDistance: 50,
    minAge: 20,
    maxAge: 30,
    datingPurpose: "serious",
  },
};

const ProfileContext = createContext();

export const useProfile = () => useContext(ProfileContext);

export const ProfileProvider = ({ children }) => {
  const [profile, setProfile] = useState(defaultProfile);

  const updateProfile = (newData) => {
    setProfile((prev) => ({ ...prev, ...newData }));
  };

  return (
    <ProfileContext.Provider value={{ profile, updateProfile }}>
      {children}
    </ProfileContext.Provider>
  );
};
