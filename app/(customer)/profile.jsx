import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
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
        <Text style={styles.loadingText}>Loading profile...</Text>
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
            <Text style={styles.name}>{formData.name || "No Name Set"}</Text>
            <Text style={styles.email}>{formData.email || "No Email Set"}</Text>
          </View>
        </View>

        {/* Menü */}
        <View style={styles.menuContainer}>
          <TouchableOpacity style={styles.menuItem} onPress={handleEditProfile}>
            <Ionicons
              name="person-outline"
              size={20}
              color={COLORS.textPrimary}
            />
            <Text style={styles.menuItemText}>My Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={handleMyReviews}>
            <Ionicons
              name="star-outline"
              size={20}
              color={COLORS.textPrimary}
            />
            <Text style={styles.menuItemText}>My Reviews</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Logout en alta sabit */}
      <View style={styles.logoutContainer}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color={COLORS.error} />
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
