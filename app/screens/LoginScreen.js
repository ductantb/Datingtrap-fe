import { View, Text, Button, TextInput, Pressable } from "react-native";
import React from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useState } from "react";
import AntDesign from "@expo/vector-icons/AntDesign";

const LoginScreen = ({ navigation }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View className="flex-1">
      <View className="flex-1 flex-col items-center justify-center bg-blue-500 p6">
        <Ionicons
          className="shadow-lg mb-4"
          name="heart-circle"
          size={100}
          color="white"
        />
        <Text className="text-3xl font-bold text-white">Datingtrap</Text>
        <Text className="text-blue-100 mt-2 text-lg">
          Find your perfect match
        </Text>
      </View>
      <View className="flex-1 justify-between p-8 ">
        <View className="mb-4">
          <Text className="block text-gray-700 text-sm font-medium mb-1 ">
            Email
          </Text>
          <View className="relative">
            <MaterialIcons
              name="email"
              size={22}
              color="gray"
              className="absolute left-3 top-1/2 -translate-y-1/2"
            />
            <TextInput
              className="input-field pl-12 w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="your@email.com"
            />
          </View>
        </View>

        <View className="mb-4">
          <Text className="block text-gray-700 text-sm font-medium mb-1 ">
            Password
          </Text>
          <View className="relative">
            <MaterialIcons
              name="password"
              size={22}
              color="gray"
              className="absolute left-3 top-1/2 -translate-y-1/2"
            />
            <TextInput
              className="input-field pl-12 w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="••••••••"
              secureTextEntry={!showPassword}
            />
            <Pressable
              onPress={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <FontAwesome6
                name={showPassword ? "face-flushed" : "face-rolling-eyes"}
                size={20}
                color="gray"
              />
            </Pressable>
          </View>
        </View>
        <Pressable className="w-full bg-blue-500 rounded-lg mb-6 py-3 px-4">
          <Text className="text-white font-medium text-center">Login</Text>
        </Pressable>

        <View className="flex-row items-center justify-center mb-6">
          <View className="w-1/3 h-0.5 bg-gray-300"></View>
          <Text className="mx-4 text-gray-500 text-sm">OR</Text>
          <View className="w-1/3 h-0.5 bg-gray-300"></View>
        </View>

        <Pressable className="w-full flex-row items-center justify-center py-3 px-4 border border-gray-300 rounded-lg">
          <AntDesign name="google" size={24} color="red" />
          <Text className="text-gray-700 font-medium ml-2">
            Continue with Google
          </Text>
        </Pressable>
      </View>

      <View className="flex-row items-center justify-center mb-6">
        <Text className=" text-sm text-gray-600">Don't have an account? </Text>
        <Pressable onPress={() => navigation.navigate("SignUp")}>
          <Text className="text-blue-500 font-medium ">Sign Up</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default LoginScreen;