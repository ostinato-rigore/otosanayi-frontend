import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { updateMechanicProfile } from "../../api/apiClient";
import COLORS from "../../constants/colors";
import styles from "../../constants/styles/mechanic-profile-styles";
import useAuthStore from "../../store/useAuthStore";

export default function MechanicProfile() {
  const router = useRouter();
  const { user, isLoading, fetchUser, logout } = useAuthStore();

  const [isEditable, setIsEditable] = useState(true);

  const [formData, setFormData] = useState({
    name: user.name || "",
    email: user.email || "",
    phone: user.phone || "",
    mechanicName: user.mechanicName || "",
    mechanicLogo: user.mechanicLogo || "",
    mechanicAddress: {
      fullAddress: user.mechanicAddress?.fullAddress || "",
      city: user.mechanicAddress?.city || "",
      district: user.mechanicAddress?.district || "",
    },
    workingHours: {
      weekdays: {
        open: user.workingHours?.weekdays?.open || "",
        close: user.workingHours?.weekdays?.close || "",
      },
      weekend: {
        open: user.workingHours?.weekend?.open || "",
        close: user.workingHours?.weekend?.close || "",
      },
    },
    website: user.website || "",
    socialMedia: {
      facebook: user.socialMedia?.facebook || "",
      instagram: user.socialMedia?.instagram || "",
      twitter: user.socialMedia?.twitter || "",
    },
    expertiseAreas: Array.isArray(user.expertiseAreas)
      ? user.expertiseAreas.join(", ")
      : user.expertiseAreas || "",
    vehicleBrands: Array.isArray(user.vehicleBrands)
      ? user.vehicleBrands.join(", ")
      : user.vehicleBrands || "",
    reviews: user.reviews || [],
    averageRating: user.averageRating || 0,
    isVerified: user.isVerified || false,
  });

  const handleSave = async () => {
    try {
      const payload = {
        ...formData,
        expertiseAreas: formData.expertiseAreas
          ? formData.expertiseAreas.split(",").map((item) => item.trim())
          : [],
        vehicleBrands: formData.vehicleBrands
          ? formData.vehicleBrands.split(",").map((item) => item.trim())
          : [],
      };
      await updateMechanicProfile(payload);
      await fetchUser();
      Alert.alert("Success", "Profile updated successfully.");
      setIsEditable(false);
    } catch (error) {
      Alert.alert("Error", error.message || "Update failed");
    }
  };

  const handleLogout = async () => {
    await logout();
    router.replace("/(auth)");
  };

  if (!formData || isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1, backgroundColor: COLORS.background }}
      keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
      >
        <View style={styles.header}>
          <TouchableOpacity style={styles.logoContainer}>
            {formData.mechanicLogo ? (
              <Image
                source={{ uri: formData.mechanicLogo }}
                style={styles.logo}
              />
            ) : (
              <View style={styles.logoPlaceholder}>
                <Text style={styles.uploadText}>Upload Logo</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.statusRow}>
          <View style={styles.verifiedBadge}>
            {formData.isVerified ? (
              <>
                <Ionicons name="checkmark-circle" size={18} color="#4CAF50" />
                <Text style={styles.verifiedText}>Verified</Text>
              </>
            ) : (
              <>
                <Ionicons name="close-circle" size={18} color={COLORS.error} />
                <Text style={[styles.verifiedText, { color: COLORS.error }]}>
                  Not Verified
                </Text>
              </>
            )}
          </View>
          <View style={styles.ratingBox}>
            <Ionicons name="star" size={18} color="#FFD700" />
            <Text style={styles.ratingText}>
              {formData.averageRating.toFixed(1)} / 5
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.reviewRow}
          onPress={() => router.push("/mechanic/reviews")}
        >
          <Ionicons
            name="chatbubble-ellipses-outline"
            size={20}
            color={COLORS.accentMechanic}
          />
          <Text style={styles.reviewText}>
            {formData.reviews.length} Reviews
          </Text>
          <Ionicons name="chevron-forward" size={20} color={COLORS.border} />
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Personal Information</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Full Name</Text>
          <View style={styles.inputWrapper}>
            <Ionicons
              name="person"
              size={20}
              color={COLORS.placeholderText}
              style={styles.inputIcon}
            />
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: isEditable
                    ? COLORS.white
                    : COLORS.inputBackground,
                },
              ]}
              placeholder="Full Name"
              placeholderTextColor={COLORS.placeholderText}
              value={formData.name}
              onChangeText={(val) =>
                setFormData((prev) => ({ ...prev, name: val }))
              }
              editable={isEditable}
            />
          </View>
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <View style={styles.inputWrapper}>
            <Ionicons
              name="mail"
              size={20}
              color={COLORS.placeholderText}
              style={styles.inputIcon}
            />
            <TextInput
              style={[
                styles.input,
                { backgroundColor: COLORS.inputBackground },
              ]}
              placeholder="Email"
              placeholderTextColor={COLORS.placeholderText}
              value={formData.email}
              editable={false}
            />
          </View>
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Phone Number</Text>
          <View style={styles.inputWrapper}>
            <Ionicons
              name="call"
              size={20}
              color={COLORS.placeholderText}
              style={styles.inputIcon}
            />
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: isEditable
                    ? COLORS.white
                    : COLORS.inputBackground,
                },
              ]}
              placeholder="Phone Number"
              placeholderTextColor={COLORS.placeholderText}
              value={formData.phone}
              onChangeText={(val) =>
                setFormData((prev) => ({ ...prev, phone: val }))
              }
              editable={isEditable}
            />
          </View>
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Garage Name</Text>
          <View style={styles.inputWrapper}>
            <Ionicons
              name="business"
              size={20}
              color={COLORS.placeholderText}
              style={styles.inputIcon}
            />
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: isEditable
                    ? COLORS.white
                    : COLORS.inputBackground,
                },
              ]}
              placeholder="Garage Name"
              placeholderTextColor={COLORS.placeholderText}
              value={formData.mechanicName}
              onChangeText={(val) =>
                setFormData((prev) => ({ ...prev, mechanicName: val }))
              }
              editable={isEditable}
            />
          </View>
        </View>

        <Text style={styles.sectionTitle}>Address</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Full Address</Text>
          <View style={styles.inputWrapper}>
            <Ionicons
              name="location"
              size={20}
              color={COLORS.placeholderText}
              style={styles.inputIcon}
            />
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: isEditable
                    ? COLORS.white
                    : COLORS.inputBackground,
                  height: 80,
                  textAlignVertical: "top",
                },
              ]}
              placeholder="Full Address"
              placeholderTextColor={COLORS.placeholderText}
              value={formData.mechanicAddress.fullAddress}
              onChangeText={(val) =>
                setFormData((prev) => ({
                  ...prev,
                  mechanicAddress: {
                    ...prev.mechanicAddress,
                    fullAddress: val,
                  },
                }))
              }
              editable={isEditable}
              multiline
              numberOfLines={3}
            />
          </View>
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>City</Text>
          <View style={styles.inputWrapper}>
            <Ionicons
              name="map"
              size={20}
              color={COLORS.placeholderText}
              style={styles.inputIcon}
            />
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: isEditable
                    ? COLORS.white
                    : COLORS.inputBackground,
                },
              ]}
              placeholder="City"
              placeholderTextColor={COLORS.placeholderText}
              value={formData.mechanicAddress.city}
              onChangeText={(val) =>
                setFormData((prev) => ({
                  ...prev,
                  mechanicAddress: { ...prev.mechanicAddress, city: val },
                }))
              }
              editable={isEditable}
            />
          </View>
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>District</Text>
          <View style={styles.inputWrapper}>
            <Ionicons
              name="navigate"
              size={20}
              color={COLORS.placeholderText}
              style={styles.inputIcon}
            />
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: isEditable
                    ? COLORS.white
                    : COLORS.inputBackground,
                },
              ]}
              placeholder="District"
              placeholderTextColor={COLORS.placeholderText}
              value={formData.mechanicAddress.district}
              onChangeText={(val) =>
                setFormData((prev) => ({
                  ...prev,
                  mechanicAddress: { ...prev.mechanicAddress, district: val },
                }))
              }
              editable={isEditable}
            />
          </View>
        </View>

        <Text style={styles.sectionTitle}>Working Hours</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Weekdays Open</Text>
          <View style={styles.inputWrapper}>
            <Ionicons
              name="time"
              size={20}
              color={COLORS.placeholderText}
              style={styles.inputIcon}
            />
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: isEditable
                    ? COLORS.white
                    : COLORS.inputBackground,
                },
              ]}
              placeholder="Weekdays Open"
              placeholderTextColor={COLORS.placeholderText}
              value={formData.workingHours.weekdays.open}
              onChangeText={(val) =>
                setFormData((prev) => ({
                  ...prev,
                  workingHours: {
                    ...prev.workingHours,
                    weekdays: { ...prev.workingHours.weekdays, open: val },
                  },
                }))
              }
              editable={isEditable}
            />
          </View>
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Weekdays Close</Text>
          <View style={styles.inputWrapper}>
            <Ionicons
              name="time"
              size={20}
              color={COLORS.placeholderText}
              style={styles.inputIcon}
            />
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: isEditable
                    ? COLORS.white
                    : COLORS.inputBackground,
                },
              ]}
              placeholder="Weekdays Close"
              placeholderTextColor={COLORS.placeholderText}
              value={formData.workingHours.weekdays.close}
              onChangeText={(val) =>
                setFormData((prev) => ({
                  ...prev,
                  workingHours: {
                    ...prev.workingHours,
                    weekdays: { ...prev.workingHours.weekdays, close: val },
                  },
                }))
              }
              editable={isEditable}
            />
          </View>
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Weekend Open</Text>
          <View style={styles.inputWrapper}>
            <Ionicons
              name="time"
              size={20}
              color={COLORS.placeholderText}
              style={styles.inputIcon}
            />
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: isEditable
                    ? COLORS.white
                    : COLORS.inputBackground,
                },
              ]}
              placeholder="Weekend Open"
              placeholderTextColor={COLORS.placeholderText}
              value={formData.workingHours.weekend.open}
              onChangeText={(val) =>
                setFormData((prev) => ({
                  ...prev,
                  workingHours: {
                    ...prev.workingHours,
                    weekend: { ...prev.workingHours.weekend, open: val },
                  },
                }))
              }
              editable={isEditable}
            />
          </View>
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Weekend Close</Text>
          <View style={styles.inputWrapper}>
            <Ionicons
              name="time"
              size={20}
              color={COLORS.placeholderText}
              style={styles.inputIcon}
            />
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: isEditable
                    ? COLORS.white
                    : COLORS.inputBackground,
                },
              ]}
              placeholder="Weekend Close"
              placeholderTextColor={COLORS.placeholderText}
              value={formData.workingHours.weekend.close}
              onChangeText={(val) =>
                setFormData((prev) => ({
                  ...prev,
                  workingHours: {
                    ...prev.workingHours,
                    weekend: { ...prev.workingHours.weekend, close: val },
                  },
                }))
              }
              editable={isEditable}
            />
          </View>
        </View>

        <Text style={styles.sectionTitle}>Social Media & Website</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Website</Text>
          <View style={styles.inputWrapper}>
            <Ionicons
              name="globe"
              size={20}
              color={COLORS.placeholderText}
              style={styles.inputIcon}
            />
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: isEditable
                    ? COLORS.white
                    : COLORS.inputBackground,
                },
              ]}
              placeholder="Website"
              placeholderTextColor={COLORS.placeholderText}
              value={formData.website}
              onChangeText={(val) =>
                setFormData((prev) => ({ ...prev, website: val }))
              }
              editable={isEditable}
            />
          </View>
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Facebook</Text>
          <View style={styles.inputWrapper}>
            <Ionicons
              name="logo-facebook"
              size={20}
              color={COLORS.placeholderText}
              style={styles.inputIcon}
            />
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: isEditable
                    ? COLORS.white
                    : COLORS.inputBackground,
                },
              ]}
              placeholder="Facebook"
              placeholderTextColor={COLORS.placeholderText}
              value={formData.socialMedia.facebook}
              onChangeText={(val) =>
                setFormData((prev) => ({
                  ...prev,
                  socialMedia: { ...prev.socialMedia, facebook: val },
                }))
              }
              editable={isEditable}
            />
          </View>
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Instagram</Text>
          <View style={styles.inputWrapper}>
            <Ionicons
              name="logo-instagram"
              size={20}
              color={COLORS.placeholderText}
              style={styles.inputIcon}
            />
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: isEditable
                    ? COLORS.white
                    : COLORS.inputBackground,
                },
              ]}
              placeholder="Instagram"
              placeholderTextColor={COLORS.placeholderText}
              value={formData.socialMedia.instagram}
              onChangeText={(val) =>
                setFormData((prev) => ({
                  ...prev,
                  socialMedia: { ...prev.socialMedia, instagram: val },
                }))
              }
              editable={isEditable}
            />
          </View>
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Twitter</Text>
          <View style={styles.inputWrapper}>
            <Ionicons
              name="logo-twitter"
              size={20}
              color={COLORS.placeholderText}
              style={styles.inputIcon}
            />
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: isEditable
                    ? COLORS.white
                    : COLORS.inputBackground,
                },
              ]}
              placeholder="Twitter"
              placeholderTextColor={COLORS.placeholderText}
              value={formData.socialMedia.twitter}
              onChangeText={(val) =>
                setFormData((prev) => ({
                  ...prev,
                  socialMedia: { ...prev.socialMedia, twitter: val },
                }))
              }
              editable={isEditable}
            />
          </View>
        </View>

        <Text style={styles.sectionTitle}>Expertise & Brands</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Expertise Areas (comma separated)</Text>
          <View style={styles.inputWrapper}>
            <Ionicons
              name="checkmark-circle-outline"
              size={20}
              color={COLORS.placeholderText}
              style={styles.inputIcon}
            />
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: isEditable
                    ? COLORS.white
                    : COLORS.inputBackground,
                },
              ]}
              placeholder="Expertise Areas (comma separated)"
              placeholderTextColor={COLORS.placeholderText}
              value={formData.expertiseAreas}
              onChangeText={(val) =>
                setFormData((prev) => ({ ...prev, expertiseAreas: val }))
              }
              editable={isEditable}
            />
          </View>
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Vehicle Brands (comma separated)</Text>
          <View style={styles.inputWrapper}>
            <Ionicons
              name="car"
              size={20}
              color={COLORS.placeholderText}
              style={styles.inputIcon}
            />
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: isEditable
                    ? COLORS.white
                    : COLORS.inputBackground,
                },
              ]}
              placeholder="Vehicle Brands (comma separated)"
              placeholderTextColor={COLORS.placeholderText}
              value={formData.vehicleBrands}
              onChangeText={(val) =>
                setFormData((prev) => ({ ...prev, vehicleBrands: val }))
              }
              editable={isEditable}
            />
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.button,
              {
                backgroundColor: isEditable
                  ? COLORS.accentMechanic
                  : COLORS.primary,
              },
            ]}
            onPress={() => (isEditable ? handleSave() : setIsEditable(true))}
          >
            <Text style={styles.buttonText}>
              {isEditable ? "Save" : "Edit Profile"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: COLORS.error }]}
            onPress={handleLogout}
          >
            <Text style={styles.buttonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
