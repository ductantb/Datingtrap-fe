// firebaseConfig.js
import { initializeApp } from "firebase/app"; // Hàm khởi tạo ứng dụng Firebase
import { getAuth } from "firebase/auth"; // Hàm lấy instance của Authentication
import { getFirestore } from "firebase/firestore";

// Cấu hình Firebase của dự án bạn (đã lấy từ Firebase Console)
const firebaseConfig = {
  apiKey: "AIzaSyAh4vKmUS_jIhGEAvnGsZwarDBsqtYzX38", // <<< API Key của bạn
  authDomain: "datingtrap-b25f7.firebaseapp.com",
  projectId: "datingtrap-b25f7",
  storageBucket: "datingtrap-b25f7.firebasestorage.app",
  messagingSenderId: "613465939244",
  appId: "1:613465939244:web:72caaa0961e0a9eb8de089", // <<< App ID cho ứng dụng Web
  // measurementId: "G-FD313Z9WFZ" // Có thể có hoặc không, tùy thuộc vào bạn có bật Analytics không
};

// 1. Khởi tạo ứng dụng Firebase
const app = initializeApp(firebaseConfig);

// 2. Lấy instance của Firebase Authentication
const auth = getAuth(app);

const db = getFirestore(app);

// 3. Export instance Auth để các file khác có thể sử dụng
export { auth, db };

// Bạn cũng có thể export các dịch vụ khác nếu dùng, ví dụ:
// import { getFirestore } from "firebase/firestore";
// const firestore = getFirestore(app);
// export { auth, firestore };
