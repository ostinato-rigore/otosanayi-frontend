import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { Text, TouchableOpacity, View } from "react-native";
import styles from "../../constants/styles/auth/splash-styles";

export default function Index() {
  const router = useRouter();
  const { t } = useTranslation();

  const handleCustomer = () => {
    router.push({
      pathname: "/(auth)/login",
      params: { userType: "Customer" },
    });
  };

  const handleMechanic = () => {
    router.push({
      pathname: "/(auth)/register",
      params: { userType: "Mechanic" },
    });
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/logo.png")}
        style={styles.logo}
        contentFit="contain"
      />
      <Text style={styles.title}>{t("welcomeTitle")}</Text>

      <Text style={styles.subtitle}>{t("subtitle")}</Text>

      <TouchableOpacity
        style={[styles.button, styles.customerButton]}
        onPress={handleCustomer}
      >
        <Text style={styles.buttonText}>{t("continueAsCustomer")}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.mechanicButton]}
        onPress={handleMechanic}
      >
        <Text style={styles.buttonText}>{t("registerAsMechanic")}</Text>
      </TouchableOpacity>
    </View>
  );
}
