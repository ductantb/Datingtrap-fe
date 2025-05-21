import "./global.css";
import { NavigationContainer } from "@react-navigation/native";
import StackNavigator from "./StackNavigator";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './app/hooks/useAuth';

export default function App() {
  return (
     <NavigationContainer>
      <AuthProvider>
        <SafeAreaProvider>
          <StackNavigator />
        </SafeAreaProvider>
      </AuthProvider>
    </NavigationContainer>
  );
}
