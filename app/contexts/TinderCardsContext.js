import React, { createContext, useState, useRef, useMemo } from 'react';
import { Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

// Dữ liệu hardcode
const defaultCards = [
  {
    id: 1,
    name: "Huu Thai",
    job: "Developer",
    avatarUrl:
      "https://i.pinimg.com/736x/49/67/4c/49674ccc074f5b28829c058d293cad60.jpg",
    age: 20,
  },
  {
    id: 2,
    name: "Duc Tan",
    job: "Developer",
    avatarUrl:
      "https://i.pinimg.com/736x/42/7e/54/427e549668d89c519811fd77a9a6f7f9.jpg",
    age: 20,
  },
  {
    id: 3,
    name: "Quang Vu",
    job: "Developer",
    avatarUrl:
      "https://i.pinimg.com/736x/48/62/99/486299625e08a1e62ad9451dac4630ff.jpg",
    age: 20,
  },
  {
    id: 4,
    name: "Hung Vu",
    job: "Developer",
    avatarUrl:
      "https://i.pinimg.com/736x/dd/16/a1/dd16a118adec92cbbcdaeee66e8e2677.jpg",
    age: 20,
  },
  {
    id: 5,
    name: "Oke Vu",
    job: "Developer",
    avatarUrl:
      "https://i.pinimg.com/736x/b9/92/9f/b9929f0dc9ea56cf80894c704faf4811.jpg",
    age: 20,
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
