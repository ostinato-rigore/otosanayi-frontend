import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
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
import { z } from "zod";
import {
  deleteMechanicAccount,
  updateMechanicProfile,
  uploadMechanicLogo,
} from "../../api/apiClient";
import COLORS from "../../constants/colors";
import styles from "../../constants/styles/mechanic-profile-styles";
import useAuthStore from "../../store/useAuthStore";

// Validation schema
const profileSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Full name must be at least 2 characters" })
    .nonempty("Full name is required"),
  phone: z
    .string()
    .regex(/^\+?\d{10,15}$/, { message: "Enter a valid phone number" })
    .nonempty("Phone number is required"),
  mechanicName: z
    .string()
    .min(2, { message: "Garage name must be at least 2 characters" })
    .nonempty("Garage name is required"),
  mechanicAddress: z.object({
    fullAddress: z
      .string()
      .min(5, { message: "Full address must be at least 5 characters" })
      .nonempty("Full address is required"),
    city: z
      .string()
      .min(2, { message: "City must be at least 2 characters" })
      .nonempty("City is required"),
    district: z
      .string()
      .min(2, { message: "District must be at least 2 characters" })
      .nonempty("District is required"),
  }),
  workingHours: z.object({
    weekdays: z.object({
      open: z
        .string()
        .regex(/^(?:[01]\d|2[0-3]):[0-5]\d$/, {
          message: "Weekdays open time must be in HH:MM format (e.g., 09:00)",
        })
        .nonempty("Weekdays open time is required"),
      close: z
        .string()
        .regex(/^(?:[01]\d|2[0-3]):[0-5]\d$/, {
          message: "Weekdays close time must be in HH:MM format (e.g., 17:00)",
        })
        .nonempty("Weekdays close time is required"),
    }),
    weekend: z.object({
      open: z
        .string()
        .regex(/^(?:[01]\d|2[0-3]):[0-5]\d$/, {
          message: "Weekend open time must be in HH:MM format (e.g., 10:00)",
        })
        .nonempty("Weekend open time is required"),
      close: z
        .string()
        .regex(/^(?:[01]\d|2[0-3]):[0-5]\d$/, {
          message: "Weekend close time must be in HH:MM format (e.g., 16:00)",
        })
        .nonempty("Weekend close time is required"),
    }),
  }),
  website: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-]*)*$/.test(val),
      { message: "Enter a valid URL (e.g., https://example.com)" }
    ),
  socialMedia: z.object({
    facebook: z
      .string()
      .optional()
      .refine(
        (val) =>
          !val || /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-]*)*$/.test(val),
        { message: "Enter a valid Facebook URL" }
      ),
    instagram: z
      .string()
      .optional()
      .refine(
        (val) =>
          !val || /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-]*)*$/.test(val),
        { message: "Enter a valid Instagram URL" }
      ),
    twitter: z
      .string()
      .optional()
      .refine(
        (val) =>
          !val || /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-]*)*$/.test(val),
        { message: "Enter a valid Twitter URL" }
      ),
  }),
  expertiseAreas: z
    .string()
    .min(2, { message: "Expertise areas must be at least 2 characters" })
    .nonempty("Expertise areas are required"),
  vehicleBrands: z
    .string()
    .min(2, { message: "Vehicle brands must be at least 2 characters" })
    .nonempty("Vehicle brands are required"),
});

