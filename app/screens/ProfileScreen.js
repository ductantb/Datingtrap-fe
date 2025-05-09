import { View, Text, ScrollView, Image } from "react-native";
import React from "react";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";

import Feather from "@expo/vector-icons/Feather";

const Me = {
  fullName: "Bobby",
  job: "Developer",
  avatarUrl:
    "https://i.pinimg.com/736x/49/67/4c/49674ccc074f5b28829c058d293cad60.jpg",
  age: 20,
  hobbies: ["Hiking", "Photography", "Reading"],
  bio: "I am a developer and I love to travel",
};
const ProfileScreen = () => {
  return (
    <ScrollView
      className="relative bg-white flex-1"
      contentContainerStyle={{ paddingBottom: hp(5) }}
    >
      <View>
        <Image
          source={{ uri: Me.avatarUrl }}
          style={{
            width: wp(100),
            height: hp(60),
            borderBottomLeftRadius: 30,
            borderBottomRightRadius: 30,
          }}
        />
      </View>

      <View className="w-full absolute flex-row justify-end items-center pt-10">
        <View className="p-2 rounded-full bg-black/40 mr-5 justify-between">
          <Feather name="camera" size={hp(3.5)} color="white" />
        </View>
      </View>

      <View className="w-full justify-start items-start px-6 space-y-4 mt-6">
        <View className="flex-row space-x-2 justify-between w-full items-center">
          <View className="flex-row ">
            <Text className="text-black text-center font-bold text-xl">
              {Me.fullName}
              {", "}
            </Text>
            <Text className="text-black text-center font-bold text-xl ">
              {Me.age}
            </Text>
          </View>

          <Text>Edit</Text>
        </View>

        <View>
          <View className="flex-row mt-6">
            {Me.hobbies?.map((hobby, index) => (
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
                <Text className="text-black">{hobby}</Text>
              </View>
            ))}
          </View>
        </View>

        <View>
          <Text className="uppercase font-semibold text-neutral-500 tracking-wider mb-2 mt-6">
            BIO
          </Text>

          <Text className="text-black/80 text-left font-medium text-sm">
            {Me.bio}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default ProfileScreen;
