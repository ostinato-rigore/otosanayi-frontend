import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { FUEL_TYPES, VEHICLE_BRANDS } from "../../constants/vehicleData";
import useAuthStore from "../../store/useAuthStore";

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

const DropdownSelect = ({
  label,
  value,
  options,
  onSelect,
  type,
  dropdownVisible,
  toggleDropdown,
}) => {
  const { t } = useTranslation();
  return (
    <View style={{ flex: 1 }}>
      <TouchableOpacity
        style={styles.dropdownButton}
        onPress={() => toggleDropdown(type)}
        accessibilityLabel={`${label} ${t("editProfile.selection")}`}
      >
        <Text style={styles.dropdownText}>
          {value ? t(value) : t("editProfile.select")}
        </Text>
        <Ionicons
          name={dropdownVisible === type ? "chevron-up" : "chevron-down"}
          size={20}
          color={COLORS.textPrimary}
        />
      </TouchableOpacity>
      {dropdownVisible === type && (
        <View style={styles.dropdownContainer}>
          <ScrollView style={styles.dropdownScroll} nestedScrollEnabled>
            <TouchableOpacity
              style={styles.dropdownItem}
              onPress={() => {
                onSelect("");
                toggleDropdown(null);
              }}
            >
              <Text style={styles.dropdownItemText}>
                {t("editProfile.select")}
              </Text>
            </TouchableOpacity>
            {options.map((option) => (
              <TouchableOpacity
                key={option}
                style={styles.dropdownItem}
                onPress={() => {
                  onSelect(option);
                  toggleDropdown(null);
                }}
              >
                <Text style={styles.dropdownItemText}>{t(option)}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

export default function CustomerEditProfile() {
  const router = useRouter();
  const { user, isLoading, fetchUser } = useAuthStore();
  const { t } = useTranslation();
  const [isEditable, setIsEditable] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(null);

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
        year: user?.vehicle?.year ? String(user.vehicle.year) : "",
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
        email: user.email,
        vehicle: {
          ...data.vehicle,
          year: data.vehicle.year ? Number(data.vehicle.year) : undefined, // Backend için sayıya çevir
        },
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

  const toggleDropdown = (type) => {
    setDropdownVisible(dropdownVisible === type ? null : type);
  };

  if (!user || isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>{t("profile.loadingProfile")}</Text>
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

        {/* Kişisel Bilgiler - White Card */}
        <View style={styles.cardContainer}>
          <Text style={styles.sectionTitle}>
            {t("editProfile.personalInfo")}
          </Text>
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
        </View>

        {/* Araç Bilgileri - White Card */}
        <View style={[styles.cardContainer, { marginTop: 24 }]}>
          <Text style={styles.sectionTitle}>
            {t("editProfile.vehicleInfo")}
          </Text>

          <Controller
            control={control}
            name="vehicle.brand"
            render={({ field: { onChange, value } }) => (
              <View style={styles.inputRow}>
                <Text style={styles.label}>{t("editProfile.brandLabel")}</Text>
                {isEditable ? (
                  <DropdownSelect
                    label={t("editProfile.brandLabel")}
                    value={value}
                    options={VEHICLE_BRANDS}
                    onSelect={(val) => {
                      onChange(val);
                      setValue("vehicle.model", "");
                    }}
                    type="brand"
                    dropdownVisible={dropdownVisible}
                    toggleDropdown={toggleDropdown}
                  />
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
                  <TextInput
                    style={styles.inputValue}
                    value={value}
                    onChangeText={onChange}
                    editable={isEditable}
                    placeholder={t("editProfile.enterModel")}
                    accessibilityLabel={t("editProfile.modelLabel")}
                  />
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
                  <TextInput
                    style={styles.inputValue}
                    value={value ? String(value) : ""} // Değeri string'e çevir
                    onChangeText={(text) => onChange(text)} // Girdiyi string olarak işle
                    editable={isEditable}
                    placeholder={t("editProfile.enterYear")}
                    keyboardType="numeric"
                    accessibilityLabel={t("editProfile.yearLabel")}
                  />
                ) : (
                  <Text style={styles.inputValue}>
                    {value || t("editProfile.noValueSet")}
                  </Text>
                )}
              </View>
            )}
          />

          <Controller
            control={control}
            name="vehicle.fuelType"
            render={({ field: { onChange, value } }) => (
              <View style={styles.inputRow}>
                <Text style={styles.label}>
                  {t("editProfile.fuelTypeLabel")}
                </Text>
                {isEditable ? (
                  <DropdownSelect
                    label={t("editProfile.fuelTypeLabel")}
                    value={value}
                    options={FUEL_TYPES}
                    onSelect={onChange}
                    type="fuelType"
                    dropdownVisible={dropdownVisible}
                    toggleDropdown={toggleDropdown}
                  />
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
        </View>

        {/* Aksiyon Butonları */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: COLORS.accentCustomer }]}
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
