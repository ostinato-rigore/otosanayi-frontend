import { useFonts } from "expo-font";
import { SplashScreen, Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { Platform, Text } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import SafeScreen from "../components/layout/SafeScreen";
import useAuthStore from "../store/useAuthStore";

// i18n setup
import { I18nextProvider } from "react-i18next";
import i18n from "../config/i18n";

SplashScreen.preventAutoHideAsync();

const platformFont = Platform.select({
  ios: "System",
  android: "Roboto",
  default: "Inter-Medium",
});

export default function RootLayout() {
  const router = useRouter();
  const { isAuthenticated, userType, fetchUser, isLoading } = useAuthStore();
  const [isMounted, setIsMounted] = useState(false);

  const [fontsLoaded] = useFonts({
    InterMedium: require("../assets/fonts/Inter-Medium.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded) {
      Text.defaultProps = Text.defaultProps || {};
      Text.defaultProps.style = [{ fontFamily: platformFont }];
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    if (!isMounted || isLoading) return;

    if (isAuthenticated) {
      if (userType?.toLowerCase() === "customer") {
        router.replace("/(customer)/home");
      } else if (userType?.toLowerCase() === "mechanic") {
        router.replace("/(mechanic)/home");
      }
    }
  }, [isAuthenticated, userType, isLoading, isMounted, router]);

  if (!fontsLoaded) return null;

  return (
    <I18nextProvider i18n={i18n}>
      <SafeAreaProvider>
        <SafeScreen>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(customer)" />
            <Stack.Screen name="(mechanic)" />
          </Stack>
        </SafeScreen>
        <StatusBar style="dark" />
      </SafeAreaProvider>
    </I18nextProvider>
  );
}
