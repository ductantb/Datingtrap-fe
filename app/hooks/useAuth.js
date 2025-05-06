// useAuth.js
import React, { createContext, useContext, useEffect, useState } from "react";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import {
  GoogleAuthProvider,
  signInWithCredential,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "../../firebase";

WebBrowser.maybeCompleteAuthSession();

const AuthContext = createContext({});

const redirectUri = Linking.createURL("/auth");
console.log("Generated Redirect URI:", redirectUri);

// Thay thế bằng Web Client ID thực tế bạn đã tìm được từ Google Cloud/Firebase Console
const webClientId =
  "613465939244-d5cfuensgu5c9s0m7eq73p0l7petlamg.apps.googleusercontent.com";

// === THÊM CÁC CLIENT ID RIÊNG CHO TỪNG NỀN TẢNG VÀO ĐÂY ===
// Lấy từ Google Cloud Console > APIs & Services > Credentials
// Hoặc từ Firebase Console > Project settings > Your apps > Chọn ứng dụng Android/iOS
const androidClientId =
  "613465939244-cdp9bpb6ajjt9rcuakkbppaimor2jcsp.apps.googleusercontent.com"; // <<< Lấy từ thông báo lỗi hoặc Google Cloud
// Nếu bạn có ứng dụng iOS, hãy tìm iOS Client ID tương ứng và thêm vào đây
// const iosClientId = "YOUR_IOS_CLIENT_ID_HERE.apps.googleusercontent.com"; // <<< Cần Client ID cho ứng dụng iOS

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Kiểm tra trạng thái ban đầu

  const [request, response, promptAsync] = Google.useAuthRequest(
    {
      webClientId: webClientId,
      // Thêm các Client ID riêng cho từng nền tảng vào config object này
      androidClientId: androidClientId, // <<< ĐÃ THÊM
      // iosClientId: iosClientId, // <<< Thêm nếu có
      redirectUri: redirectUri,
      scopes: ["profile", "email", "openid"],
    },
    {
      useProxy: true, // <<< Thêm cái này nếu chạy trong Expo Go
    }
  );

  // Effect 1: Lắng nghe trạng thái xác thực từ Firebase
  useEffect(() => {
    // Đặt loading = true ngay khi bắt đầu lắng nghe để đảm bảo chờ kết quả ban đầu
    setLoading(true);
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log("Firebase Auth State Changed:", currentUser);
      setUser(currentUser);
      setLoading(false); // Luôn đặt loading = false sau khi nhận được trạng thái
    });

    return () => unsubscribe();
  }, []); // Chạy một lần khi mount

  // Effect 2: Xử lý phản hồi từ luồng đăng nhập Google của Expo
  useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.authentication;

      if (id_token) {
        console.log("Received ID Token, signing in with Firebase...");
        const credential = GoogleAuthProvider.credential(id_token);
        // Sử dụng signInWithCredential để đăng nhập vào Firebase Auth
        signInWithCredential(auth, credential)
          .then((result) => {
            console.log("Firebase Sign In Successful:", result.user);
            // onAuthStateChanged sẽ tự động cập nhật state user và set loading = false
          })
          .catch((error) => {
            console.error("Firebase Sign In Error:", error);
            // Xử lý lỗi đăng nhập Firebase (ví dụ: hiển thị thông báo)
            setLoading(false); // Dừng loading nếu có lỗi Firebase
          });
      } else {
        console.error("Google Sign In Success but no ID Token received.");
        setLoading(false); // Dừng loading
      }
    } else if (response?.type === "error") {
      console.error("Google Sign In Error:", response.error);
      setLoading(false); // Dừng loading
    } else if (response?.type === "dismiss") {
      console.log("Google Sign In dismissed.");
      setLoading(false); // Dừng loading khi người dùng đóng cửa sổ đăng nhập
    }
  }, [response]); // Chạy lại effect này khi có phản hồi từ luồng xác thực Google

  const signInWithGoogle = async () => {
    setLoading(true); // Bắt đầu loading khi bắt đầu đăng nhập
    try {
      if (request) {
        console.log("Initiating Google Sign In...");
        // promptAsync sẽ trả về response hoặc null/undefined ngay lập tức nếu không thành công
        // Kết quả thành công/thất bại của flow sẽ được xử lý bởi useEffect theo dõi `response`
        await promptAsync();
      } else {
        console.error(
          "Google Auth Request not ready (check client IDs or config)."
        );
        setLoading(false); // Dừng loading
      }
    } catch (error) {
      console.error("Error initiating Google Sign In:", error);
      setLoading(false); // Dừng loading nếu có lỗi khởi tạo
    }
  };

  const firebaseSignOut = async () => {
    setLoading(true); // Bắt đầu loading khi đăng xuất
    try {
      console.log("Signing out from Firebase...");
      await signOut(auth);
      console.log("Firebase Sign Out Successful");
      // onAuthStateChanged sẽ tự động cập nhật state user thành null và set loading = false
    } catch (error) {
      console.error("Firebase Sign Out Error:", error);
      setLoading(false); // Dừng loading nếu có lỗi
    }
  };

  // Có thể hiển thị null hoặc component loading ở đây nếu loading là true ban đầu
  // Component LoginScreen (và các màn hình khác) cũng nên kiểm tra state `loading`
  // từ hook để hiển thị spinner riêng hoặc điều chỉnh UI
  if (loading) {
    // Ví dụ: return <ActivityIndicator size="large" color="#0000ff" />;
    return null; // Hoặc component loading toàn màn hình tùy thiết kế
  }

  return (
    <AuthContext.Provider
      value={{ user, signInWithGoogle, signOut: firebaseSignOut, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default function useAuth() {
  return useContext(AuthContext);
}
