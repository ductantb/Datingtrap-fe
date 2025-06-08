import React, { useContext } from "react";
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
import { TinderCardsContext } from "../contexts/TinderCardsContext";

const { width, height } = Dimensions.get("window");

const TinderCardComponent = () => {
  const {
    cards,
    currentIndex,
    setCurrentIndex,
    setLastDirection,
    currentIndexRef,
    childRefs,
    swipeCard,
    restoreCard,
  } = useContext(TinderCardsContext);

  const swiped = (direction, name, index) => {
    setLastDirection(direction);
    setCurrentIndex(index - 1);
  };

  const outOfFrame = (name, idx) => {
    console.log(`${name} (${idx}) left the screen!`);
    if (currentIndexRef.current >= idx) {
      restoreCard(idx);
    }
  };

  return (
    <View className="flex h-screen">
      <View className="flex-1 px-5 pt-5">
        {cards.map((character, index) => (
          <TinderCard
            ref={childRefs[index]}
            key={character.id}
            onSwipe={(dir) => swiped(dir, character.name, index)}
            onCardLeftScreen={() => outOfFrame(character.name, index)}
            preventSwipe={["up", "down"]}
            flickOnSwipe={true}
            swipeRequirementType="position"
            swipeThreshold={width * 0.65}
          >
            <View className="absolute">
              <TouchableWithoutFeedback>
                <Image
                  source={{ uri: character.avatarUrl }}
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

              <View className="absolute bottom-10 justify-start w-full items-start pl-4">
                <View className="flex-row justify-center items-center">
                  <Text className="text-2xl text-white font-bold">
                    {character.name},{" "}
                  </Text>
                  <Text className="text-2xl text-white font-bold mr-2">
                    {character.age}
                  </Text>
                </View>

                <View className="flex-row justify-center items-center">
                  <Text className="text-lg text-white font-regular">Hanoi, </Text>
                  <Text className="text-lg text-white font-regular mr-2">
                    Viet Nam
                  </Text>
                </View>
              </View>
            </View>
          </TinderCard>
        ))}
      </View>

      <View className="flex-row justify-around items-end mb-24 px-8">
        <TouchableWithoutFeedback onPress={() => swipeCard("left")}>
          <View className="w-20 h-20 bg-red-300 rounded-full justify-center items-center shadow-md">
            <AntDesign name="dislike1" size={30} color="red" />
          </View>
        </TouchableWithoutFeedback>

        <TouchableWithoutFeedback onPress={() => console.log("View Info")}>
          <View className="w-20 h-20 bg-gray-300 rounded-full justify-center items-center shadow-md">
            <MaterialIcons name="chat" size={30} color="gray" />
          </View>
        </TouchableWithoutFeedback>

        <TouchableWithoutFeedback onPress={() => swipeCard("right")}>
          <View className="w-20 h-20 bg-green-300 rounded-full justify-center items-center shadow-md">
            <AntDesign name="heart" size={30} color="green" />
          </View>
        </TouchableWithoutFeedback>
      </View>
    </View>
  );
};

export default TinderCardComponent;
