import { View, Text, TouchableOpacity, Image } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import { useNavigation } from "@react-navigation/native";

const Header = () => {
  const unreadCount = 5;
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

      <TouchableOpacity onPress={() => navigation.navigate("Discover")}>
        <Ionicons name="star-outline" size={30} color="black" />
      </TouchableOpacity>

      <TouchableOpacity>
        <Text className="text-3xl font-bold "> Dating trap </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("ChatList")}>
        <Ionicons name="chatbubbles-outline" size={30} color="black" />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Notifications")}>
      <View>
        <Ionicons name="notifications-outline" size={30} color="black" />
          {unreadCount > 0 && (
      <View className="absolute -top-2 -right-2 bg-red-500 rounded-full w-5 h-5 items-center justify-center">
        <Text className="text-white text-xs">{unreadCount}</Text>
      </View>
    )}
  </View>
  </TouchableOpacity>
    </View>
  );
};

export default Header;
