import axios from "axios";


const API_BASE_URL = "http://localhost:8080"; 

// Hàm verify token
export const verifyToken = async (token) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/auth/verify`, {
      token,
    });
    return response.data;
  } catch (error) {
    console.error("❌ Error verifying token:", error.response?.data || error.message);
    throw error;
  }
};

export const registerUserProfile = async (signUpData) => {
  try {

    const response = await axios.post(
      `${API_BASE_URL}/api/auth/register`,
      signUpData,
    );

    return response.data;
  } catch (error) {
    console.error("❌ Register API Error:", error.response?.data || error.message);
    throw error;
  }
};