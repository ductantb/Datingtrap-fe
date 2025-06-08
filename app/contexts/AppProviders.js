import { ProfileProvider } from "./ProfileContext";
import { TinderCardsProvider } from "./TinderCardsContext";

export const AppProviders = ({ children }) => {
  return (
    <ProfileProvider>
      <TinderCardsProvider>
        {children}
      </TinderCardsProvider>
    </ProfileProvider>
  );
};
