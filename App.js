import "./global.css";
import { NavigationContainer } from "@react-navigation/native";
import StackNavigator from "./StackNavigator";
import { ProfileProvider } from "./app/contexts/ProfileContext";

export default function App() {
  return (
    <ProfileProvider>
      <NavigationContainer>
        <StackNavigator />
      </NavigationContainer>
    </ProfileProvider> 
  );
}
