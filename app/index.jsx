// Uygulamanın ana ekranı.
import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import COLORS from "../constants/colors";

export default function Index() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Main</Text>
      <Link href="/(auth)/register">Register</Link>
      <Link href="/(auth)">Login</Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // Tüm ekranı kaplar
    justifyContent: "center", // İçeriği dikeyde ortalar
    alignItems: "center", // İçeriği yatayda ortalar
  },
  text: {
    color: COLORS.textSecondary, // Metin rengi
  },
});
