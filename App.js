import "./global.css";
import { NavigationContainer } from "@react-navigation/native";
import StackNavigator from "./StackNavigator";
import { ProfileProvider } from "./app/contexts/ProfileContext";
import { AppProviders } from "./app/contexts/AppProviders";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './app/hooks/useAuth';
import { Alert } from 'react-native';
import FCMService from './services/FCMService';

export default function App() {
  useEffect(() => {
    const initFCM = async () => {
      await FCMService.requestPermission();
      await FCMService.getFCMToken();

      FCMService.listenForMessages(remoteMessage => {
        console.log('Got FCM:', remoteMessage);

        Alert.alert('📩 New Message', remoteMessage?.notification?.body || 'You have a new message!');
      });

      FCMService.listenForBackgroundMessages();
    };

    initFCM();
  }, []);
  return (
    <AppProviders>
       <NavigationContainer>
        <AuthProvider>
        <SafeAreaProvider>
          <StackNavigator />
          </SafeAreaProvider>
      </AuthProvider>
    </NavigationContainer>
    </AppProviders>
  );
}
