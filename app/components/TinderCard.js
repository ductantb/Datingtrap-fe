import {
  View,
  Text,
  TouchableWithoutFeedback,
  Image,
  Dimensions,
} from "react-native";
import React, { useContext } from "react";
import { useMemo } from "react";
import TinderCard from "react-tinder-card";
import { LinearGradient } from "expo-linear-gradient";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { TinderCardsContext } from "../contexts/TinderCardsContext";

const { width, height } = Dimensions.get("window");

const TinderCardComponent = () => {
  const {
    cards,
    currentIndex,
    setCurrentIndex,
    lastDirection,
    setLastDirection,
    currentIndexRef,
    childRefs,
    swipeCard,
    restoreCard,
  } = useContext(TinderCardsContext);

  const randomFiveCards = useMemo(() => {
    if (!cards || cards.length === 0) return [];

    // Copy và xáo trộn mảng cards
    const shuffled = [...cards].sort(() => 0.5 - Math.random());

    // Lấy 5 phần tử đầu
    return shuffled.slice(0, 5);
  }, [cards]);

  const canSwipe = currentIndex >= 0;

  const swipe = async (dir) => {
    if (canSwipe && currentIndex < cards.length) {
      await swipeCard(dir);
    }
  };

  return (
    <View className="flex h-screen">
      <View className="flex-1 px-5 pt-5">
        {randomFiveCards.map((user, index) => (
          <TinderCard
            ref={childRefs[index]}
            key={user.id}
            onSwipe={(dir) => {
              setLastDirection(dir);
              setCurrentIndex(index - 1);
            }}
            onCardLeftScreen={() => restoreCard(user.username, index)}
            preventSwipe={["up", "down"]}
            flickOnSwipe={true}
            swipeRequirementType="position"
            swipeThreshold={width * 0.65}
          >
            <View className="absolute">
              <TouchableWithoutFeedback>
                <Image
                  source={{ uri: user.avatarUrl }}
                  style={{
                    width: width * 0.91,
                    height: height * 0.75,
                  }}
                  resizeMode="cover"
                  className="rounded-3xl"
                />
              </TouchableWithoutFeedback>

              <LinearGradient
                colors={["transparent", "rgba(0,0,0,0.9)"]}
                style={{
                  position: "absolute",
                  bottom: 0,
                  width: "100%",
                  height: "100%",
                  borderBottomLeftRadius: 24,
                  borderBottomRightRadius: 24,
                }}
                start={{ x: 0.5, y: 0.5 }}
                end={{ x: 0.5, y: 1 }}
              />

              <View className="absolute bottom-10 justify-start w-full items-start pl-4 pr-4">
                {/* Name + Age */}
                <View className="flex-row items-center mb-1">
                  <Text className="text-2xl text-white font-bold">
                    {user.username},{" "}
                  </Text>
                  <Text className="text-2xl text-white font-bold">{user.age}</Text>
                </View>

                {/* Job */}
                <Text className="text-white text-base mb-1">{user.job}</Text>

                {/* Bio */}
                {user.bio ? (
                  <Text className="text-white text-sm mb-1 italic">
                    {user.bio}
                  </Text>
                ) : null}

                {/* Hobbies */}
                {user.hobbies && user.hobbies.length > 0 && (
                  <View className="flex-row flex-wrap mt-1">
                    {user.hobbies.map((hobby) => (
                      <View
                        key={hobby.id}
                        className="bg-white px-3 py-1 rounded-full mr-2 mb-2"
                      >
                        <Text className="text-sm text-black">{hobby.name}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            </View>
          </TinderCard>
        ))}
      </View>

      {/* Action Buttons */}
      <View className="flex-row justify-around items-end mb-24 px-8">
        <TouchableWithoutFeedback onPress={() => swipe("left")}>
          <View className="w-20 h-20 bg-red-300 rounded-full justify-center items-center shadow-md">
            <AntDesign name="dislike1" size={30} color="red" />
          </View>
        </TouchableWithoutFeedback>

        <TouchableWithoutFeedback onPress={() => console.log("View Info")}>
          <View className="w-20 h-20 bg-gray-300 rounded-full justify-center items-center shadow-md">
            <MaterialIcons name="chat" size={30} color="gray" />
          </View>
        </TouchableWithoutFeedback>

        <TouchableWithoutFeedback onPress={() => swipe("right")}>
          <View className="w-20 h-20 bg-green-300 rounded-full justify-center items-center shadow-md">
            <AntDesign name="heart" size={30} color="green" />
          </View>
        </TouchableWithoutFeedback>
      </View>
    </View>
  );
};

export default TinderCardComponent;
