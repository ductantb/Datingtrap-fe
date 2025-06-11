import React, { createContext, useState, useRef, useMemo, useEffect } from 'react';
import auth from '@react-native-firebase/auth';

const TinderCardsContext = createContext();
export const TinderCardsProvider = ({ children }) => {
  const [cards, setCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lastDirection, setLastDirection] = useState(null);
  const currentIndexRef = useRef(currentIndex);

  const fetchCards = async (userId) => {
    try {
      const token = await auth().currentUser.getIdToken();
      const res = await fetch(
        `https://api.datingtrap.com/api/swipes/recommendations?userId=${userId}&page=0&size=10`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      setCards(data.content);
      setCurrentIndex(data.content.length - 1);
    } catch (err) {
      console.error("Lỗi khi fetch cards:", err);
    }
  };

  useEffect(() => {
    // Gọi fetchCards khi context mount
    const init = async () => {
      const user = auth().currentUser;
      if (user) {
        const token = await user.getIdToken(true);
        // Giả sử userId bạn lấy từ context hoặc backend sau login
        const userId = 1; // TODO: Thay bằng user thực tế
        await fetchCards(userId);
      }
    };
    init();
  }, []);

  const childRefs = useMemo(
    () => Array(cards.length).fill(0).map(() => React.createRef()),
    [cards.length]
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
