import { View, Text, ScrollView, Image, TouchableOpacity } from "react-native";
import React from 'react';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import Feather from "@expo/vector-icons/Feather";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useNavigation } from '@react-navigation/native';
import { useProfile } from "../contexts/ProfileContext";
import { LinearGradient } from 'expo-linear-gradient';

const ProfileScreen = () => {
  const { profile } = useProfile();
  const navigation = useNavigation();

  const getDatingPurposeIcon = (purpose) => {
    switch(purpose?.toLowerCase()) {
      case 'serious': return '💍';
      case 'casual': return '😊';
      case 'friendship': return '🤝';
      default: return '💖';
    }
  };

  const getHobbyIcon = (hobby) => {
    const icons = {
      'Reading': '📚',
      'Traveling': '✈️',
      'Cooking': '👨‍🍳',
      'Music': '🎵',
      'Sports': '⚽',
      'Gaming': '🎮',
      'Photography': '📸',
      'Art': '🎨',
      'Politics': '🗳️',
      'Tourism': '🗺️',
      'Hiking': '🥾'
    };
    return icons[hobby] || '🎯';
  };

  return (
    <ScrollView
      className="bg-gray-50 flex-1"
      contentContainerStyle={{ paddingBottom: hp(5) }}
      showsVerticalScrollIndicator={false}
    >
      {/* Hero Image Section */}
      <View className="relative">
        <Image
          source={{ uri: profile.avatarUrl }}
          style={{
            width: wp(100),
            height: hp(55),
          }}
          className="bg-gray-200"
        />
        
        {/* Gradient Overlay */}
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.7)']}
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: hp(25),
          }}
        />

        {/* Camera Button */}
        <View className="absolute top-12 right-5">
          <TouchableOpacity className="bg-black/40 p-3 rounded-full backdrop-blur-sm">
            <Feather name="camera" size={20} color="white" />
          </TouchableOpacity>
        </View>

        {/* Name and Age Overlay */}
        <View className="absolute bottom-6 left-6 right-6">
          <View className="flex-row justify-between items-end">
            <View>
              <Text className="text-white text-3xl font-bold mb-1">
                {profile.username}, {profile.age}
              </Text>
              <View className="flex-row items-center">
                <MaterialIcons name="work" size={16} color="white" />
                <Text className="text-white/90 text-base ml-1">{profile.job}</Text>
              </View>
            </View>
            
            <TouchableOpacity 
              onPress={() => navigation.navigate('EditProfile')}
              className="bg-white/90 px-4 py-2 rounded-full"
            >
              <Text className="text-pink-600 font-semibold">Edit Profile</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Content Section */}
      <View className="px-6 -mt-4">
        {/* Dating Purpose Card */}
        <View className="bg-white rounded-2xl p-5 mb-4 shadow-sm border border-gray-100">
          <Text className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-3">
            Dating Purpose
          </Text>
          <View className="bg-gradient-to-r from-pink-50 to-red-50 rounded-xl p-3">
            <Text className="text-pink-700 font-semibold text-base">
              {getDatingPurposeIcon(profile.preference?.datingPurpose)} {profile.preference?.datingPurpose?.charAt(0).toUpperCase() + profile.preference?.datingPurpose?.slice(1)}
            </Text>
          </View>
        </View>

        {/* Bio Card */}
        <View className="bg-white rounded-2xl p-5 mb-4 shadow-sm border border-gray-100">
          <Text className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-3">
            About Me
          </Text>
          <Text className="text-gray-800 text-base leading-6 font-medium">
            {profile.bio || "No bio available"}
          </Text>
        </View>

        {/* Hobbies Card */}
        <View className="bg-white rounded-2xl p-5 mb-4 shadow-sm border border-gray-100">
          <Text className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-3">
            Interests & Hobbies
          </Text>
          <View className="flex-row flex-wrap">
            {profile.hobbies?.map((hobby, index) => (
              <View
                key={index}
                className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-full px-4 py-2.5 mr-2 mb-2 border border-blue-100"
              >
                <Text className="text-blue-700 font-medium text-sm">
                  {getHobbyIcon(hobby.name)} {hobby.name}
                </Text>
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
                  {profile.preference?.interestedGender === 'male' ? '♂' : '♀'}
                </Text>
              </View>
              <Text className="text-gray-700 font-medium">
                {profile.preference?.interestedGender?.charAt(0).toUpperCase() + profile.preference?.interestedGender?.slice(1)}
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
                Age {profile.preference?.minAge || 18} - {profile.preference?.maxAge || 35}
              </Text>
            </View>
          </View>
        </View>

        {/* Stats Card */}
        <View className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl p-5 mb-6">
          <View className="flex-row justify-around">
            <View className="items-center">
              <Text className="text-white text-2xl font-bold">42</Text>
              <Text className="text-white/80 text-sm">Matches</Text>
            </View>
            <View className="w-px bg-white/30 mx-4" />
            <View className="items-center">
              <Text className="text-white text-2xl font-bold">18</Text>
              <Text className="text-white/80 text-sm">Likes</Text>
            </View>
            <View className="w-px bg-white/30 mx-4" />
            <View className="items-center">
              <Text className="text-white text-2xl font-bold">8</Text>
              <Text className="text-white/80 text-sm">Super Likes</Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default ProfileScreen;