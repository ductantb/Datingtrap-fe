import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { use } from "react";
import { useNavigation } from "@react-navigation/native";
import { useProfile } from "../contexts/ProfileContext.js";

const MatchSreen = () => {
  const navigate = useNavigation();
  const { profile } = useProfile();
  return (
    <View className="h-full bg-blue-500 pt-20" style={{ opacity: 0.89 }}>
      <Text className="flex items-center justify-center px-12 pt-20 text-white text-5xl font-semibold">
        What's a match!!!
      </Text>
      <Text className="text-white text-center mt-5">
        You and Duc Tan have liked each other
      </Text>
      <View className="flex-row justify-evenly mt-5">
        <Image
          className="h-32 w-32 rounded-full"
          source={{ uri: profile.avatarUrl }}
        />
        <Image
          className="h-32 w-32 rounded-full"
          source={{
            uri: "https://i.pinimg.com/736x/42/7e/54/427e549668d89c519811fd77a9a6f7f9.jpg",
          }}
        />
      </View>
      <TouchableOpacity
        className="bg-white m-5 px-10 py-8 rounded-full mt-20 items-center justify-center"
        onPress={() => navigate.navigate("ChatList")}
      >
        <Text> Go to Chat</Text>
      </TouchableOpacity>
    </View>
  );
};

export default MatchSreen;
