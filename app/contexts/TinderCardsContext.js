import React, { createContext, useState, useRef, useMemo } from 'react';
import { Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

// Dữ liệu hardcode
const defaultCards = [
  {
    id: 1,
    username: "Huu Thai",
    gender: "male",
    job: "Developer",
    avatarUrl: "https://i.pinimg.com/736x/49/67/4c/49674ccc074f5b28829c058d293cad60.jpg",
    age: 24,
    hobbies: [{ id: 1, name: "Hiking" }, { id: 3, name: "Photography" }, { id: 5, name: "Reading" }],
    bio: "Love exploring new technologies and going on hikes.",
    preference: { interestedGender: "female", maxDistance: 30, minAge: 20, maxAge: 28, datingPurpose: "serious" }
  },
  {
    id: 2,
    username: "Duc Tan",
    gender: "male",
    job: "Designer",
    avatarUrl: "https://i.pinimg.com/736x/42/7e/54/427e549668d89c519811fd77a9a6f7f9.jpg",
    age: 22,
    hobbies: [{ id: 2, name: "Drawing" }, { id: 6, name: "Gaming" }, { id: 9, name: "Traveling" }],
    bio: "Creative soul with a passion for art and adventures.",
    preference: { interestedGender: "female", maxDistance: 20, minAge: 18, maxAge: 26, datingPurpose: "fun" }
  },
  {
    id: 3,
    username: "Quang Vu",
    gender: "male",
    job: "Product Manager",
    avatarUrl: "https://i.pinimg.com/736x/48/62/99/486299625e08a1e62ad9451dac4630ff.jpg",
    age: 27,
    hobbies: [{ id: 4, name: "Cooking" }, { id: 5, name: "Reading" }, { id: 8, name: "Running" }],
    bio: "Always looking for ways to grow and learn new things.",
    preference: { interestedGender: "female", maxDistance: 40, minAge: 22, maxAge: 32, datingPurpose: "serious" }
  },
  {
    id: 4,
    username: "Hung Vu",
    gender: "male",
    job: "Engineer",
    avatarUrl: "https://i.pinimg.com/736x/dd/16/a1/dd16a118adec92cbbcdaeee66e8e2677.jpg",
    age: 25,
    hobbies: [{ id: 7, name: "Fishing" }, { id: 3, name: "Photography" }, { id: 6, name: "Gaming" }],
    bio: "Engineer by profession, traveler by heart.",
    preference: { interestedGender: "female", maxDistance: 50, minAge: 23, maxAge: 30, datingPurpose: "casual" }
  },
  {
    id: 5,
    username: "Oke Vu",
    gender: "male",
    job: "Musician",
    avatarUrl: "https://i.pinimg.com/736x/b9/92/9f/b9929f0dc9ea56cf80894c704faf4811.jpg",
    age: 21,
    hobbies: [{ id: 10, name: "Music" }, { id: 2, name: "Drawing" }, { id: 11, name: "Skating" }],
    bio: "Music is life. Let's vibe and connect!",
    preference: { interestedGender: "female", maxDistance: 25, minAge: 19, maxAge: 24, datingPurpose: "fun" }
  },
  {
    id: 6,
    username: "Linh Ha",
    gender: "female",
    job: "Writer",
    avatarUrl: "https://i.pinimg.com/736x/7e/14/9b/7e149bc61b4f50758026a04b93f0d608.jpg",
    age: 26,
    hobbies: [{ id: 5, name: "Reading" }, { id: 12, name: "Yoga" }, { id: 3, name: "Photography" }],
    bio: "Words are my world. Looking for someone to write stories with.",
    preference: { interestedGender: "male", maxDistance: 40, minAge: 25, maxAge: 35, datingPurpose: "serious" }
  },
  {
    id: 7,
    username: "Mai Chi",
    gender: "female",
    job: "Teacher",
    avatarUrl: "https://i.pinimg.com/736x/fa/14/1b/fa141bf7de786ef29087264c430f90c8.jpg",
    age: 24,
    hobbies: [{ id: 13, name: "Dancing" }, { id: 5, name: "Reading" }, { id: 8, name: "Running" }],
    bio: "Teaching is my passion. Let's learn from each other!",
    preference: { interestedGender: "male", maxDistance: 35, minAge: 23, maxAge: 30, datingPurpose: "fun" }
  },
  {
    id: 8,
    username: "Thao Nguyen",
    gender: "female",
    job: "Photographer",
    avatarUrl: "https://i.pinimg.com/736x/81/82/f5/8182f5c89c60fc0311e5014118fa6444.jpg",
    age: 23,
    hobbies: [{ id: 3, name: "Photography" }, { id: 14, name: "Travel Blogging" }, { id: 2, name: "Drawing" }],
    bio: "I capture moments and seek meaningful connections.",
    preference: { interestedGender: "male", maxDistance: 30, minAge: 22, maxAge: 28, datingPurpose: "serious" }
  },
  {
    id: 9,
    username: "Long Tran",
    gender: "male",
    job: "Barista",
    avatarUrl: "https://i.pinimg.com/736x/b7/ec/b0/b7ecb0208967059d377b3a1fe675b3f8.jpg",
    age: 28,
    hobbies: [{ id: 15, name: "Coffee Brewing" }, { id: 4, name: "Cooking" }, { id: 9, name: "Traveling" }],
    bio: "Good coffee, great conversations, and genuine vibes.",
    preference: { interestedGender: "female", maxDistance: 20, minAge: 24, maxAge: 29, datingPurpose: "casual" }
  },
  {
    id: 10,
    username: "Minh Anh",
    gender: "female",
    job: "Software Engineer",
    avatarUrl: "https://i.pinimg.com/736x/dd/dc/89/dddc89782fbc138e340ecc3a5acf133d.jpg",
    age: 25,
    hobbies: [{ id: 6, name: "Gaming" }, { id: 1, name: "Hiking" }, { id: 5, name: "Reading" }],
    bio: "Techie girl with a love for the outdoors.",
    preference: { interestedGender: "male", maxDistance: 30, minAge: 25, maxAge: 33, datingPurpose: "serious" }
  },
  {
    id: 11,
    username: "Tuan Anh",
    gender: "male",
    job: "Data Analyst",
    avatarUrl: "https://i.pinimg.com/736x/f2/76/40/f27640090772e59fd59ec9d584187d47.jpg",
    age: 29,
    hobbies: [{ id: 16, name: "Chess" }, { id: 5, name: "Reading" }, { id: 6, name: "Gaming" }],
    bio: "Data nerd, but fun on weekends!",
    preference: { interestedGender: "female", maxDistance: 25, minAge: 24, maxAge: 30, datingPurpose: "fun" }
  },
  {
    id: 12,
    username: "Trang Le",
    gender: "female",
    job: "Nurse",
    avatarUrl: "https://i.pinimg.com/736x/c0/a2/7f/c0a27f9ab67ecab1f1c47b593d3f6db2.jpg",
    age: 26,
    hobbies: [{ id: 12, name: "Yoga" }, { id: 4, name: "Cooking" }, { id: 5, name: "Reading" }],
    bio: "Caring by nature. Looking for someone who values empathy.",
    preference: { interestedGender: "male", maxDistance: 50, minAge: 26, maxAge: 34, datingPurpose: "serious" }
  },
  {
    id: 13,
    username: "Bao Nam",
    gender: "male",
    job: "Chef",
    avatarUrl: "https://i.pinimg.com/736x/b9/c2/fc/b9c2fc5faa46fe668a26b7d11f716044.jpg",
    age: 31,
    hobbies: [{ id: 4, name: "Cooking" }, { id: 17, name: "Biking" }, { id: 8, name: "Running" }],
    bio: "Cooking is my love language.",
    preference: { interestedGender: "female", maxDistance: 30, minAge: 25, maxAge: 33, datingPurpose: "serious" }
  },
  {
    id: 14,
    username: "Kim Nhi",
    gender: "female",
    job: "Architect",
    avatarUrl: "https://i.pinimg.com/736x/c6/f8/49/c6f84979a86fedf8546b79c35e59aa2c.jpg",
    age: 27,
    hobbies: [{ id: 2, name: "Drawing" }, { id: 13, name: "Dancing" }, { id: 1, name: "Hiking" }],
    bio: "Designing spaces and chasing dreams.",
    preference: { interestedGender: "male", maxDistance: 30, minAge: 27, maxAge: 35, datingPurpose: "serious" }
  },
  {
    id: 15,
    username: "Son Le",
    gender: "male",
    job: "Freelancer",
    avatarUrl: "https://i.pinimg.com/736x/17/1b/91/171b9107638861c38ea5fdf3a00d25ad.jpg",
    age: 30,
    hobbies: [{ id: 18, name: "Meditation" }, { id: 15, name: "Coffee Brewing" }, { id: 9, name: "Traveling" }],
    bio: "Flexible life, focused mind.",
    preference: { interestedGender: "female", maxDistance: 35, minAge: 25, maxAge: 32, datingPurpose: "casual" }
  },
];

export const TinderCardsContext = createContext();

export const TinderCardsProvider = ({ children }) => {
  const [cards, setCards] = useState(defaultCards);
  const [currentIndex, setCurrentIndex] = useState(defaultCards.length - 1);
  const [lastDirection, setLastDirection] = useState(null);
  const currentIndexRef = useRef(currentIndex);

  const childRefs = useMemo(
    () =>
      Array(defaultCards.length)
        .fill(0)
        .map(() => React.createRef()),
    []
  );

  const updateCurrentIndex = (val) => {
    setCurrentIndex(val);
    currentIndexRef.current = val;
  };

  const swipeCard = async (dir) => {
    if (currentIndex >= 0 && currentIndex < cards.length) {
      await childRefs[currentIndex].current?.swipe(dir);
    }
  };

  const restoreCard = (idx) => {
    childRefs[idx]?.current?.restoreCard();
  };

  return (
    <TinderCardsContext.Provider
      value={{
        cards,
        setCards,
        currentIndex,
        setCurrentIndex: updateCurrentIndex,
        lastDirection,
        setLastDirection,
        currentIndexRef,
        childRefs,
        swipeCard,
        restoreCard,
      }}
    >
      {children}
    </TinderCardsContext.Provider>
  );
};
