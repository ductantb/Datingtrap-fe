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
import { useProfile } from "../contexts/ProfileContext.js";
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
  "Hiking",
];

const datingPurposes = ["serious", "casual", "friendship"];

const EditProfileScreen = () => {
  const navigation = useNavigation();
  const { profile, updateProfile } = useProfile();

  const [avatarUrl, setAvatarUrl] = useState(profile.avatarUrl || "");
  const [bio, setBio] = useState(profile.bio || "");
  const [hobbies, setHobbies] = useState(profile.hobbies || []);
  const [interestedGender, setInterestedGender] = useState(
    profile.preference?.interestedGender || "female"
  );
  const [minAge, setMinAge] = useState(profile.preference?.minAge?.toString() || "18");
  const [maxAge, setMaxAge] = useState(profile.preference?.maxAge?.toString() || "35");
  const [maxDistance, setMaxDistance] = useState(profile.preference?.maxDistance?.toString() || "50");
  const [datingPurpose, setDatingPurpose] = useState(
    profile.preference?.datingPurpose || "serious"
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
        minAge: parseInt(minAge),
        maxAge: parseInt(maxAge),
        maxDistance: parseInt(maxDistance),
        datingPurpose,
      },
    };
    await AsyncStorage.setItem("profile", JSON.stringify(newProfile));
    updateProfile(newProfile);
    navigation.navigate("Profile");
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 px-4 py-6">
        {/* Header */}
        <View className="flex-row items-center mb-6">
          <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4">
            <ArrowLeftIcon size={24} color="#be185d" />
          </TouchableOpacity>
          <Text className="text-2xl font-bold text-pink-700">Edit Profile</Text>
        </View>

        {/* Avatar */}
        <Text className="text-sm font-semibold text-gray-600 mb-1">Avatar URL</Text>
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

        {/* Bio */}
        <Text className="text-sm font-semibold text-gray-600 mb-1">Bio</Text>
        <TextInput
          value={bio}
          onChangeText={setBio}
          placeholder="Tell something about yourself"
          multiline
          numberOfLines={4}
          className="border border-gray-300 rounded-xl p-3 mb-4 text-gray-800"
        />

        {/* Interested Gender */}
        <Text className="text-sm font-semibold text-gray-600 mb-2">Interested Gender</Text>
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

        {/* Dating Purpose */}
        <Text className="text-sm font-semibold text-gray-600 mb-2">Dating Purpose</Text>
        <View className="flex-row flex-wrap mb-6">
          {datingPurposes.map((purpose) => {
            const selected = datingPurpose === purpose;
            return (
              <TouchableOpacity
                key={purpose}
                onPress={() => setDatingPurpose(purpose)}
                style={{
                  backgroundColor: selected ? "#fb7185" : "#f3f4f6",
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                  borderRadius: 9999,
                  marginRight: 8,
                  marginBottom: 8,
                  borderWidth: 1,
                  borderColor: selected ? "#be185d" : "#d1d5db",
                }}
              >
                <Text
                  style={{
                    color: selected ? "white" : "#374151",
                    fontWeight: "600",
                    textTransform: "capitalize",
                  }}
                >
                  {purpose}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Distance */}
        <Text className="text-sm font-semibold text-gray-600 mb-1">Max Distance (km)</Text>
        <TextInput
          value={maxDistance}
          onChangeText={setMaxDistance}
          placeholder="Max Distance"
          keyboardType="numeric"
          className="border border-gray-300 rounded-xl p-3 mb-4 text-gray-800"
        />

        {/* Age Range */}
        <Text className="text-sm font-semibold text-gray-600 mb-2">Preferred Age Range</Text>
        <View className="flex-row space-x-4 mb-6">
          <TextInput
            value={minAge}
            onChangeText={setMinAge}
            placeholder="Min Age"
            keyboardType="numeric"
            className="flex-1 border border-gray-300 rounded-xl p-3 text-gray-800"
          />
          <TextInput
            value={maxAge}
            onChangeText={setMaxAge}
            placeholder="Max Age"
            keyboardType="numeric"
            className="flex-1 border border-gray-300 rounded-xl p-3 text-gray-800"
          />
        </View>

        {/* Hobbies */}
        <Text className="text-sm font-semibold text-gray-600 mb-2">Select Hobbies</Text>
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

        {/* Save Button */}
        <TouchableOpacity
          onPress={handleSave}
          className="bg-pink-500 py-3 rounded-2xl items-center shadow-md mb-8"
        >
          <Text className="text-white font-semibold text-lg">Save</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EditProfileScreen;
