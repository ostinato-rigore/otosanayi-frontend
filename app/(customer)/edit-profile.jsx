// screens/CustomerEditProfile.js
import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
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

// Zod Şeması
const customerSchema = z.object({
  name: z.string().min(2, "İsim en az 2 karakter olmalı").optional(),
  phone: z
    .string()
    .regex(/^\+?\d{10,15}$/, "Geçerli bir telefon numarası girin")
    .optional(),
  profilePhoto: z.string().optional(),
  vehicle: z.object({
    brand: z.string().nonempty("Araç markası zorunlu"),
    model: z.string().nonempty("Araç modeli zorunlu"),
    year: z.string().nonempty("Araç yılı zorunlu"),
    fuelType: z.string().nonempty("Yakıt türü zorunlu"),
  }),
});

export default function CustomerEditProfile() {
  const router = useRouter();
  const { user, isLoading, fetchUser } = useAuthStore();
  const [isEditable, setIsEditable] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

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
        Alert.alert("İzin gerekli", "Galeri erişimi için izin gerekiyor.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });

      if (!result.canceled) {
        const imageUri = result.assets[0].uri;
        setValue("profilePhoto", imageUri);
        Alert.alert(
          "Bilgi",
          "Fotoğraf seçildi. Profili kaydetmek için kaydedin."
        );
      }
    } catch (error) {
      Alert.alert("Hata", error.message || "Fotoğraf seçilemedi.");
    }
  };

  const onSubmit = async (data) => {
    setIsSaving(true);
    try {
      let profilePhotoUrl = data.profilePhoto;
      if (profilePhotoUrl && profilePhotoUrl.startsWith("file://")) {
        const response = await uploadProfilePhoto(profilePhotoUrl);
        if (!response.profilePhoto) {
          throw new Error("Sunucudan logo URL'si alınamadı");
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
      Alert.alert("Başarılı", "Profil başarıyla güncellendi.");
      setIsEditable(false);
      router.replace("/(customer)/edit-profile");
    } catch (error) {
      Alert.alert("Hata", error.message || "Güncelleme başarısız");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSave = () => {
    Alert.alert(
      "Kaydetmeyi Onayla",
      "Değişiklikleri kaydetmek istediğinizden emin misiniz?",
      [
        { text: "İptal", style: "cancel" },
        { text: "Evet, Kaydet", onPress: handleSubmit(onSubmit) },
      ],
      { cancelable: false }
    );
  };

  if (!user || isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Profil yükleniyor...</Text>
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
          accessibilityLabel="Profil fotoğrafı seç"
          accessibilityHint={isEditable ? "Fotoğraf seçmek için dokunun" : ""}
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
          {watch("name") || "İsim Belirtilmemiş"}
        </Text>

        {/* Kişisel Bilgiler */}
        <Text style={styles.sectionTitle}>Kişisel Bilgiler</Text>
        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, value } }) => (
            <View style={styles.inputRow}>
              <Text style={styles.label}>İsim</Text>
              <TextInput
                style={styles.inputValue}
                value={value}
                onChangeText={onChange}
                editable={isEditable}
                placeholder="İsim girin"
                accessibilityLabel="İsim"
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
              <Text style={styles.label}>Telefon</Text>
              <TextInput
                style={styles.inputValue}
                value={value}
                onChangeText={onChange}
                editable={isEditable}
                placeholder="Telefon girin"
                keyboardType="phone-pad"
                accessibilityLabel="Telefon numarası"
              />
            </View>
          )}
        />
        {errors.phone && (
          <Text style={styles.errorText}>{errors.phone.message}</Text>
        )}

        <View style={styles.disabledInputRow}>
          <Text style={styles.label}>E-posta</Text>
          <Text style={styles.disabledInputValue}>
            {user.email || "Belirtilmemiş"}
          </Text>
        </View>

        {/* Araç Bilgileri */}
        <Text style={[styles.sectionTitle, { marginTop: 24 }]}>
          Araç Bilgileri
        </Text>

        <Controller
          control={control}
          name="vehicle.brand"
          render={({ field: { onChange, value } }) => (
            <View style={styles.inputRow}>
              <Text style={styles.label}>Marka</Text>
              {isEditable ? (
                <Picker
                  selectedValue={value}
                  onValueChange={(val) => {
                    onChange(val);
                    setValue("vehicle.model", "");
                  }}
                  style={styles.picker}
                  enabled={isEditable}
                  accessibilityLabel="Araç markası seç"
                >
                  <Picker.Item label="Marka Seçin" value="" />
                  {VEHICLE_BRANDS.map((brand) => (
                    <Picker.Item key={brand} label={brand} value={brand} />
                  ))}
                </Picker>
              ) : (
                <Text style={styles.inputValue}>
                  {value || "Belirtilmemiş"}
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
              <Text style={styles.label}>Model</Text>
              {isEditable ? (
                <Picker
                  selectedValue={value}
                  onValueChange={onChange}
                  style={[
                    styles.picker,
                    !currentBrand && styles.disabledPicker,
                  ]}
                  enabled={isEditable && !!currentBrand}
                  accessibilityLabel="Araç modeli seç"
                >
                  <Picker.Item label="Model Seçin" value="" />
                  {(VEHICLE_MODELS[currentBrand] || []).map((model) => (
                    <Picker.Item key={model} label={model} value={model} />
                  ))}
                </Picker>
              ) : (
                <Text style={styles.inputValue}>
                  {value || "Belirtilmemiş"}
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
              <Text style={styles.label}>Yıl</Text>
              {isEditable ? (
                <Picker
                  selectedValue={value}
                  onValueChange={onChange}
                  style={styles.picker}
                  enabled={isEditable}
                  accessibilityLabel="Araç yılı seç"
                >
                  <Picker.Item label="Yıl Seçin" value="" />
                  {VEHICLE_YEARS.map((year) => (
                    <Picker.Item key={year} label={year} value={year} />
                  ))}
                </Picker>
              ) : (
                <Text style={styles.inputValue}>
                  {value || "Belirtilmemiş"}
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
              <Text style={styles.label}>Yakıt Türü</Text>
              {isEditable ? (
                <Picker
                  selectedValue={value}
                  onValueChange={onChange}
                  style={styles.picker}
                  enabled={isEditable}
                  accessibilityLabel="Yakıt türü seç"
                >
                  <Picker.Item label="Yakıt Türü Seçin" value="" />
                  {FUEL_TYPES.map((fuel) => (
                    <Picker.Item key={fuel} label={fuel} value={fuel} />
                  ))}
                </Picker>
              ) : (
                <Text style={styles.inputValue}>
                  {value || "Belirtilmemiş"}
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
              isEditable ? "Profili kaydet" : "Profili düzenle"
            }
          >
            {isSaving ? (
              <ActivityIndicator size="small" color={COLORS.white} />
            ) : (
              <Text style={styles.buttonText}>
                {isEditable ? "Kaydet" : "Profili Düzenle"}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
