import {
  View,
  Text,
  Button,
  TouchableWithoutFeedback,
  Image,
  Dimensions,
} from "react-native";
import React from "react";
import TinderCard from "react-tinder-card";
import { LinearGradient } from "expo-linear-gradient";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

var { width, height } = Dimensions.get("window");

const TinderCardComponent = () => {
  const onSwipe = (direction) => {
    console.log("You swiped: " + direction);
  };

  const onCardLeftScreen = (myIdentifier) => {
    console.log(myIdentifier + " left the screen");
  };
  return (
    <View className="flex m-5">
      <TinderCard
        onSwipe={onSwipe}
        onCardLeftScreen={() => onCardLeftScreen("fooBar")}
        preventSwipe={["up", "down"]}
        flickOnSwipe={true}
        swipeRequirementType="position"
        swipeThreshold={width * 0.65}
        className="absolute"
      >
        <View className="relative">
          <TouchableWithoutFeedback onPress={() => handleClick(item)}>
            <Image
              source={{
                uri: "https://i.pinimg.com/736x/49/67/4c/49674ccc074f5b28829c058d293cad60.jpg",
              }}
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
                Thai
                {", "}
              </Text>
              <Text className="text-2xl text-white font-bold mr-2">22</Text>
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

      <View className="flex-row justify-around items-center mt-10 px-8">
        {/* Nút ❌ */}
        <TouchableWithoutFeedback onPress={() => console.log("Dislike")}>
          <View className="w-20 h-20 bg-red-300 rounded-full justify-center items-center shadow-md">
            <AntDesign name="dislike1" size={30} color="red" />
          </View>
        </TouchableWithoutFeedback>

        {/* Nút ℹ️ */}
        <TouchableWithoutFeedback onPress={() => console.log("View Info")}>
          <View className="w-20 h-20 bg-gray-300 rounded-full justify-center items-center shadow-md">
            <MaterialIcons name="chat" size={30} color="gray" />
          </View>
        </TouchableWithoutFeedback>

        {/* Nút ✅ */}
        <TouchableWithoutFeedback onPress={() => console.log("Like")}>
          <View className="w-20 h-20 bg-green-300 rounded-full justify-center items-center shadow-md">
            <AntDesign name="heart" size={30} color="green" />
          </View>
        </TouchableWithoutFeedback>
      </View>
    </View>
  );
};

export default TinderCardComponent;
