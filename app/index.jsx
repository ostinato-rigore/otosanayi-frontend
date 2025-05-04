// Uygulamanın ana ekranı (app/index.jsx)
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import styles from "../constants/styles/splash-styles";

export default function Index() {
  const router = useRouter();

  const handleCustomer = () => {
    router.push({ pathname: "/(auth)", params: { userType: "Customer" } });
  };

  const handleMechanic = () => {
    router.push({ pathname: "/(auth)", params: { userType: "Mechanic" } });
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/images/logo.png")}
        style={styles.logo}
        contentFit="contain"
      />

      <Text style={styles.title}>Welcome to Otosanayi</Text>

      <Text style={styles.subtitle}>
        Find the best auto repair shops or join as one!
      </Text>

      <TouchableOpacity
        style={[styles.button, styles.customerButton]}
        onPress={handleCustomer}
      >
        <Text style={styles.buttonText}>Continue as Customer</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.mechanicButton]}
        onPress={handleMechanic}
      >
        <Text style={styles.buttonText}>Continue as Auto Mechanic</Text>
      </TouchableOpacity>
    </View>
  );
}
