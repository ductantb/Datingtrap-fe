import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { useState } from "react";
import { Picker } from "@react-native-picker/picker";
// import DateTimePicker from "@react-native-community/datetimepicker";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import AntDesign from "@expo/vector-icons/AntDesign";
import useAuth from "../hooks/useAuth";
import { useNavigation } from '@react-navigation/native';
import { registerUserProfile } from "../services/authService";
import firebase from "firebase/compat/app";
import { getAuth } from "firebase/auth";
import { app } from "../../firebase";

const SignUpScreen = () => {
  // Basic info states
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [age, setAge] = useState("");
  const [bio, setBio] = useState("");
  const [gender, setGender] = useState("male");
  const [job, setJob] = useState("");
  const [location, setLocation] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [birthDate, setBirthDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
   const [fireBaseId, setFireBaseId] = useState("");

  // Preference states
  const [interestedGender, setInterestedGender] = useState("both");
  const [maxDistance, setMaxDistance] = useState("50");
  const [minAge, setMinAge] = useState("18");
  const [maxAge, setMaxAge] = useState("50");
  const [datingPurpose, setDatingPurpose] = useState("serious");

  // Hobby states
  const [selectedHobbies, setSelectedHobbies] = useState([]);
  const [newHobby, setNewHobby] = useState("");

  // Form states
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);

   const {
    registerWithEmail,
    } = useAuth();
    const navigation = useNavigation();
  // Predefined hobbies
  const commonHobbies = [
    "Reading",
    "Traveling",
    "Cooking",
    "Music",
    "Sports",
    "Photography",
    "Movies",
    "Gaming",
    "Dancing",
    "Fitness",
    "Art",
    "Nature",
    "Coffee",
    "Wine",
    "Technology",
    "Fashion",
    "Food",
    "Animals",
    "Books",
    "Shopping",
  ];

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setBirthDate(selectedDate);
      // Calculate age from birth date
      const today = new Date();
      const calculatedAge = today.getFullYear() - selectedDate.getFullYear();
      setAge(calculatedAge.toString());
    }
  };

  const addHobby = (hobby) => {
    if (!selectedHobbies.includes(hobby) && selectedHobbies.length < 10) {
      setSelectedHobbies([...selectedHobbies, hobby]);
    }
  };

  const removeHobby = (hobby) => {
    setSelectedHobbies(selectedHobbies.filter((h) => h !== hobby));
  };

  const addCustomHobby = () => {
    if (
      newHobby.trim() &&
      !selectedHobbies.includes(newHobby.trim()) &&
      selectedHobbies.length < 10
    ) {
      setSelectedHobbies([...selectedHobbies, newHobby.trim()]);
      setNewHobby("");
    }
  };

  //   const validateStep1 = () => {
  //     if (!username.trim() || !email.trim() || !fullName.trim() || !age) {
  //       Alert.alert("Error", "Please fill in all required fields");
  //       return false;
  //     }
  //     if (!email.includes("@")) {
  //       Alert.alert("Error", "Please enter a valid email address");
  //       return false;
  //     }
  //     return true;
  //   };

  //   const validateStep2 = () => {
  //     if (!job.trim() || !location.trim()) {
  //       Alert.alert("Error", "Please fill in job and location");
  //       return false;
  //     }
  //     return true;
  //   };

  const handleNext = () => {
    if (currentStep === 1) {
      setCurrentStep(2);
    } else if (currentStep === 2) {
      setCurrentStep(3);
    } else if (currentStep === 3) {
      setCurrentStep(4);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      navigation.goBack();
    }
  };

  const handleSignUp = async () => {
    if (selectedHobbies.length === 0) {
      Alert.alert("Error", "Please select at least one hobby");
      return;
    }

    setLoading(true);

    try {
      // Đăng ký Firebase user và lấy Firebase UID
      const { firebaseUid } = await registerWithEmail(email, password);
      
      console.log("Firebase UID:", firebaseUid);

      const signUpData = {
        username,
        email,
        fullName,
        age: parseInt(age),
        bio,
        gender,
        fireBaseId: firebaseUid, // Sử dụng Firebase UID thay vì token
        job,
        location,
        avatarUrl,
        birthDate: birthDate.toISOString().split('T')[0], // Format YYYY-MM-DD
        preference: {
          interestedGender,
          maxDistance: parseInt(maxDistance),
          minAge: parseInt(minAge),
          maxAge: parseInt(maxAge),
          datingPurpose
        },
        hobbyIds: [] // Để trống vì backend chưa hỗ trợ hobbies
      };

      console.log("Sign Up Data:", signUpData);
      
      const profileResult = await registerUserProfile(signUpData);
      console.log("Profile created:", profileResult);

      Alert.alert(
        "Success", 
        "Account created successfully!",
        [{ text: "OK", onPress: () => navigation.navigate("Login") }]
      );

    } catch (error) {
      console.error('Sign up error:', error);
      Alert.alert(
        "Error", 
        error.message || "Failed to create account. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };


  const renderStep1 = () => (
    <View className="p-6">
      <Text className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Basic Information
      </Text>

      <View className="mb-4">
        <Text className="text-gray-700 text-sm font-medium mb-1">
          Username *
        </Text>
        <View className="relative">
          <Ionicons
            name="person"
            size={20}
            color="gray"
            className="absolute left-3 top-1/2 -translate-y-1/2"
          />
          <TextInput
            className="pl-10 w-full px-3 py-3 border border-gray-300 rounded-lg focus:border-blue-500"
            placeholder="Enter username"
            value={username}
            onChangeText={setUsername}
          />
        </View>
      </View>

      <View className="mb-4">
        <Text className="text-gray-700 text-sm font-medium mb-1">Email *</Text>
        <View className="relative">
          <MaterialIcons
            name="email"
            size={20}
            color="gray"
            className="absolute left-3 top-1/2 -translate-y-1/2"
          />
          <TextInput
            className="pl-10 w-full px-3 py-3 border border-gray-300 rounded-lg focus:border-blue-500"
            placeholder="your@email.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
        </View>
      </View>

      <View className="mb-4">
        <Text className="text-gray-700 text-sm font-medium mb-1">
          Full Name *
        </Text>
        <TextInput
          className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:border-blue-500"
          placeholder="Enter your full name"
          value={fullName}
          onChangeText={setFullName}
        />
      </View>

      <View className="mb-4">
        <Text className="text-gray-700 text-sm font-medium mb-1">Password *</Text>
        <View className="relative">
          <MaterialIcons name="lock" size={20} color="gray" className="absolute left-3 top-1/2 -translate-y-1/2" />
          <TextInput
            className="pl-10 w-full px-3 py-3 border border-gray-300 rounded-lg focus:border-blue-500"
            placeholder="**********"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={true}
          />
        </View>
      </View>

      <View className="mb-4">
        <Text className="text-gray-700 text-sm font-medium mb-1">Password *</Text>
        <View className="relative">
          <MaterialIcons name="lock" size={20} color="gray" className="absolute left-3 top-1/2 -translate-y-1/2" />
          <TextInput
            className="pl-10 w-full px-3 py-3 border border-gray-300 rounded-lg focus:border-blue-500"
            placeholder="**********"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={true}
          />
        </View>
      </View>

      <View className="mb-4">
        <Text className="text-gray-700 text-sm font-medium mb-1">
          Birth Date
        </Text>
        <Pressable
          onPress={() => setShowDatePicker(true)}
          className="w-full px-3 py-3 border border-gray-300 rounded-lg bg-white"
        >
          <Text>{birthDate.toDateString()}</Text>
        </Pressable>
        {/* {showDatePicker && (
          <DateTimePicker
            value={birthDate}
            mode="date"
            display="default"
            onChange={handleDateChange}
            maximumDate={new Date()}
          />
        )} */}
      </View>

      <View className="mb-4">
        <Text className="text-gray-700 text-sm font-medium mb-1">Gender</Text>
        <View className="border border-gray-300 rounded-lg">
          <Picker selectedValue={gender} onValueChange={setGender}>
            <Picker.Item label="Male" value="male" />
            <Picker.Item label="Female" value="female" />
            <Picker.Item label="Other" value="other" />
          </Picker>
        </View>
      </View>
    </View>
  );

  const renderStep2 = () => (
    <View className="p-6">
      <Text className="text-2xl font-bold text-gray-800 mb-6 text-center">
        About You
      </Text>

      <View className="mb-4">
        <Text className="text-gray-700 text-sm font-medium mb-1">Job *</Text>
        <TextInput
          className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:border-blue-500"
          placeholder="What do you do?"
          value={job}
          onChangeText={setJob}
        />
      </View>

      <View className="mb-4">
        <Text className="text-gray-700 text-sm font-medium mb-1">
          Location *
        </Text>
        <TextInput
          className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:border-blue-500"
          placeholder="Where are you located?"
          value={location}
          onChangeText={setLocation}
        />
      </View>

      <View className="mb-4">
        <Text className="text-gray-700 text-sm font-medium mb-1">Bio</Text>
        <TextInput
          className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:border-blue-500"
          placeholder="Tell us about yourself..."
          value={bio}
          onChangeText={setBio}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />
      </View>

      <View className="mb-4">
        <Text className="text-gray-700 text-sm font-medium mb-1">
          Profile Picture URL
        </Text>
        <TextInput
          className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:border-blue-500"
          placeholder="https://example.com/photo.jpg"
          value={avatarUrl}
          onChangeText={setAvatarUrl}
        />
      </View>
    </View>
  );

  const renderStep3 = () => (
    <View className="p-6">
      <Text className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Dating Preferences
      </Text>

      <View className="mb-4">
        <Text className="text-gray-700 text-sm font-medium mb-1">
          Interested in
        </Text>
        <View className="border border-gray-300 rounded-lg">
          <Picker
            selectedValue={interestedGender}
            onValueChange={setInterestedGender}
          >
            <Picker.Item label="Men" value="male" />
            <Picker.Item label="Women" value="female" />
            <Picker.Item label="Both" value="both" />
          </Picker>
        </View>
      </View>

      <View className="mb-4">
        <Text className="text-gray-700 text-sm font-medium mb-1">
          Age Range
        </Text>
        <View className="flex-row space-x-2">
          <View className="flex-1">
            <TextInput
              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:border-blue-500"
              placeholder="Min"
              value={minAge}
              onChangeText={setMinAge}
              keyboardType="numeric"
            />
          </View>
          <View className="flex-1">
            <TextInput
              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:border-blue-500"
              placeholder="Max"
              value={maxAge}
              onChangeText={setMaxAge}
              keyboardType="numeric"
            />
          </View>
        </View>
      </View>

      <View className="mb-4">
        <Text className="text-gray-700 text-sm font-medium mb-1">
          Max Distance (km)
        </Text>
        <TextInput
          className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:border-blue-500"
          placeholder="50"
          value={maxDistance}
          onChangeText={setMaxDistance}
          keyboardType="numeric"
        />
      </View>

      <View className="mb-4">
        <Text className="text-gray-700 text-sm font-medium mb-1">
          Looking for
        </Text>
        <View className="border border-gray-300 rounded-lg">
          <Picker
            selectedValue={datingPurpose}
            onValueChange={setDatingPurpose}
          >
            <Picker.Item label="Serious Relationship" value="serious" />
            <Picker.Item label="Casual Dating" value="casual" />
            <Picker.Item label="Friends" value="friend" />
            <Picker.Item label="Friends with Benefits" value="fwb" />
          </Picker>
        </View>
      </View>
    </View>
  );

  const renderStep4 = () => (
    <View className="p-6">
      <Text className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Your Interests
      </Text>

      <Text className="text-gray-600 mb-4">
        Select hobbies that interest you (max 10):
      </Text>

      <View className="flex-row flex-wrap mb-4">
        {commonHobbies.map((hobby) => (
          <Pressable
            key={hobby}
            onPress={() => addHobby(hobby)}
            className={`px-3 py-2 m-1 rounded-full border ${
              selectedHobbies.includes(hobby)
                ? "bg-blue-500 border-blue-500"
                : "bg-white border-gray-300"
            }`}
          >
            <Text
              className={
                selectedHobbies.includes(hobby) ? "text-white" : "text-gray-700"
              }
            >
              {hobby}
            </Text>
          </Pressable>
        ))}
      </View>

      <View className="mb-4">
        <Text className="text-gray-700 text-sm font-medium mb-1">
          Add custom hobby
        </Text>
        <View className="flex-row">
          <TextInput
            className="flex-1 px-3 py-3 border border-gray-300 rounded-l-lg focus:border-blue-500"
            placeholder="Enter hobby"
            value={newHobby}
            onChangeText={setNewHobby}
          />
          <Pressable
            onPress={addCustomHobby}
            className="px-4 py-3 bg-blue-500 rounded-r-lg"
          >
            <AntDesign name="plus" size={20} color="white" />
          </Pressable>
        </View>
      </View>

      <Text className="text-gray-700 text-sm font-medium mb-2">
        Selected hobbies ({selectedHobbies.length}/10):
      </Text>
      <View className="flex-row flex-wrap mb-4">
        {selectedHobbies.map((hobby) => (
          <View
            key={hobby}
            className="flex-row items-center px-3 py-2 m-1 bg-blue-100 rounded-full"
          >
            <Text className="text-blue-800 mr-2">{hobby}</Text>
            <Pressable onPress={() => removeHobby(hobby)}>
              <AntDesign name="close" size={16} color="#1e40af" />
            </Pressable>
          </View>
        ))}
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white"
    >
      {/* Header */}
      <View className="flex-row items-center justify-between p-4 pt-12 bg-blue-500">
        <Pressable onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </Pressable>
        <Text className="text-white text-lg font-semibold">
          Sign Up ({currentStep}/4)
        </Text>
        <View className="w-6" />
      </View>

      {/* Progress Bar */}
      <View className="bg-gray-200 h-1">
        <View
          className="bg-blue-500 h-full"
          style={{ width: `${(currentStep / 4) * 100}%` }}
        />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
        {currentStep === 4 && renderStep4()}
      </ScrollView>

      {/* Bottom Buttons */}
      <View className="p-4 border-t border-gray-200">
        {currentStep < 4 ? (
          <Pressable
            onPress={handleNext}
            className="w-full bg-blue-500 rounded-lg py-3 px-4"
          >
            <Text className="text-white font-medium text-center">Next</Text>
          </Pressable>
        ) : (
          <Pressable
            onPress={handleSignUp}
            disabled={loading}
            className={`w-full rounded-lg py-3 px-4 ${
              loading ? "bg-gray-400" : "bg-blue-500"
            }`}
          >
            <Text className="text-white font-medium text-center">
              {loading ? "Creating Account..." : "Create Account"}
            </Text>
          </Pressable>
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

export default SignUpScreen;
