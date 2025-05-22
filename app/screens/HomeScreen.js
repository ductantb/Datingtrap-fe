import {
  View,
  Text,
  Button,
  TouchableWithoutFeedback,
  Image,
  Dimensions,
} from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../components/Header";
import TinderCard from "react-tinder-card";
// import { CheckBadgeIcon } from "react-native-heroicons/solid";
import { LinearGradient } from "expo-linear-gradient";

var { width, height } = Dimensions.get("window");

const FData = [
  {
    fullName: "Huu Thai",
    job: "Developer",
    avatarUrl:
      "https://i.pinimg.com/736x/49/67/4c/49674ccc074f5b28829c058d293cad60.jpg",
    age: 20,
  },
  {
    fullName: "Duc Tan",
    job: "Developer",
    avatarUrl:
      "https://i.pinimg.com/736x/42/7e/54/427e549668d89c519811fd77a9a6f7f9.jpg",
    age: 20,
  },
  {
    fullName: "Quang Vu",
    job: "Developer",
    avatarUrl:
      "https://i.pinimg.com/736x/48/62/99/486299625e08a1e62ad9451dac4630ff.jpg",
    age: 20,
  },
];

const HomeScreen = () => {
  const navigation = useNavigation();

  const config = {
    velocityThreshold: 0.3,
    directionalOffsetThreshold: 80,
  };

  const onSwipe = (direction) => {
    console.log("You swiped: " + direction);
  };

  const onCardLeftScreen = (myIdentifier) => {
    console.log(myIdentifier + " left the screen");
  };
  return (
    <SafeAreaView>
      <Header />
      <TinderCard
        onSwipe={onSwipe}
        onCardLeftScreen={() => onCardLeftScreen("fooBar")}
        preventSwipe={["right", "left"]}
      >
        <View className="relative">
          <TouchableWithoutFeedback onPress={() => handleClick(item)}>
            <Image
              source={{
                uri: "https://i.pinimg.com/736x/49/67/4c/49674ccc074f5b28829c058d293cad60.jpg",
              }}
              style={{
                width: width * 0.8,
                height: height * 0.75,
              }}
              resizeMode="cover"
              className="rounded-3xl"
            />

            {/* <Text>Hello</Text> */}
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
              {/* <CheckBadgeIcon size={25} color={"#3B82F6"} /> */}
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
    </SafeAreaView>
  );
};

export default HomeScreen;
