import { View, Text, Button } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../components/Header";
// import Swiper from "react-native-deck-swiper";

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

  return (
    <SafeAreaView>
      <Header />

      {/* Cards */}
      {/* <Swiper
        cards={FData}
        renderCard={(card) => {
          <View>
            <Text>{card.fullName}</Text>
          </View>;
        }}
      /> */}
    </SafeAreaView>
  );
};

export default HomeScreen;
