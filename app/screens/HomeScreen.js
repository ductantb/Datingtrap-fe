import {
  View,
  Text,
  Button,
  TouchableWithoutFeedback,
  Image,
  Dimensions,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../components/Header";
import TinderCardComponent from "../components/TinderCard";



const HomeScreen = () => {
  return (
    <SafeAreaView>
      <Header />
      <TinderCardComponent />
    </SafeAreaView>
  );
};

export default HomeScreen;
