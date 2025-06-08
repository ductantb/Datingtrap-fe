import "./global.css";
import { NavigationContainer } from "@react-navigation/native";
import StackNavigator from "./StackNavigator";
import { ProfileProvider } from "./app/contexts/ProfileContext";
import { AppProviders } from "./app/contexts/AppProviders";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './app/hooks/useAuth';

export default function App() {
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
