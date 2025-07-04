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
import styles from "../../constants/styles/customer/customer-profile-styles";
import useAuthStore from "../../store/useAuthStore";

export default function Profile() {
  const router = useRouter();
  const { user, isLoading } = useAuthStore();
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    profilePhoto: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        profilePhoto: user.profilePhoto || "",
      });
    }
  }, [user]);

  const handleLogout = async () => {
    await useAuthStore.getState().logout();
    router.replace("/(auth)");
  };

  const handleEditProfile = () => {
    router.push("/(customer)/edit-profile");
  };

  const handleMyReviews = () => {
    router.push("/(customer)/reviews");
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>{t("profile.loadingProfile")}</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
      >
        <View style={styles.card}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.profileImageContainer}>
              {formData.profilePhoto ? (
                <Image
                  source={{ uri: formData.profilePhoto }}
                  style={styles.profileImage}
                />
              ) : (
                <View style={styles.profilePlaceholder}>
                  <Ionicons
                    name="person"
                    size={50}
                    color={COLORS.placeholderText}
                  />
                </View>
              )}
            </TouchableOpacity>

            <View style={styles.profileInfo}>
              <Text style={styles.name}>
                {formData.name || t("profile.noNameSet")}
              </Text>
              <Text style={styles.email}>
                {formData.email || t("profile.noEmailSet")}
              </Text>
            </View>
          </View>

          <View style={styles.menuContainer}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={handleEditProfile}
              accessible
              accessibilityLabel={t("profile.myProfile")}
            >
              <Ionicons
                name="person-outline"
                size={20}
                color={COLORS.textPrimary}
              />
              <Text style={styles.menuItemText}>{t("profile.myProfile")}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={handleMyReviews}
              accessible
              accessibilityLabel={t("profile.myReviews")}
            >
              <Ionicons
                name="star-outline"
                size={20}
                color={COLORS.textPrimary}
              />
              <Text style={styles.menuItemText}>{t("profile.myReviews")}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.spacer} />
          <View style={styles.logoutContainer}>
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={handleLogout}
              accessible
              accessibilityLabel={t("profile.logout")}
            >
              <Ionicons name="log-out-outline" size={20} color={COLORS.error} />
              <Text style={styles.logoutButtonText}>{t("profile.logout")}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
