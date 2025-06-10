// screens/CustomerEditProfile.js
import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
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
import { updateCustomerProfile, uploadProfilePhoto } from "../../api/apiClient";
import COLORS from "../../constants/colors";
import styles from "../../constants/styles/customer/customer-edit-profile-styles";
import {
  FUEL_TYPES,
  VEHICLE_BRANDS,
  VEHICLE_MODELS,
  VEHICLE_YEARS,
} from "../../constants/vehicleData";
import useAuthStore from "../../store/useAuthStore";

// Zod Şeması Fabrikası
const createCustomerSchema = (t) =>
  z.object({
    name: z.string().min(2, t("nameMinLength")).optional(),
    phone: z
      .string()
      .regex(/^\+?\d{10,15}$/, t("invalidPhone"))
      .optional(),
    profilePhoto: z.string().optional(),
    vehicle: z.object({
      brand: z.string().nonempty(t("editProfile.errors.brandRequired")),
      model: z.string().nonempty(t("editProfile.errors.modelRequired")),
      year: z.string().nonempty(t("editProfile.errors.yearRequired")),
      fuelType: z.string().nonempty(t("editProfile.errors.fuelTypeRequired")),
    }),
  });

export default function CustomerEditProfile() {
  const router = useRouter();
  const { user, isLoading, fetchUser } = useAuthStore();
  const { t } = useTranslation();
  const [isEditable, setIsEditable] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const customerSchema = useMemo(() => createCustomerSchema(t), [t]);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      name: user?.name || "",
      phone: user?.phone || "",
      profilePhoto: user?.profilePhoto || "",
      vehicle: {
        brand: user?.vehicle?.brand || "",
        model: user?.vehicle?.model || "",
        year: user?.vehicle?.year || "",
        fuelType: user?.vehicle?.fuelType || "",
      },
    },
  });

  const pickImage = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert(
          t("editProfile.permissionRequired"),
          t("editProfile.galleryPermission")
        );
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
        setValue("profilePhoto", imageUri);
        Alert.alert(t("success"), t("editProfile.photoSelected"));
      }
    } catch (error) {
      Alert.alert(
        t("error"),
        error.message || t("editProfile.photoSelectionFailed")
      );
    }
  };

  const onSubmit = async (data) => {
    setIsSaving(true);
    try {
      let profilePhotoUrl = data.profilePhoto;
      if (profilePhotoUrl && profilePhotoUrl.startsWith("file://")) {
        const response = await uploadProfilePhoto(profilePhotoUrl);
        if (!response.profilePhoto) {
          throw new Error(t("editProfile.serverError"));
        }
        profilePhotoUrl = response.profilePhoto;
      }

      const payload = {
        ...data,
        profilePhoto: profilePhotoUrl,
        email: user.email, // E-posta sabit kalır
      };

      await updateCustomerProfile(payload);
      await fetchUser();
      Alert.alert(t("success"), t("editProfile.updateSuccess"));
      setIsEditable(false);
      router.replace("/(customer)/edit-profile");
    } catch (error) {
      Alert.alert(t("error"), error.message || t("editProfile.updateFailed"));
    } finally {
      setIsSaving(false);
    }
  };

  const handleSave = () => {
    Alert.alert(
      t("editProfile.confirmSaveTitle"),
      t("editProfile.confirmSaveMessage"),
      [
        { text: t("editProfile.cancel"), style: "cancel" },
        { text: t("editProfile.yesSave"), onPress: handleSubmit(onSubmit) },
      ],
      { cancelable: false }
    );
  };

  if (!user || isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>{t("profile.loadingProfile")}</Text>
      </View>
    );
  }

  const currentBrand = watch("vehicle.brand");

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
          onPress={isEditable ? pickImage : undefined}
          disabled={!isEditable}
          accessibilityLabel={t("editProfile.selectProfilePhoto")}
          accessibilityHint={
            isEditable ? t("editProfile.tapToSelectPhoto") : ""
          }
        >
          {watch("profilePhoto") ? (
            <Image
              source={{ uri: watch("profilePhoto") }}
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
        <Text style={styles.profileName}>
          {watch("name") || t("profile.noNameSet")}
        </Text>

        {/* Kişisel Bilgiler */}
        <Text style={styles.sectionTitle}>{t("editProfile.personalInfo")}</Text>
        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, value } }) => (
            <View style={styles.inputRow}>
              <Text style={styles.label}>{t("nameLabel")}</Text>
              <TextInput
                style={styles.inputValue}
                value={value}
                onChangeText={onChange}
                editable={isEditable}
                placeholder={t("editProfile.enterName")}
                accessibilityLabel={t("nameLabel")}
              />
            </View>
          )}
        />
        {errors.name && (
          <Text style={styles.errorText}>{errors.name.message}</Text>
        )}

        <Controller
          control={control}
          name="phone"
          render={({ field: { onChange, value } }) => (
            <View style={styles.inputRow}>
              <Text style={styles.label}>{t("phoneLabel")}</Text>
              <TextInput
                style={styles.inputValue}
                value={value}
                onChangeText={onChange}
                editable={isEditable}
                placeholder={t("editProfile.enterPhone")}
                keyboardType="phone-pad"
                accessibilityLabel={t("phoneLabel")}
              />
            </View>
          )}
        />
        {errors.phone && (
          <Text style={styles.errorText}>{errors.phone.message}</Text>
        )}

        <View style={styles.disabledInputRow}>
          <Text style={styles.label}>{t("emailLabel")}</Text>
          <Text style={styles.disabledInputValue}>
            {user.email || t("profile.noEmailSet")}
          </Text>
        </View>

        {/* Araç Bilgileri */}
        <Text style={[styles.sectionTitle, { marginTop: 24 }]}>
          {t("editProfile.vehicleInfo")}
        </Text>

        <Controller
          control={control}
          name="vehicle.brand"
          render={({ field: { onChange, value } }) => (
            <View style={styles.inputRow}>
              <Text style={styles.label}>{t("editProfile.brandLabel")}</Text>
              {isEditable ? (
                <Picker
                  selectedValue={value}
                  onValueChange={(val) => {
                    onChange(val);
                    setValue("vehicle.model", "");
                  }}
                  style={styles.picker}
                  enabled={isEditable}
                  accessibilityLabel={t("editProfile.selectBrand")}
                >
                  <Picker.Item label={t("editProfile.selectBrand")} value="" />
                  {VEHICLE_BRANDS.map((brand) => (
                    <Picker.Item key={brand} label={brand} value={brand} />
                  ))}
                </Picker>
              ) : (
                <Text style={styles.inputValue}>
                  {value || t("editProfile.noValueSet")}
                </Text>
              )}
            </View>
          )}
        />
        {errors.vehicle?.brand && (
          <Text style={styles.errorText}>{errors.vehicle.brand.message}</Text>
        )}

        <Controller
          control={control}
          name="vehicle.model"
          render={({ field: { onChange, value } }) => (
            <View style={styles.inputRow}>
              <Text style={styles.label}>{t("editProfile.modelLabel")}</Text>
              {isEditable ? (
                <Picker
                  selectedValue={value}
                  onValueChange={onChange}
                  style={[
                    styles.picker,
                    !currentBrand && styles.disabledPicker,
                  ]}
                  enabled={isEditable && !!currentBrand}
                  accessibilityLabel={t("editProfile.selectModel")}
                >
                  <Picker.Item label={t("editProfile.selectModel")} value="" />
                  {(VEHICLE_MODELS[currentBrand] || []).map((model) => (
                    <Picker.Item key={model} label={model} value={model} />
                  ))}
                </Picker>
              ) : (
                <Text style={styles.inputValue}>
                  {value || t("editProfile.noValueSet")}
                </Text>
              )}
            </View>
          )}
        />
        {errors.vehicle?.model && (
          <Text style={styles.errorText}>{errors.vehicle.model.message}</Text>
        )}

        <Controller
          control={control}
          name="vehicle.year"
          render={({ field: { onChange, value } }) => (
            <View style={styles.inputRow}>
              <Text style={styles.label}>{t("editProfile.yearLabel")}</Text>
              {isEditable ? (
                <Picker
                  selectedValue={value}
                  onValueChange={onChange}
                  style={styles.picker}
                  enabled={isEditable}
                  accessibilityLabel={t("editProfile.selectYear")}
                >
                  <Picker.Item label={t("editProfile.selectYear")} value="" />
                  {VEHICLE_YEARS.map((year) => (
                    <Picker.Item key={year} label={year} value={year} />
                  ))}
                </Picker>
              ) : (
                <Text style={styles.inputValue}>
                  {value || t("editProfile.noValueSet")}
                </Text>
              )}
            </View>
          )}
        />
        {errors.vehicle?.year && (
          <Text style={styles.errorText}>{errors.vehicle.year.message}</Text>
        )}

        <Controller
          control={control}
          name="vehicle.fuelType"
          render={({ field: { onChange, value } }) => (
            <View style={styles.inputRow}>
              <Text style={styles.label}>{t("editProfile.fuelTypeLabel")}</Text>
              {isEditable ? (
                <Picker
                  selectedValue={value}
                  onValueChange={onChange}
                  style={styles.picker}
                  enabled={isEditable}
                  accessibilityLabel={t("editProfile.selectFuelType")}
                >
                  <Picker.Item
                    label={t("editProfile.selectFuelType")}
                    value=""
                  />
                  {FUEL_TYPES.map((fuel) => (
                    <Picker.Item
                      key={fuel}
                      label={t(`editProfile.fuelTypes.${fuel}`)}
                      value={fuel}
                    />
                  ))}
                </Picker>
              ) : (
                <Text style={styles.inputValue}>
                  {value
                    ? t(`editProfile.fuelTypes.${value}`)
                    : t("editProfile.noValueSet")}
                </Text>
              )}
            </View>
          )}
        />
        {errors.vehicle?.fuelType && (
          <Text style={styles.errorText}>
            {errors.vehicle.fuelType.message}
          </Text>
        )}

        {/* Aksiyon Butonları */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: COLORS.primary }]}
            onPress={isEditable ? handleSave : () => setIsEditable(true)}
            disabled={isSaving}
            accessibilityLabel={
              isEditable ? t("editProfile.save") : t("editProfile.editProfile")
            }
          >
            {isSaving ? (
              <ActivityIndicator size="small" color={COLORS.white} />
            ) : (
              <Text style={styles.buttonText}>
                {isEditable
                  ? t("editProfile.save")
                  : t("editProfile.editProfile")}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
