import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from "react";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithCredential,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../../firebase";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import AsyncStorage from '@react-native-async-storage/async-storage'; 
// import {verifyToken} from "../services/authService"; // Import verifyToken từ api

WebBrowser.maybeCompleteAuthSession();

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);

  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId: "384266278181-s77f8l25qdau0231uqc73uca5vtjgeop.apps.googleusercontent.com",
    androidClientId:
      "613465939244-cdp9bpb6ajjt9rcuakkbppaimor2jcsp.apps.googleusercontent.com",
    offlineAccess: true,
    scopes: ["profile", "email"],
  });
  useEffect(() => {
  if (request) {
    console.log("Redirect URI:", request.redirectUri);
  }
}, [request]);

//    const [request, response, promptAsync] = Google.useAuthRequest({
//     androidClientId:
//       "613465939244-cdp9bpb6ajjt9rcuakkbppaimor2jcsp.apps.googleusercontent.com",
//     expoClientId:
//       "613465939244-d5cfuensgu5c9s0m7eq73p0l7petlamg.apps.googleusercontent.com",
//     scopes: ["profile", "email"],
//   });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user || null);
      setLoadingInitial(false);
      if (user) {
        try {
          const token = await user.getIdToken();
          setToken(token);
          console.log('Stored token:', token);

          // Gọi verifyToken để lấy userId từ backend
          // const res = await verifyToken(token);
          // if (res?.data?.userId) {
          //   setUserId(res.data.userId);
          //   // Lưu userId và token vào AsyncStorage
          //   await AsyncStorage.setItem('userId', res.data.userId.toString());
          //   await AsyncStorage.setItem('token', token);
          // }
        } catch (e) {
          console.log("Error verifying token:", e);
        }
      } else {
        // Nếu logout, xóa dữ liệu lưu trữ
        setToken(null);
        setUserId(null);
        // await AsyncStorage.removeItem('userId');
        // await AsyncStorage.removeItem('token');
      }
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
  const signInWithGoogle = async () => {
    if (response?.type === "success") {
      setLoading(true);
      const { id_token, access_token } = response.authentication;
      const credential = GoogleAuthProvider.credential(id_token, access_token);
      try {
        await signInWithCredential(auth, credential);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  signInWithGoogle();
}, [response]);


  const loginWithEmail = async (email, password) => {
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const token = await userCredential.user.getIdToken();
      setToken(token);
      // localStorage.setItem('token', encodeURIComponent(token));
      // const res = await verifyToken(token);
      // console.log('Response from verifyToken:', res);

      // setUserId(res.userId); 
      // console.log("👉 Extracted userId:", res.userId);

      // localStorage.setItem('userId', res.userId);
        // await AsyncStorage.setItem('userId', res.data.userId.toString());
        // await AsyncStorage.setItem('token', token);
      //   const storedUserId = await AsyncStorage.getItem('userId');
      //   const storedToken = await AsyncStorage.getItem('token');
      // console.log('Stored userId:', storedUserId);
      // console.log('Stored token:', storedToken);
      //for android
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

    const registerWithEmail = async (email, password) => {
    setLoading(true);
    try {
      if (!email || !password) {
        throw new Error("Email và mật khẩu không được để trống");
      }
      if (password.length < 6) {
        throw new Error("Mật khẩu phải có ít nhất 6 ký tự");
      }

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const token = await userCredential.user.getIdToken();
      setToken(token);
      // localStorage.setItem('token', encodeURIComponent(token));

      // Return both userCredential and Firebase UID for registration
      return {
        userCredential,
        firebaseUid: userCredential.user.uid,
        token
      };
      
    } catch (err) {
      console.error("Lỗi đăng ký:", err);
      setError(err.message);
      throw err; // Re-throw để SignUpScreen có thể catch
    } finally {
      setLoading(false);
    }
  };


 const loginWithGoogle = async () => {
  if (!request) {
    setError("Google Auth Request is not ready yet.");
    return;
  }
  if (loading) return;
  
  // Không setLoading(true) trước promptAsync, để tránh cản trở
  try {
    await promptAsync();
  } catch (err) {
    setError(err.message);
  }
};


  const logout = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      setToken(null);
      setUserId(null);
      // await AsyncStorage.removeItem('userId');
      // await AsyncStorage.removeItem('token');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

   // Khi app khởi động, load userId và token từ AsyncStorage
  useEffect(() => {
    const loadStoredData = async () => {
      const storedUserId = await AsyncStorage.getItem('userId');
      const storedToken = await AsyncStorage.getItem('token');
      if (storedUserId) setUserId(storedUserId);
      if (storedToken) setToken(storedToken);
    };
    loadStoredData();
  }, []);

  const memoedValue = useMemo(
    () => ({
      user,
      loading,
      error,
      loginWithEmail,
      registerWithEmail,
      loginWithGoogle,
      logout,
      clearError,
    }),
    [user, loading, error]
  );

  return (
    <AuthContext.Provider value={memoedValue}>
      {!loadingInitial && children}
    </AuthContext.Provider>
  );
};

export default function useAuth() {
  return useContext(AuthContext);
}