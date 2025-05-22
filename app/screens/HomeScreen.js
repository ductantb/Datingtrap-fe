import { View, Text, Button } from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../components/Header";
import useAuth from "../hooks/useAuth";
import { auth } from '../../firebase';
import { verifyToken } from "../services/authService";
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = () => {
  const navigation = useNavigation();
  const { logout } = useAuth();
  const [token, setToken] = useState("");
  const [userId, setUserId] = useState("");
  const [userid, setUserid] = useState("");

  useEffect(() => {
  const fetchTokenAndVerify = async () => {
    try {
      if (auth.currentUser) {
        const idToken = await auth.currentUser.getIdToken(true);
        setToken(idToken);

        const res = await verifyToken(idToken);
        
        setUserId(res.userId);  
      }
      const storedUserId = await AsyncStorage.getItem('userId');
      if (storedUserId) {
        setUserid(storedUserId);
      }
    } catch (error) {
      console.error("Lỗi khi lấy token hoặc verifyToken:", error);
    }
  };

  fetchTokenAndVerify();
}, []);

  return (
    <SafeAreaView>
      <Header />
      <View style={{ padding: 20 }}>
        <View>
          <Text>Firebase ID Token:</Text>
          <Text>{token}</Text>

          <Text style={{ marginTop: 10 }}>User ID từ backend:</Text>
          <Text>{userId || "Đang xác thực..."}</Text>
          <Text style={{ marginTop: 10 }}>User ID từ storage:</Text>
          <Text>{userid}</Text>
        </View>

        <Button title="Log Out" onPress={logout} />
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;
