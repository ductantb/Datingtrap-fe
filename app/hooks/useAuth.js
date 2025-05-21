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

WebBrowser.maybeCompleteAuthSession();

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId: "384266278181-s77f8l25qdau0231uqc73uca5vtjgeop.apps.googleusercontent.com",
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
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user || null);
      setLoadingInitial(false);
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
      await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

    // Lấy ID token
    const token = await user.getIdToken();
    console.log("User ID token:", token);
    Alert.alert("Token", token)
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const registerWithEmail = async (email, password) => {
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setError(err.message);
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


  const logout = () => {
    setLoading(true);
    signOut(auth)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  const clearError = () => setError(null);

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