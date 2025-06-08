import { View, Text, ScrollView, Image, Button, TouchableOpacity } from "react-native";
import React, { useCallback } from 'react';

import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";

import Feather from "@expo/vector-icons/Feather";
import { useNavigation } from "@react-navigation/native";
import { useProfile } from "../contexts/ProfileContext";
import { useFocusEffect } from "@react-navigation/native";
import useAuth from "../hooks/useAuth";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from '@expo/vector-icons';



// const Me = {
//   username: "Bobby",
//   gender: "male",
//   job: "Developer",
//   avatarUrl:
//     "https://i.pinimg.com/736x/49/67/4c/49674ccc074f5b28829c058d293cad60.jpg",
//   age: 20,
//   hobbies: [
//     {"id": 1, "name": "Hiking"},
//     {"id": 3, "name": "Photography"},
//     {"id": 5, "name": "Reading"}
//   ],
//   bio: "I am a developer and I love to travel",
//   preference: {
//     "id": 1,
//     "interestedGender": "female",
//     "maxDistance": 50,
//     "minAge": 20,
//     "maxAge": 30,
//     "datingPurpose": "serious"
//   },

// };
// import { logout } from '../hooks/useAuth';

const ProfileScreen = () => {
  const { profile } = useProfile();
  const navigation = useNavigation();
  const { logout } = useAuth();

//   useFocusEffect(
//   useCallback(() => {
//     const loadProfile = async () => {
//       const profileData = await AsyncStorage.getItem("profile");
//       if (profileData) {
//         const { avatarUrl, bio, hobbies, preference } = JSON.parse(profileData);
//         setAvatarUrl(avatarUrl);
//         setBio(bio);
//         setHobbies(hobbies);
//         setInterestedGender(preference?.interestedGender || "female");
//       }
//     };
//     loadProfile();
//   }, [])
// );

  // console.log(profile.hobbies);
  const getDatingPurposeIcon = (purpose) => {
    switch (purpose?.toLowerCase()) {
      case "serious":
        return "💍";
      case "casual":
        return "😊";
      case "friendship":
        return "🤝";
      default:
        return "💖";
    }
  };

  const getHobbyIcon = (hobby) => {
    const icons = {
      Reading: "📚",
      Traveling: "✈️",
      Cooking: "👨‍🍳",
      Music: "🎵",
      Sports: "⚽",
      Gaming: "🎮",
      Photography: "📸",
      Art: "🎨",
      Politics: "🗳️",
      Tourism: "🗺️",
      Hiking: "🥾",
    };
    return icons[hobby] || "🎯";
  };

  return (
    <ScrollView
      className="relative bg-white flex-1"
      contentContainerStyle={{ paddingBottom: hp(5) }}
    >
      <View>
        <Image
          source={{ uri: profile.avatarUrl }}
          style={{
            width: wp(100),
            height: hp(60),
            borderBottomLeftRadius: 30,
            borderBottomRightRadius: 30,
          }}
        />
      </View>

      <View className="w-full absolute flex-row justify-between items-center pt-10 px-5">
        {/* Nút Return Back */}
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="p-2 rounded-full bg-black/40"
        >
          <Feather name="arrow-left" size={hp(3)} color="white" />
        </TouchableOpacity>

        {/* Nút chụp ảnh */}
        <View className="p-2 rounded-full bg-black/40">
          <Feather name="camera" size={hp(3.5)} color="white" />
        </View>
      </View>

      <View className="w-full justify-start items-start px-6 space-y-4 mt-6">
        <View className="flex-row space-x-2 justify-between w-full items-center">
          <View className="flex-row ">
            <Text className="text-black text-center font-bold text-xl">
              {profile.username}
              {", "}
            </Text>
            <Text className="text-black text-center font-bold text-xl ">
              {profile.age}
            </Text>
          </View>

          <TouchableOpacity onPress={() => navigation.navigate("EditProfile")}>
            <Text className="text-blue-600">Edit</Text>
          </TouchableOpacity>
        </View>

        <View className="mt-4">
          <Text className="uppercase font-semibold text-neutral-500 tracking-wider mb-2">
            Dating Purpose
          </Text>
          <View
            style={{
              borderRadius: 20,
              paddingVertical: 8,
              paddingHorizontal: 16,
              backgroundColor: "#ffe4e1",
              alignSelf: "flex-start",
            }}
          >
            <Text className="text-pink-700 font-medium text-sm">
              💖
              {profile.preference.datingPurpose.charAt(0).toUpperCase() +
                profile.preference.datingPurpose.slice(1)}
            </Text>
          </View>
        </View>

        <View>
          <Text className="uppercase font-semibold text-neutral-500 tracking-wider mb-2 mt-6">
            BIO
          </Text>

          <Text className="text-black/80 text-left font-medium text-sm">
            {profile.bio}
          </Text>
        </View>

        <View>
          <Text className="uppercase font-semibold text-neutral-500 tracking-wider mb-2 mt-6">
            Hobbies
          </Text>
          <View className="flex-row mt-2">
            {profile.hobbies?.map((hobby, index) => (
              <View
                key={index}
                style={{
                  borderRadius: 20,
                  padding: 5,
                  paddingHorizontal: 10,
                  marginRight: 5,
                }}
                className="bg-[#d3d3d3]"
              >
                <Text className="text-black">{hobby.name}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Preferences Card */}
        <View className="bg-white rounded-2xl p-5 mb-4 shadow-sm border border-gray-100">
          <Text className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-3">
            Looking For
          </Text>
          <View className="space-y-3">
            <View className="flex-row items-center">
              <View className="w-8 h-8 bg-purple-100 rounded-full items-center justify-center mr-3">
                <Text className="text-purple-600 text-sm">
                  {profile.preference?.interestedGender === "male" ? "♂" : "♀"}
                </Text>
              </View>
              <Text className="text-gray-700 font-medium">
                {profile.preference?.interestedGender
                  ?.charAt(0)
                  .toUpperCase() +
                  profile.preference?.interestedGender?.slice(1)}
              </Text>
            </View>

            <View className="flex-row items-center">
              <View className="w-8 h-8 bg-green-100 rounded-full items-center justify-center mr-3">
                <MaterialIcons name="location-on" size={16} color="#059669" />
              </View>
              <Text className="text-gray-700 font-medium">
                Within {profile.preference?.maxDistance || 50} km
              </Text>
            </View>

            <View className="flex-row items-center">
              <View className="w-8 h-8 bg-orange-100 rounded-full items-center justify-center mr-3">
                <MaterialIcons name="cake" size={16} color="#ea580c" />
              </View>
              <Text className="text-gray-700 font-medium">
                Age {profile.preference?.minAge || 18} -{" "}
                {profile.preference?.maxAge || 35}
              </Text>
            </View>
          </View>
        </View>
          <Button title="Logout" onPress={logout} />
         <Button title="Delete Account" onPress={logout} />
      </View>
    </ScrollView>
  );
};

export default ProfileScreen;
