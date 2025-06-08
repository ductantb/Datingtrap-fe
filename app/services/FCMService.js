
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';

class FCMService {
  async requestPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
    }
  }

  async getFCMToken() {
    try {
      const fcmToken = await messaging().getToken();
      if (fcmToken) {
        console.log('FCM Token:', fcmToken);
        await AsyncStorage.setItem('fcmToken', fcmToken);
        return fcmToken;
      } else {
        console.log('Failed to get FCM token');
        return null;
      }
    } catch (error) {
      console.error('Error getting FCM token:', error);
      return null;
    }
  }

  listenForMessages(onMessageReceived) {
    messaging().onMessage(async remoteMessage => {
      console.log('Foreground FCM message:', remoteMessage);

      if (onMessageReceived) {
        onMessageReceived(remoteMessage);
      }
    });
  }

  listenForBackgroundMessages() {
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Background FCM message:', remoteMessage);
    });
  }
}

const fcmService = new FCMService();
export default fcmService;
