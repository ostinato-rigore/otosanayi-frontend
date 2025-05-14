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

  return (
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
  );
}
