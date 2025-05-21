import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
  Alert,
  Button,
} from "react-native";
import React, { useState, useEffect } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import AntDesign from "@expo/vector-icons/AntDesign";
import useAuth from "../hooks/useAuth";
import { useNavigation } from "@react-navigation/native";

const LoginScreen = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);

  const {
    error,
    loading,
    registerWithEmail,
    loginWithEmail,
    loginWithGoogle,
    clearError,
  } = useAuth();
  const navigation = useNavigation();

  useEffect(() => {
    if (error) {
      Alert.alert("Authentication Error", error);
      clearError();
    }
  }, [error]);

  const toggleAuthMode = () => {
    setIsSignUp(!isSignUp);
    setConfirmPassword("");
  };

  const handleAuthentication = () => {
    if (!email || !password || (isSignUp && !confirmPassword)) {
      Alert.alert("Missing Fields", "Please fill in all fields");
      return;
    }

    if (isSignUp && password !== confirmPassword) {
      Alert.alert("Password Error", "Passwords do not match");
      return;
    }

    if (isSignUp) {
      registerWithEmail(email, password);
    } else {
      loginWithEmail(email, password);
    }
  };

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
      <View className="flex-1 justify-between p-8">
        {/* Email */}
        <View className="mb-4">
          <Text className="block text-gray-700 text-sm font-medium mb-1">
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
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>
        </View>

        {/* Password */}
        <View className="mb-4">
          <Text className="block text-gray-700 text-sm font-medium mb-1">
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
              value={password}
              onChangeText={setPassword}
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

        {/* Confirm Password */}
        {isSignUp && (
          <View className="mb-4">
            <Text className="block text-gray-700 text-sm font-medium mb-1">
              Confirm Password
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
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
            </View>
          </View>
        )}

        {/* Submit Button */}
        <Pressable
          className="w-full bg-blue-500 rounded-lg mb-6 py-3 px-4"
          onPress={handleAuthentication}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-medium text-center">
              {isSignUp ? "Sign Up" : "Login"}
            </Text>
          )}
        </Pressable>

        {/* OR separator */}
        <View className="flex-row items-center justify-center mb-6">
          <View className="w-1/3 h-0.5 bg-gray-300"></View>
          <Text className="mx-4 text-gray-500 text-sm">OR</Text>
          <View className="w-1/3 h-0.5 bg-gray-300"></View>
        </View>

        {/* Google Button */}
        <Pressable
          className="w-full flex-row items-center justify-center py-3 px-4 border border-gray-300 rounded-lg"
          onPress={loginWithGoogle}
          disabled={loading}
        >
          <AntDesign name="google" size={24} color="red" />
          <Text className="text-gray-700 font-medium ml-2">
            {isSignUp ? "Sign Up with Google" : "Login with Google"}
          </Text>
        </Pressable>
      </View>

      {/* Toggle Login / Sign Up */}
      <View className="flex-row items-center justify-center mb-6">
        <Text className="text-sm text-gray-600">
          {isSignUp ? "Already have an account? " : "Don't have an account? "}
        </Text>
        <Pressable onPress={toggleAuthMode}>
          <Text className="text-blue-500 font-medium">
            {isSignUp ? "Login" : "Sign Up"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export default LoginScreen;
