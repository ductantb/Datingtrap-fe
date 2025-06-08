import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./app/screens/HomeScreen";
import ChatScreen from "./app/screens/ChatScreen";
import LoginScreen from "./app/screens/LoginScreen";
import SignUpScreen from "./app/screens/SignUpScreen";
import ChatListScreen from "./app/screens/ChatListScreen";
import ProfileScreen from "./app/screens/ProfileScreen";
import MatchSreen from "./app/screens/MatchSreen.js";
import EditProfileScreen from "./app/screens/EditProfileScreen";
import DiscoverScreen from "./app/screens/DiscoverScreen.js";

import useAuth from "./app/hooks/useAuth";

import NotificationScreen from "./app/screens/NotificationScreen.js";

const Stack = createNativeStackNavigator();

const StackNavigator = () => {
  const { user } = useAuth();
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        <>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="ChatList" component={ChatListScreen} />
          <Stack.Screen name="Chat" component={ChatScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />

          <Stack.Screen name="EditProfile" component={EditProfileScreen} />

          <Stack.Screen name="Notifications" component={NotificationScreen} />
          <Stack.Screen name="MatchScreen" component={MatchSreen} />
          <Stack.Screen name="DiscoverScreen" component={DiscoverScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
        </>
      )}
      {/* <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Chat" component={ChatScreen} />
      <Stack.Screen name="Login" component={LoginScreen} /> */}
    </Stack.Navigator>
  );
};

export default StackNavigator;
