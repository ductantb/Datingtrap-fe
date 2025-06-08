import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  Button,
  TouchableOpacity,
  Modal,
} from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import { useProfile } from "../contexts/ProfileContext";
import useAuth from "../hooks/useAuth";

const ProfileScreen = () => {
  const { profile } = useProfile();
  const navigation = useNavigation();
  const { logout } = useAuth();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Nếu cần load lại profile khi screen focus
  useFocusEffect(
    useCallback(() => {
      // TODO: load lại profile từ storage/API nếu cần
    }, [])
  );

  const handleDeleteAccount = () => {
    setShowDeleteModal(true);
  };

  const confirmDeleteAccount = () => {
    setShowDeleteModal(false);
    // TODO: Gọi API xóa tài khoản
    console.log("Account deleted");
    navigation.navigate("Login");
  };

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
    <>
      <ScrollView
        className="relative bg-white flex-1"
        contentContainerStyle={{ paddingBottom: hp(5) }}
      >
        {/* Ảnh bìa */}
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

        {/* Nút quay lại và camera */}
        <View className="w-full absolute flex-row justify-between items-center pt-10 px-5">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="p-2 rounded-full bg-black/40"
          >
            <Feather name="arrow-left" size={hp(3)} color="white" />
          </TouchableOpacity>
          <TouchableOpacity className="p-2 rounded-full bg-black/40">
            <Feather name="camera" size={hp(3.5)} color="white" />
          </TouchableOpacity>
        </View>

        {/* Thông tin cơ bản */}
        <View className="w-full justify-start items-start px-6 space-y-4 mt-6">
          <View className="flex-row space-x-2 justify-between w-full items-center">
            <View className="flex-row">
              <Text className="text-black font-bold text-xl">
                {profile.username}, {profile.age}
              </Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate("EditProfile")}>
              <Text className="text-blue-600">Edit</Text>
            </TouchableOpacity>
          </View>

          {/* Mục Dating Purpose */}
          <View>
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
                {getDatingPurposeIcon(profile.preference.datingPurpose)}{" "}
                {profile.preference.datingPurpose.charAt(0).toUpperCase() +
                  profile.preference.datingPurpose.slice(1)}
              </Text>
            </View>
          </View>

          {/* BIO */}
          <View>
            <Text className="uppercase font-semibold text-neutral-500 tracking-wider mb-2 mt-6">
              BIO
            </Text>
            <Text className="text-black/80 text-left font-medium text-sm">
              {profile.bio}
            </Text>
          </View>

          {/* Hobbies */}
          <View>
            <Text className="uppercase font-semibold text-neutral-500 tracking-wider mb-2 mt-6">
              Hobbies
            </Text>
            <View className="flex-row mt-2 flex-wrap">
              {profile.hobbies?.map((hobby, index) => (
                <View
                  key={index}
                  className="bg-[#d3d3d3] rounded-full px-3 py-1 mr-2 mb-2 flex-row items-center"
                >
                  <Text className="mr-1">{getHobbyIcon(hobby.name)}</Text>
                  <Text className="text-black">{hobby.name}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Preferences Card (Looking For) */}
          <View className="bg-white rounded-2xl p-5 mb-4 shadow-sm border border-gray-100">
            <Text className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-3">
              Looking For
            </Text>
            <View className="space-y-3">
              <View className="flex-row items-center">
                <View className="w-8 h-8 bg-purple-100 rounded-full items-center justify-center mr-3">
                  <Text className="text-purple-600 text-sm">
                    {profile.preference.interestedGender === "male" ? "♂" : "♀"}
                  </Text>
                </View>
                <Text className="text-gray-700 font-medium">
                  {profile.preference.interestedGender.charAt(0).toUpperCase() +
                    profile.preference.interestedGender.slice(1)}
                </Text>
              </View>

              <View className="flex-row items-center">
                <View className="w-8 h-8 bg-green-100 rounded-full items-center justify-center mr-3">
                  <MaterialIcons name="location-on" size={16} color="#059669" />
                </View>
                <Text className="text-gray-700 font-medium">
                  Within {profile.preference.maxDistance || 50} km
                </Text>
              </View>

              <View className="flex-row items-center">
                <View className="w-8 h-8 bg-orange-100 rounded-full items-center justify-center mr-3">
                  <MaterialIcons name="cake" size={16} color="#ea580c" />
                </View>
                <Text className="text-gray-700 font-medium">
                  Age {profile.preference.minAge || 18} – {profile.preference.maxAge || 35}
                </Text>
              </View>
            </View>
          </View>

          {/* Logout Button */}
          <View className="mb-4 px-6">
            <Button title="Logout" onPress={logout} />
          </View>

          {/* Delete Account Button */}
          <View className="mt-2 px-6 mb-8">
            <TouchableOpacity
              onPress={handleDeleteAccount}
              className="bg-red-500 rounded-lg py-3"
            >
              <Text className="text-white text-center font-semibold">Delete Account</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Delete Confirmation Modal */}
      <Modal
        animationType="fade"
        transparent
        visible={showDeleteModal}
        onRequestClose={() => setShowDeleteModal(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.4)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              width: wp(80),
              backgroundColor: "#fff",
              borderRadius: 16,
              padding: 24,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 4,
              elevation: 5,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
                color: "#333",
                marginBottom: 12,
                textAlign: "center",
              }}
            >
              Delete Account
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: "#555",
                textAlign: "center",
                marginBottom: 20,
              }}
            >
              Are you sure you want to permanently delete your account? This action cannot be undone.
            </Text>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <TouchableOpacity
                onPress={() => setShowDeleteModal(false)}
                style={{
                  paddingVertical: 10,
                  paddingHorizontal: 20,
                  borderRadius: 10,
                  backgroundColor: "#d3d3d3",
                }}
              >
                <Text style={{ color: "#333", fontWeight: "600" }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={confirmDeleteAccount}
                style={{
                  paddingVertical: 10,
                  paddingHorizontal: 20,
                  borderRadius: 10,
                  backgroundColor: "#ff4d4d",
                }}
              >
                <Text style={{ color: "#fff", fontWeight: "600" }}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default ProfileScreen;
