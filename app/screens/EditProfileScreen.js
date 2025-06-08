import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { ArrowLeftIcon } from "react-native-heroicons/outline";
import { useProfile } from "../contexts/ProfileContext.js"; // ← Cập nhật đúng path nếu cần
import { SafeAreaView } from "react-native";


const availableHobbies = [
  "Reading",
  "Traveling",
  "Cooking",
  "Music",
  "Sports",
  "Gaming",
  "Photography",
  "Art",
  "Politics",
  "Tourism",
];

const EditProfileScreen = () => {
  const navigation = useNavigation();
  const { profile, updateProfile } = useProfile();

  // Initialize state from context
  const [avatarUrl, setAvatarUrl] = useState(profile.avatarUrl || "");
  const [bio, setBio] = useState(profile.bio || "");
  const [hobbies, setHobbies] = useState(profile.hobbies || []);
  const [interestedGender, setInterestedGender] = useState(
    profile.preference?.interestedGender || "female"
  );

  const toggleHobby = (hobbyName) => {
    setHobbies((prev) => {
      const exists = prev.some((h) => h.name === hobbyName);
      if (exists) {
        return prev.filter((h) => h.name !== hobbyName);
      } else {
        return [...prev, { id: Date.now(), name: hobbyName }];
      }
    });
  };

  const handleSave = async () => {
    const newProfile = {
      ...profile,
      avatarUrl,
      bio,
      hobbies,
      preference: {
        ...profile.preference,
        interestedGender,
      },
    };
    // Save to storage
    await AsyncStorage.setItem("profile", JSON.stringify(newProfile));
    // Update context
    updateProfile(newProfile);
    navigation.navigate("Profile");
  };

  return (
    <SafeAreaView className="flex-1 bg-white p-4">
      <View className="flex-row items-center mb-4">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4">
          <ArrowLeftIcon size={24} color="#be185d" />
        </TouchableOpacity>
        <Text className="text-2xl font-bold text-pink-700">Edit Profile</Text>
      </View>

      <Text className="text-sm font-semibold text-gray-600 mb-1">
        Avatar URL
      </Text>
      <TextInput
        value={avatarUrl}
        onChangeText={setAvatarUrl}
        placeholder="Enter avatar URL"
        className="border border-gray-300 rounded-xl p-3 mb-4 text-gray-800"
      />
      {avatarUrl !== "" && (
        <Image
          source={{ uri: avatarUrl }}
          className="w-full h-56 rounded-xl mb-4"
          resizeMode="cover"
        />
      )}

      <Text className="text-sm font-semibold text-gray-600 mb-1">Bio</Text>
      <TextInput
        value={bio}
        onChangeText={setBio}
        placeholder="Tell something about yourself"
        multiline
        numberOfLines={4}
        className="border border-gray-300 rounded-xl p-3 mb-4 text-gray-800"
      />

      <Text className="text-sm font-semibold text-gray-600 mb-2">
        Interested Gender
      </Text>
      <View className="flex-row space-x-4 mb-6">
        {[
          { label: "Male", value: "male", icon: "♂" },
          { label: "Female", value: "female", icon: "♀" },
        ].map((item) => (
          <TouchableOpacity
            key={item.value}
            onPress={() => setInterestedGender(item.value)}
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor:
                interestedGender === item.value ? "#f472b6" : "#e5e7eb",
              paddingHorizontal: 16,
              paddingVertical: 10,
              borderRadius: 9999,
              borderWidth: 1,
              borderColor:
                interestedGender === item.value ? "#be185d" : "#d1d5db",
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: interestedGender === item.value ? "#fff" : "#1f2937",
                marginRight: 6,
              }}
            >
              {item.icon}
            </Text>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: interestedGender === item.value ? "#fff" : "#1f2937",
              }}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text className="text-sm font-semibold text-gray-600 mb-2">
        Select Hobbies
      </Text>
      <View className="flex-row flex-wrap mb-6">
        {availableHobbies.map((hobby) => {
          const selected = hobbies.some((h) => h.name === hobby);
          return (
            <TouchableOpacity
              key={hobby}
              onPress={() => toggleHobby(hobby)}
              style={{
                backgroundColor: selected ? "#60a5fa" : "#f3f4f6",
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 9999,
                marginRight: 8,
                marginBottom: 8,
              }}
            >
              <Text
                style={{
                  color: selected ? "white" : "#374151",
                  fontWeight: "600",
                }}
              >
                {hobby}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <TouchableOpacity
        onPress={handleSave}
        className="bg-pink-500 py-3 rounded-2xl items-center shadow-md"
      >
        <Text className="text-white font-semibold text-lg">Save</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default EditProfileScreen;
