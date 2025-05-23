import {
  View,
  Text,
  Button,
  TouchableWithoutFeedback,
  Image,
  Dimensions,
} from "react-native";
import React, { useMemo, useRef } from "react";
import TinderCard from "react-tinder-card";
import { LinearGradient } from "expo-linear-gradient";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useState } from "react";

var { width, height } = Dimensions.get("window");

const db = [
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

const TinderCardComponent = () => {
  const [currentIndex, setCurrentIndex] = useState(db.length - 1);
  const [lastDirection, setLastDirection] = useState();
  // used for outOfFrame closure
  const currentIndexRef = useRef(currentIndex);

  const childRefs = useMemo(
    () =>
      Array(db.length)
        .fill(0)
        .map((i) => React.createRef()),
    []
  );

  const updateCurrentIndex = (val) => {
    setCurrentIndex(val);
    currentIndexRef.current = val;
  };

  const canSwipe = currentIndex >= 0;

  const swiped = (direction, nameToDelete, index) => {
    setLastDirection(direction);
    updateCurrentIndex(index - 1);
  };

  const outOfFrame = (name, idx) => {
    console.log(`${name} (${idx}) left the screen!`, currentIndexRef.current);

    currentIndexRef.current >= idx && childRefs[idx].current.restoreCard();
  };

  const swipe = async (dir) => {
    if (canSwipe && currentIndex < db.length) {
      await childRefs[currentIndex].current.swipe(dir);
    }
  };

  return (
    <View className="flex-1 px-5 pt-5 ">
      {db.map((character, index) => (
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
              <View className="flex-row justify-center items-center ">
                <Text className="text-2xl text-white font-bold">
                  {character.name}
                  {", "}
                </Text>
                <Text className="text-2xl text-white font-bold mr-2">
                  {character.age}
                </Text>
              </View>

              {/* Location */}
              <View className="flex-row justify-center items-center ">
                <Text className="text-lg text-white font-regular">
                  Hanoi
                  {", "}
                </Text>
                <Text className="text-lg text-white font-regular mr-2">
                  Viet Nam
                </Text>
              </View>
            </View>
          </View>
        </TinderCard>
      ))}

      <View className="flex-row justify-around items-end mt-10 px-8 ">
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
