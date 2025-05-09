// import React, {
//   createContext,
//   useContext,
//   useState,
//   useEffect,
//   useMemo,
// } from "react";
// import {
//   GoogleAuthProvider,
//   onAuthStateChanged,
//   signInWithCredential,
//   signOut,
// } from "firebase/auth";
// import { auth } from "../../firebase";
// import * as WebBrowser from "expo-web-browser";
// import * as Google from "expo-auth-session/providers/google";

// WebBrowser.maybeCompleteAuthSession();

// const AuthContext = createContext({});

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loadingInitial, setLoadingInitial] = useState(true);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const [request, response, promptAsync] = Google.useAuthRequest({
//     androidClientId:
//       "613465939244-cdp9bpb6ajjt9rcuakkbppaimor2jcsp.apps.googleusercontent.com",
//     expoClientId:
//       "613465939244-d5cfuensgu5c9s0m7eq73p0l7petlamg.apps.googleusercontent.com",
//     scopes: ["profile", "email"],
//   });

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (user) => {
//       setUser(user || null);
//       setLoadingInitial(false);
//     });

//     return unsubscribe;
//   }, []);

//   useEffect(() => {
//     const signInWithGoogle = async () => {
//       if (response?.type === "success") {
//         const { id_token, access_token } = response.authentication;
//         const credential = GoogleAuthProvider.credential(
//           id_token,
//           access_token
//         );
//         try {
//           await signInWithCredential(auth, credential);
//         } catch (err) {
//           setError(err);
//         }
//       }
//     };

//     signInWithGoogle();
//   }, [response]);

//   const login = async () => {
//     setLoading(true);
//     await promptAsync();
//     setLoading(false);
//   };

//   const logout = () => {
//     setLoading(true);
//     signOut(auth)
//       .catch(setError)
//       .finally(() => setLoading(false));
//   };

//   const memoedValue = useMemo(
//     () => ({
//       user,
//       loading,
//       error,
//       login,
//       logout,
//     }),
//     [user, loading, error]
//   );

//   return (
//     <AuthContext.Provider value={memoedValue}>
//       {!loadingInitial && children}
//     </AuthContext.Provider>
//   );
// };

// export default function useAuth() {
//   return useContext(AuthContext);
// }
