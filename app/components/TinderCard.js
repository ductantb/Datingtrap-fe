import React, { useContext, useMemo } from "react";
import {
  View,
  Text,
  TouchableWithoutFeedback,
  Image,
  Dimensions,
} from "react-native";
import TinderCard from "react-tinder-card";
import { LinearGradient } from "expo-linear-gradient";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import { TinderCardsContext } from "../contexts/TinderCardsContext";

const { width, height } = Dimensions.get("window");

const TinderCardComponent = () => {
  const {
    cards,
    currentIndex,
    setCurrentIndex,
    setLastDirection,
    childRefs,
    swipeCard,
    restoreCard,
  } = useContext(TinderCardsContext);

  const navigation = useNavigation();

  // Lấy 5 cards ngẫu nhiên để hiển thị
  const randomFiveCards = useMemo(() => {
    if (!cards || cards.length === 0) return [];
    const shuffled = [...cards].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 5);
  }, [cards]);

  const canSwipe = currentIndex >= 0;

  // Gọi swipeCard từ context
  const swipe = async (dir) => {
    if (canSwipe && currentIndex < cards.length) {
      await swipeCard(dir);
    }
  };

  // Xử lý khi user swipe
  const swiped = (direction, name, index) => {
    const character = cards[index];
    if (direction === "right" && character?.id === 2) {
      navigation.navigate("MatchScreen");
    }
    setLastDirection(direction);
    setCurrentIndex(index - 1);
  };

  return (
    <View className="flex h-screen">
      <View className="flex-1 px-5 pt-5">
        {randomFiveCards.map((user, index) => (
          <TinderCard
            ref={childRefs[index]}
            key={user.id}
            onSwipe={(dir) => swiped(dir, user.username, index)}
            onCardLeftScreen={() => restoreCard(user.username, index)}
            preventSwipe={["up", "down"]}
            flickOnSwipe
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

              <View className="absolute bottom-10 w-full px-4">
                {/* Name + Age */}
                <View className="flex-row items-center mb-1">
                  <Text className="text-2xl text-white font-bold">
                    {user.username},{" "}
                  </Text>
                  <Text className="text-2xl text-white font-bold">
                    {user.age}
                  </Text>
                </View>

                {/* Job */}
                {user.job && (
                  <Text className="text-white text-base mb-1">
                    {user.job}
                  </Text>
                )}

                {/* Location tĩnh hoặc dynamic nếu có */}
                <View className="flex-row items-center mb-1">
                  <MaterialIcons name="location-on" size={18} color="white" />
                  <Text className="text-lg text-white ml-1">
                    {user.location || "Hanoi, Viet Nam"}
                  </Text>
                </View>

                {/* Bio */}
                {user.bio && (
                  <Text className="text-white text-sm mb-1 italic">
                    {user.bio}
                  </Text>
                )}

                {/* Hobbies */}
                {user.hobbies?.length > 0 && (
                  <View className="flex-row flex-wrap mt-1">
                    {user.hobbies.map((hobby) => (
                      <View
                        key={hobby.id}
                        className="bg-white px-3 py-1 rounded-full mr-2 mb-2"
                      >
                        <Text className="text-sm text-black">
                          {hobby.name}
                        </Text>
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
