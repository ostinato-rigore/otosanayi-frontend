import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import SafeScreen from "../components/layout/SafeScreen";
import useAuthStore from "../store/useAuthStore";

export default function RootLayout() {
  const router = useRouter();
  const { isAuthenticated, userType, fetchUser, isLoading } = useAuthStore();
  const [isMounted, setIsMounted] = useState(false);

  // Ensure the component is mounted before attempting navigation
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Fetch user data on mount
  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  // Handle navigation after user data is fetched and component is mounted
  useEffect(() => {
    if (!isMounted || isLoading) return;

    if (isAuthenticated) {
      router.replace(`/(usertype)/${userType.toLowerCase()}/home`);
    } else {
      router.replace("/(auth)");
    }
  }, [isAuthenticated, userType, isLoading, isMounted, router]);

  return (
    <SafeAreaProvider>
      <SafeScreen>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(usertype)" />
        </Stack>
      </SafeScreen>
      <StatusBar style="dark" />
    </SafeAreaProvider>
  );
}