export default function MechanicProfile() {
  const router = useRouter();
  const { user, isLoading, fetchUser, logout } = useAuthStore();

  const [isEditable, setIsEditable] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState(
    user
      ? {
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
        }
      : null
  );

  const pickImage = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert("Permission required", "Gallery access is required.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "images",
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });

      if (!result.canceled) {
        const imageUri = result.assets[0].uri;
        setFormData((prev) => ({
          ...prev,
          mechanicLogo: imageUri,
        }));
        Alert.alert("Info", "Photo selected. Save your profile to upload.");
      }
    } catch (error) {
      Alert.alert("Error", error.message || "Failed to select photo.");
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setErrors({}); // Önceki hataları temizle

    try {
      // Form verilerini şemaya göre doğrula
      const validationResult = profileSchema.safeParse(formData);

      if (!validationResult.success) {
        const errorMessages = {};
        validationResult.error.errors.forEach((error) => {
          const path = error.path.join(".");
          errorMessages[path] = error.message;
        });
        setErrors(errorMessages);
        setIsSaving(false);
        Alert.alert("Validation Error", "Please fix the errors in the form.");
        return;
      }

      let mechanicLogoUrl = formData.mechanicLogo;

      if (mechanicLogoUrl && mechanicLogoUrl.startsWith("file://")) {
        const response = await uploadMechanicLogo(mechanicLogoUrl);
        if (!response.mechanicLogo) {
          throw new Error("Failed to get logo URL from server");
        }
        mechanicLogoUrl = response.mechanicLogo;
      }

      const payload = {
        ...formData,
        mechanicLogo: mechanicLogoUrl,
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
      router.replace("/(mechanic)/profile");
    } catch (error) {
      if (error.message.includes("Failed to upload logo")) {
        Alert.alert("Error", "Failed to upload logo. Please try again.");
      } else {
        Alert.alert("Error", error.message || "Update failed");
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete your account? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteMechanicAccount();
              await logout();
              router.replace("/(auth)");
              Alert.alert("Success", "Account deleted successfully.");
            } catch (error) {
              Alert.alert("Error", error.message || "Failed to delete account");
            }
          },
        },
      ]
    );
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
          <TouchableOpacity
            style={styles.logoContainer}
            onPress={isEditable ? pickImage : null}
            disabled={!isEditable}
          >
            {formData.mechanicLogo ? (
              <View style={styles.logoWrapper}>
                <Image
                  source={{ uri: formData.mechanicLogo }}
                  style={styles.logo}
                />
                {isEditable && (
                  <Ionicons
                    name="camera"
                    size={24}
                    color={COLORS.accentMechanic}
                    style={styles.editIcon}
                  />
                )}
              </View>
            ) : (
              <View style={styles.logoPlaceholder}>
                <Text style={styles.uploadText}>Upload Logo</Text>
                {isEditable && (
                  <Ionicons
                    name="camera"
                    size={24}
                    color={COLORS.accentMechanic}
                    style={styles.editIcon}
                  />
                )}
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
          {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
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
          {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
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
          {errors.mechanicName && (
            <Text style={styles.errorText}>{errors.mechanicName}</Text>
          )}
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
          {errors["mechanicAddress.fullAddress"] && (
            <Text style={styles.errorText}>
              {errors["mechanicAddress.fullAddress"]}
            </Text>
          )}
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
          {errors["mechanicAddress.city"] && (
            <Text style={styles.errorText}>
              {errors["mechanicAddress.city"]}
            </Text>
          )}
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
          {errors["mechanicAddress.district"] && (
            <Text style={styles.errorText}>
              {errors["mechanicAddress.district"]}
            </Text>
          )}
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
              placeholder="Weekdays Open (e.g., 09:00)"
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
          {errors["workingHours.weekdays.open"] && (
            <Text style={styles.errorText}>
              {errors["workingHours.weekdays.open"]}
            </Text>
          )}
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
              placeholder="Weekdays Close (e.g., 17:00)"
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
          {errors["workingHours.weekdays.close"] && (
            <Text style={styles.errorText}>
              {errors["workingHours.weekdays.close"]}
            </Text>
          )}
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
              placeholder="Weekend Open (e.g., 10:00)"
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
          {errors["workingHours.weekend.open"] && (
            <Text style={styles.errorText}>
              {errors["workingHours.weekend.open"]}
            </Text>
          )}
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
              placeholder="Weekend Close (e.g., 16:00)"
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
          {errors["workingHours.weekend.close"] && (
            <Text style={styles.errorText}>
              {errors["workingHours.weekend.close"]}
            </Text>
          )}
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
              placeholder="Website (e.g., https://example.com)"
              placeholderTextColor={COLORS.placeholderText}
              value={formData.website}
              onChangeText={(val) =>
                setFormData((prev) => ({ ...prev, website: val }))
              }
              editable={isEditable}
            />
          </View>
          {errors.website && (
            <Text style={styles.errorText}>{errors.website}</Text>
          )}
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
              placeholder="Facebook URL"
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
          {errors["socialMedia.facebook"] && (
            <Text style={styles.errorText}>
              {errors["socialMedia.facebook"]}
            </Text>
          )}
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
              placeholder="Instagram URL"
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
          {errors["socialMedia.instagram"] && (
            <Text style={styles.errorText}>
              {errors["socialMedia.instagram"]}
            </Text>
          )}
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
              placeholder="Twitter URL"
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
          {errors["socialMedia.twitter"] && (
            <Text style={styles.errorText}>
              {errors["socialMedia.twitter"]}
            </Text>
          )}
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
          {errors.expertiseAreas && (
            <Text style={styles.errorText}>{errors.expertiseAreas}</Text>
          )}
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
          {errors.vehicleBrands && (
            <Text style={styles.errorText}>{errors.vehicleBrands}</Text>
          )}
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
            disabled={isSaving}
          >
            {isSaving ? (
              <ActivityIndicator size="small" color={COLORS.white} />
            ) : (
              <Text style={styles.buttonText}>
                {isEditable ? "Save" : "Edit Profile"}
              </Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: COLORS.error }]}
            onPress={handleLogout}
          >
            <Text style={styles.buttonText}>Logout</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: COLORS.error }]}
            onPress={handleDeleteAccount}
          >
            <Text style={styles.buttonText}>Delete Account</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
