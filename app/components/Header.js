import { View, Text, TouchableOpacity, Image } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import { useNavigation } from "@react-navigation/native";

const Header = () => {
  const navigation = useNavigation();
  return (
    <View className="flex-row justify-between items-center px-5">
      <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
        <Image
          source={{
            uri: "https://i.pinimg.com/736x/94/11/fa/9411fa118390f83296e885f54d6d1e7b.jpg",
          }}
          className="w-10 h-10 rounded-full"
        />
      </TouchableOpacity>

      <TouchableOpacity>
        <Text className="text-3xl font-bold "> Dating trap </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Chat")}>
        <Ionicons name="chatbubbles-outline" size={30} color="black" />
      </TouchableOpacity>
    </View>
  );
};

export default Header;
