import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import COLORS from "../../constants/colors";
import styles from "../../constants/styles/mechanic/mechanic-profile-styles";
import useAuthStore from "../../store/useAuthStore";

export default function MechanicProfile() {
  const router = useRouter();
  const { user, isLoading } = useAuthStore();
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mechanicLogo: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        mechanicLogo: user.mechanicLogo || "",
      });
    }
  }, [user]);

  const handleLogout = async () => {
    await useAuthStore.getState().logout();
    router.replace("/(auth)");
  };

  const handleEditProfile = () => {
    router.push("/(mechanic)/edit-profile");
  };

  const handleCustomerReviews = () => {
    router.push("/(mechanic)/reviews");
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>
          {t("mechanicProfile.loadingProfile")}
        </Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
      >
        <View style={styles.header}>
          <TouchableOpacity style={styles.profileImageContainer}>
            {formData.mechanicLogo ? (
              <Image
                source={{ uri: formData.mechanicLogo }}
                style={styles.profileImage}
              />
            ) : (
              <View style={styles.profilePlaceholder}>
                <Ionicons
                  name="business-outline"
                  size={50}
                  color={COLORS.placeholderText}
                />
              </View>
            )}
          </TouchableOpacity>

          <View style={styles.profileInfo}>
            <Text style={styles.name}>
              {formData.name || t("mechanicProfile.noNameSet")}
            </Text>
            <Text style={styles.email}>
              {formData.email || t("mechanicProfile.noEmailSet")}
            </Text>
          </View>
        </View>

        {/* Menü */}
        <View style={styles.menuContainer}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={handleEditProfile}
            accessible
            accessibilityLabel={t("mechanicProfile.myProfile")}
          >
            <Ionicons
              name="person-outline"
              size={20}
              color={COLORS.textPrimary}
            />
            <Text style={styles.menuItemText}>
              {t("mechanicProfile.myProfile")}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={handleCustomerReviews}
            accessible
            accessibilityLabel={t("mechanicProfile.customerReviews")}
          >
            <Ionicons
              name="chatbubble-outline"
              size={20}
              color={COLORS.textPrimary}
            />
            <Text style={styles.menuItemText}>
              {t("mechanicProfile.customerReviews")}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Logout en alta sabit */}
      <View style={styles.logoutContainer}>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          accessible
          accessibilityLabel={t("mechanicProfile.logout")}
        >
          <Ionicons name="log-out-outline" size={20} color={COLORS.error} />
          <Text style={styles.logoutButtonText}>
            {t("mechanicProfile.logout")}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
