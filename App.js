import "./global.css";
import { NavigationContainer } from "@react-navigation/native";
import StackNavigator from "./StackNavigator";
import { AppProviders } from "./app/contexts/AppProviders";

export default function App() {
  return (
    <AppProviders>
      <NavigationContainer>
        <StackNavigator />
      </NavigationContainer>
    </AppProviders>
  );
}
