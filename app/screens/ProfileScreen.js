import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Modal,
} from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { useNavigation } from "@react-navigation/native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { useProfile } from "../contexts/ProfileContext";

const ProfileScreen = () => {
  const { profile } = useProfile();
  const navigation = useNavigation();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDeleteAccount = () => {
    setShowDeleteModal(true);
  };

  const confirmDeleteAccount = () => {
    setShowDeleteModal(false);
    // TODO: Gọi API xóa tài khoản ở đây nếu có
    console.log("Account deleted");
    navigation.navigate("Login");
  };

  return (
    <>
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
          <TouchableOpacity
            onPress={() => navigation.navigate("Home")}
            className="p-2 rounded-full bg-black/40"
          >
            <Feather name="arrow-left" size={hp(3)} color="white" />
          </TouchableOpacity>

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

            <TouchableOpacity
              onPress={() => navigation.navigate("EditProfile")}
            >
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
        </View>

        <View className="mt-10 px-6">
          <TouchableOpacity
            onPress={handleDeleteAccount}
            style={{
              backgroundColor: "#ff4d4d",
              paddingVertical: 12,
              borderRadius: 10,
            }}
          >
            <Text className="text-white text-center font-semibold text-base">
              Delete Account
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Custom Modal */}
      <Modal
        animationType="fade"
        transparent={true}
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
              Are you sure you want to permanently delete your account? This
              action cannot be undone.
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
