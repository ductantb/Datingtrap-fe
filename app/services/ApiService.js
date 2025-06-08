
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';


const BASE_URL = 'http://192.168.1.5:8080/api';  

class ApiService {
  constructor() {
    this.api = axios.create({
      baseURL: BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });


    this.api.interceptors.request.use(
      async (config) => {
  
        const token = await this.getAuthToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error('API Error:', error);

        if (error.response?.status === 401) {

          this.handleUnauthorized();
        }

        return Promise.reject(error);
      }
    );
  }

  async getAuthToken() {
    try {
      const token = await AsyncStorage.getItem('authToken');
      return token;
    } catch (error) {
      console.error('Error getting auth token:', error);
      return null;
    }
  }

  async setAuthToken(token) {
    try {
      await AsyncStorage.setItem('authToken', token);
    } catch (error) {
      console.error('Error setting auth token:', error);
    }
  }

  async removeAuthToken() {
    try {
      await AsyncStorage.removeItem('authToken');
    } catch (error) {
      console.error('Error removing auth token:', error);
    }
  }

  handleUnauthorized() {

    console.log('User unauthorized, redirecting to login...');

    this.removeAuthToken();

  }

  // Auth API
  async login(email, password) {
    try {
      const response = await this.api.post('/auth/login', {
        email,
        password,
      });
      const { token } = response.data;
      await this.setAuthToken(token);
      return response.data;
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  }

  async register(userData) {
    try {
      const response = await this.api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      console.error('Error registering user:', error);
      throw error;
    }
  }

  async logout() {
    await this.removeAuthToken();
  }

  // Message related API calls
  async getMessages(matchId, page = 0, size = 30) {
    try {
      const response = await this.api.get('/messages', {
        params: { matchId, page, size },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw error;
    }
  }

  // Match related API calls
  async getMatches(userId) {
    try {
      const response = await this.api.get(`/matches/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching matches:', error);
      throw error;
    }
  }

  async getConversations(userId) {
    try {
      const response = await this.api.get(`/conversations/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching conversations:', error);
      throw error;
    }
  }

  // User related API calls
  async getUserProfile(userId) {
    try {
      const response = await this.api.get(`/users/${userId}/profile`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  }

  async updateUserProfile(userId, profileData) {
    try {
      const response = await this.api.put(`/users/${userId}/profile`, profileData);
      return response.data;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }

  // Generic API call method
  async makeRequest(method, endpoint, data = null, params = null) {
    try {
      const config = {
        method,
        url: endpoint,
      };

      if (data) {
        config.data = data;
      }

      if (params) {
        config.params = params;
      }

      const response = await this.api(config);
      return response.data;
    } catch (error) {
      console.error(`Error making ${method} request to ${endpoint}:`, error);
      throw error;
    }
  }
}

// Create singleton instance
const apiService = new ApiService();
export default apiService;
