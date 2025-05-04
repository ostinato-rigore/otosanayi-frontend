// app/_layout.jsx: Uygulamanın root navigasyon yapısını tanımlar.
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import SafeScreen from "../components/layout/SafeScreen"; // SafeScreen bileşeni, ekranın güvenli alanını ayarlar ve arka plan rengini belirler

export default function RootLayout() {
  return (
    // SafeAreaProvider iPhone çentiklerine göre güvenli alan sağlar.
    <SafeAreaProvider>
      {/* SafeScreen bileşeni, ekranın güvenli alanını ayarlar ve arka plan rengini belirler */}
      <SafeScreen>
        {/* Stack bileşeni, uygulamanın navigasyon yapısını tanımlar */}
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="(auth)" />
        </Stack>
      </SafeScreen>
      <StatusBar style="dark" />
    </SafeAreaProvider>
  );
}
