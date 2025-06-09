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
import styles from "../../constants/styles/customer-edit-profile-styles";
import useAuthStore from "../../store/useAuthStore";

const customerSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().nonempty(),
  phone: z
    .string()
    .regex(/^\+?\d{10,15}$/)
    .optional(),
  profilePhoto: z.string().optional(),
  vehicle: z
    .object({
      brand: z.string().min(2).optional(),
      model: z.string().min(2).optional(),
      year: z
        .number()
        .min(1900)
        .max(new Date().getFullYear() + 1)
        .optional(),
      fuelType: z
        .enum(["Gasoline", "Diesel", "Electric", "Hybrid", "LPG", "Other"])
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
        { text: "Cancel", style: "cancel" },
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
        <TouchableOpacity
          style={styles.profileImageContainer}
          onPress={isEditable ? pickImage : null}
          disabled={!isEditable}
        >
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
          {isEditable && (
            <Ionicons
              name="camera"
              size={18}
              color={COLORS.accentCustomer}
              style={styles.cameraIcon}
            />
          )}
        </TouchableOpacity>
        <Text style={styles.profileName}>{formData.name || "No Name Set"}</Text>

        {/* Personal Info */}
        <Text style={styles.sectionTitle}>Personal Info</Text>
        {renderInputRow("Name", formData.name, (val) =>
          setFormData((prev) => ({ ...prev, name: val }))
        )}
        {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

        {renderInputRow("Phone", formData.phone, (val) =>
          setFormData((prev) => ({ ...prev, phone: val }))
        )}

        {renderInputRow("Email", formData.email, null, false)}

        {/* Vehicle Info */}
        <Text style={[styles.sectionTitle, { marginTop: 24 }]}>
          Vehicle Info
        </Text>
        {renderInputRow("Brand", formData.vehicle.brand, (val) =>
          setFormData((prev) => ({
            ...prev,
            vehicle: { ...prev.vehicle, brand: val },
          }))
        )}

        {renderInputRow("Model", formData.vehicle.model, (val) =>
          setFormData((prev) => ({
            ...prev,
            vehicle: { ...prev.vehicle, model: val },
          }))
        )}

        {renderInputRow(
          "Year",
          formData.vehicle.year ? String(formData.vehicle.year) : "",
          (val) =>
            setFormData((prev) => ({
              ...prev,
              vehicle: {
                ...prev.vehicle,
                year: val ? parseInt(val) : undefined,
              },
            }))
        )}

        {renderInputRow("Fuel Type", formData.vehicle.fuelType, (val) =>
          setFormData((prev) => ({
            ...prev,
            vehicle: { ...prev.vehicle, fuelType: val },
          }))
        )}

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: COLORS.primary }]}
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
            style={[styles.button, { backgroundColor: COLORS.secondary }]}
            onPress={() => router.push(`/(customer)/reviews`)}
          >
            <Text style={styles.buttonText}>My Reviews</Text>
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

  function renderInputRow(label, value, onChange, editable = isEditable) {
    return (
      <View style={styles.inputRow}>
        <Text style={styles.label}>{label}</Text>
        {editable ? (
          <TextInput
            style={styles.inputValue}
            value={value}
            onChangeText={onChange}
            editable={editable}
            placeholder={`Enter ${label.toLowerCase()}`}
          />
        ) : (
          <Text style={styles.inputValue}>{value}</Text>
        )}
      </View>
    );
  }
}
