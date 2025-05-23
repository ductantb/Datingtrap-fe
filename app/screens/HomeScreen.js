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
import { useNavigation } from '@react-navigation/native';


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
import useAuth from "../hooks/useAuth";
import { auth } from '../../firebase';
import { verifyToken } from "../services/authService";
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = () => {
  const navigation = useNavigation();
  const { logout } = useAuth();

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

      <TinderCardComponent />
    </SafeAreaView>
  );
};

export default HomeScreen;
