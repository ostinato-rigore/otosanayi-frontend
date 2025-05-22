// (customer)/profile.jsx
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
  deleteCustomerAccount,
  updateCustomerProfile,
  uploadProfilePhoto,
} from "../../api/apiClient";
import COLORS from "../../constants/colors";
import styles from "../../constants/styles/customer-profile-styles";
import useAuthStore from "../../store/useAuthStore";

// Validation schema
const customerSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters" })
    .optional(),
  email: z
    .string()
    .email({ message: "Invalid email address" })
    .nonempty("Email is required"),
  phone: z
    .string()
    .regex(/^\+?\d{10,15}$/, { message: "Enter a valid phone number" })
    .optional(),
  profilePhoto: z.string().optional(),
  vehicle: z
    .object({
      brand: z
        .string()
        .min(2, { message: "Brand must be at least 2 characters" })
        .optional(),
      model: z
        .string()
        .min(2, { message: "Model must be at least 2 characters" })
        .optional(),
      year: z
        .number()
        .min(1900, { message: "Year must be at least 1900" })
        .max(new Date().getFullYear() + 1, {
          message: `Year must not exceed ${new Date().getFullYear() + 1}`,
        })
        .optional(),
      fuelType: z
        .enum(["Gasoline", "Diesel", "Electric", "Hybrid", "LPG", "Other"], {
          message: "Invalid fuel type",
        })
        .optional(),
    })
    .optional(),
  reviews: z.array(z.any()).optional(),
});

export default function CustomerProfile() {
  const router = useRouter();
  const { user, isLoading, fetchUser, logout } = useAuthStore();

  const [isEditable, setIsEditable] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState(
    user
      ? {
          name: user.name || "",
          email: user.email || "",
          phone: user.phone || "",
          profilePhoto: user.profilePhoto || "",
          vehicle: {
            brand: user.vehicle?.brand || "",
            model: user.vehicle?.model || "",
            year: user.vehicle?.year || undefined,
            fuelType: user.vehicle?.fuelType || "",
          },
          reviews: user.reviews || [],
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
          profilePhoto: imageUri,
        }));
        Alert.alert("Info", "Photo selected. Save your profile to upload.");
      }
    } catch (error) {
      Alert.alert("Error", error.message || "Failed to select photo.");
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setErrors({});

    try {
      const validationResult = customerSchema.safeParse(formData);

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

      let profilePhotoUrl = formData.profilePhoto;

      if (profilePhotoUrl && profilePhotoUrl.startsWith("file://")) {
        const response = await uploadProfilePhoto(profilePhotoUrl);
        if (!response.profilePhoto) {
          throw new Error("Failed to get logo URL from server");
        }
        profilePhotoUrl = response.profilePhoto;
      }

      const payload = {
        ...formData,
        profilePhoto: profilePhotoUrl,
      };

      await updateCustomerProfile(payload);
      await fetchUser();
      Alert.alert("Success", "Profile updated successfully.");
      setIsEditable(false);
      setTimeout(() => {
        router.replace("/(customer)/profile");
      }, 0);
    } catch (error) {
      Alert.alert("Error", error.message || "Update failed");
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.replace("/(auth)");
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
              await deleteCustomerAccount();
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
            {formData.profilePhoto ? (
              <View style={styles.logoWrapper}>
                <Image
                  source={{ uri: formData.profilePhoto }}
                  style={styles.logo}
                />
                {isEditable && (
                  <Ionicons
                    name="camera"
                    size={24}
                    color={COLORS.accentCustomer}
                    style={styles.editIcon}
                  />
                )}
              </View>
            ) : (
              <View style={styles.logoPlaceholder}>
                <Text style={styles.uploadText}>Upload Photo</Text>
                {isEditable && (
                  <Ionicons
                    name="camera"
                    size={24}
                    color={COLORS.accentCustomer}
                    style={styles.editIcon}
                  />
                )}
              </View>
            )}
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Personal Information</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Name</Text>
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
              placeholder="Name"
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
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
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

        <Text style={styles.sectionTitle}>Vehicle Information</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Brand</Text>
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
              placeholder="Brand"
              placeholderTextColor={COLORS.placeholderText}
              value={formData.vehicle.brand}
              onChangeText={(val) =>
                setFormData((prev) => ({
                  ...prev,
                  vehicle: { ...prev.vehicle, brand: val },
                }))
              }
              editable={isEditable}
            />
          </View>
          {errors["vehicle.brand"] && (
            <Text style={styles.errorText}>{errors["vehicle.brand"]}</Text>
          )}
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Model</Text>
          <View style={styles.inputWrapper}>
            <Ionicons
              name="car-sport"
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
              placeholder="Model"
              placeholderTextColor={COLORS.placeholderText}
              value={formData.vehicle.model}
              onChangeText={(val) =>
                setFormData((prev) => ({
                  ...prev,
                  vehicle: { ...prev.vehicle, model: val },
                }))
              }
              editable={isEditable}
            />
          </View>
          {errors["vehicle.model"] && (
            <Text style={styles.errorText}>{errors["vehicle.model"]}</Text>
          )}
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Year</Text>
          <View style={styles.inputWrapper}>
            <Ionicons
              name="calendar"
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
              placeholder="Year"
              placeholderTextColor={COLORS.placeholderText}
              value={formData.vehicle.year ? String(formData.vehicle.year) : ""}
              onChangeText={(val) =>
                setFormData((prev) => ({
                  ...prev,
                  vehicle: {
                    ...prev.vehicle,
                    year: val ? parseInt(val) : undefined,
                  },
                }))
              }
              keyboardType="numeric"
              editable={isEditable}
            />
          </View>
          {errors["vehicle.year"] && (
            <Text style={styles.errorText}>{errors["vehicle.year"]}</Text>
          )}
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Fuel Type</Text>
          <View style={styles.inputWrapper}>
            <Ionicons
              name="flame"
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
              placeholder="Fuel Type"
              placeholderTextColor={COLORS.placeholderText}
              value={formData.vehicle.fuelType}
              onChangeText={(val) =>
                setFormData((prev) => ({
                  ...prev,
                  vehicle: { ...prev.vehicle, fuelType: val },
                }))
              }
              editable={isEditable}
            />
          </View>
          {errors["vehicle.fuelType"] && (
            <Text style={styles.errorText}>{errors["vehicle.fuelType"]}</Text>
          )}
        </View>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: COLORS.accentCustomer }]}
          onPress={() => router.push(`/(customer)/reviews`)}
        >
          <Text style={styles.buttonText}>View My Reviews</Text>
        </TouchableOpacity>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.button,
              {
                backgroundColor: isEditable
                  ? COLORS.accentCustomer
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
