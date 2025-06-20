import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
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
import { updateMechanicProfile, uploadMechanicLogo } from "../../api/apiClient";
import COLORS from "../../constants/colors";
import styles from "../../constants/styles/mechanic/mechanic-edit-profile-styles";
import { VEHICLE_BRANDS } from "../../constants/vehicleData";
import useAuthStore from "../../store/useAuthStore";

const expertise_areas = [
  "customerHome.expertiseMotorRepair",
  "customerHome.expertiseElectrical",
  "customerHome.expertiseBodywork",
  "customerHome.expertisePainting",
  "customerHome.expertiseBrakeSystems",
  "customerHome.expertiseTires",
  "customerHome.expertiseTransmissionRepair",
  "customerHome.expertiseSuspension",
  "customerHome.expertiseExhaustSystems",
  "customerHome.expertiseACService",
  "customerHome.expertiseFuelSystem",
  "customerHome.expertiseWheelAlignment",
  "customerHome.expertiseClutchRepair",
  "customerHome.expertiseHydraulicSystems",
  "customerHome.expertiseAxleDifferential",
  "customerHome.expertiseOther",
];

// Validation schema
const createMechanicSchema = (t) =>
  z.object({
    name: z
      .string()
      .min(2, t("mechanicProfile.errors.nameMinLength"))
      .optional(),
    phone: z
      .string()
      .regex(/^\+?\d{10,15}$/, t("mechanicProfile.errors.invalidPhone"))
      .optional(),
    mechanicName: z
      .string()
      .min(2, t("mechanicProfile.errors.mechanicNameMinLength"))
      .optional(),
    mechanicLogo: z.string().optional(),
    mechanicAddress: z
      .object({
        fullAddress: z
          .string()
          .min(5, t("mechanicProfile.errors.fullAddressMinLength"))
          .optional(),
        city: z
          .string()
          .min(2, t("mechanicProfile.errors.cityMinLength"))
          .optional(),
        district: z
          .string()
          .min(2, t("mechanicProfile.errors.districtMinLength"))
          .optional(),
      })
      .optional(),
    workingHours: z
      .object({
        weekdays: z
          .object({
            open: z
              .string()
              .regex(
                /^(?:[01]\d|2[0-3]):[0-5]\d$/,
                t("mechanicProfile.errors.invalidTimeFormat")
              )
              .optional(),
            close: z
              .string()
              .regex(
                /^(?:[01]\d|2[0-3]):[0-5]\d$/,
                t("mechanicProfile.errors.invalidTimeFormat")
              )
              .optional(),
          })
          .refine(
            (data) => {
              if (!data.open || !data.close) return true;
              const [openHour, openMinute] = data.open.split(":").map(Number);
              const [closeHour, closeMinute] = data.close
                .split(":")
                .map(Number);
              const openTime = openHour * 60 + openMinute;
              const closeTime = closeHour * 60 + closeMinute;
              return closeTime > openTime;
            },
            { message: t("mechanicProfile.errors.invalidTimeRange") }
          ),
        weekend: z
          .object({
            open: z
              .string()
              .regex(
                /^(?:[01]\d|2[0-3]):[0-5]\d$/,
                t("mechanicProfile.errors.invalidTimeFormat")
              )
              .optional(),
            close: z
              .string()
              .regex(
                /^(?:[01]\d|2[0-3]):[0-5]\d$/,
                t("mechanicProfile.errors.invalidTimeFormat")
              )
              .optional(),
          })
          .refine(
            (data) => {
              if (!data.open || !data.close) return true;
              const [openHour, openMinute] = data.open.split(":").map(Number); // EE hatası düzeltildi
              const [closeHour, closeMinute] = data.close
                .split(":")
                .map(Number);
              const openTime = openHour * 60 + openMinute;
              const closeTime = closeHour * 60 + closeMinute;
              return closeTime > openTime;
            },
            { message: t("mechanicProfile.errors.invalidTimeRange") }
          ),
      })
      .optional(),
    website: z
      .string()
      .url(t("mechanicProfile.errors.invalidUrl"))
      .optional()
      .or(z.literal("")),
    socialMedia: z
      .object({
        facebook: z
          .string()
          .url(t("mechanicProfile.errors.invalidUrl"))
          .optional()
          .or(z.literal("")),
        instagram: z
          .string()
          .url(t("mechanicProfile.errors.invalidUrl"))
          .optional()
          .or(z.literal("")),
        twitter: z
          .string()
          .url(t("mechanicProfile.errors.invalidUrl"))
          .optional()
          .or(z.literal("")),
      })
      .optional(),
    expertiseAreas: z.array(z.string()).optional(),
    vehicleBrands: z.array(z.string()).optional(),
  });

const DropdownSelect = ({
  label,
  value = [],
  onSelect,
  type,
  dropdownVisible,
  toggleDropdown,
  options,
  isEditable,
  isMultiSelect,
}) => {
  const { t } = useTranslation();
  const [selectedOptions, setSelectedOptions] = useState(value || []);

  useEffect(() => {
    setSelectedOptions(value || []); // Sync with value prop
  }, [value, isEditable]);

  const handleOptionToggle = (option) => {
    if (isMultiSelect) {
      const newSelected = selectedOptions.includes(option)
        ? selectedOptions.filter((item) => item !== option)
        : [...selectedOptions, option];
      setSelectedOptions(newSelected);
      onSelect(newSelected);
    } else {
      setSelectedOptions([option]);
      onSelect(option);
      toggleDropdown(null);
    }
  };

  const getDisplayedValue = () => {
    if (isMultiSelect) {
      return selectedOptions.length > 0
        ? `${selectedOptions.length} ${t("customerHome.optionsSelected")}`
        : t("mechanicProfile.select");
    }
    return selectedOptions[0] || t("mechanicProfile.select");
  };

  const displayOptions =
    type === "expertiseAreas"
      ? options.map((opt) => ({
          key: opt,
          label: t(opt),
        }))
      : options.map((opt) => ({
          key: opt,
          label: opt,
        }));

  return (
    <View style={{ flex: 1 }}>
      <TouchableOpacity
        style={styles.dropdownButton}
        onPress={isEditable ? () => toggleDropdown(type) : null}
        disabled={!isEditable}
        accessibilityLabel={`${label} ${t("mechanicProfile.selection")}`}
      >
        <Text style={styles.dropdownText}>{getDisplayedValue()}</Text>
        {isEditable && (
          <Ionicons
            name={dropdownVisible === type ? "chevron-up" : "chevron-down"}
            size={20}
            color={COLORS.textPrimary}
          />
        )}
      </TouchableOpacity>
      {dropdownVisible === type && isEditable && (
        <View style={styles.dropdownContainer}>
          <ScrollView style={styles.dropdownScroll} nestedScrollEnabled>
            {isMultiSelect && (
              <TouchableOpacity
                style={styles.dropdownItem}
                onPress={() => {
                  setSelectedOptions([]);
                  onSelect([]);
                  toggleDropdown(null);
                }}
              >
                <Text style={styles.dropdownItemText}>
                  {t("mechanicProfile.clear")}
                </Text>
              </TouchableOpacity>
            )}
            {displayOptions.map(({ key, label }) => (
              <TouchableOpacity
                key={key}
                style={styles.dropdownItem}
                onPress={() => handleOptionToggle(key)}
              >
                {isMultiSelect && (
                  <View
                    style={[
                      styles.checkbox,
                      selectedOptions.includes(key) && styles.checkboxSelected,
                    ]}
                  >
                    {selectedOptions.includes(key) && (
                      <Ionicons
                        name="checkmark"
                        size={16}
                        color={COLORS.white}
                      />
                    )}
                  </View>
                )}
                <Text style={styles.dropdownItemText}>{label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          {isMultiSelect && (
            <TouchableOpacity
              style={styles.dropdownCloseButton}
              onPress={() => toggleDropdown(null)}
            >
              <Text style={styles.dropdownCloseText}>
                {t("customerHome.close")}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};

export default function MechanicEditProfile() {
  const router = useRouter();
  const { user, isLoading, fetchUser, logout } = useAuthStore();
  const { t } = useTranslation();
  const [isEditable, setIsEditable] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(null);
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState({});
  const [isLoadingCities, setIsLoadingCities] = useState(false);

  const generateTimeOptions = () => {
    const times = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const hourStr = hour.toString().padStart(2, "0");
        const minuteStr = minute.toString().padStart(2, "0");
        times.push(`${hourStr}:${minuteStr}`);
      }
    }
    return times;
  };

  const timeOptions = useMemo(generateTimeOptions, []);

  const mechanicSchema = useMemo(() => createMechanicSchema(t), [t]);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm({
    resolver: zodResolver(mechanicSchema),
    defaultValues: {
      name: user?.name || "",
      phone: user?.phone || "",
      mechanicName: user?.mechanicName || "",
      mechanicLogo: user?.mechanicLogo || "",
      mechanicAddress: {
        fullAddress: user?.mechanicAddress?.fullAddress || "",
        city: user?.mechanicAddress?.city || "",
        district: user?.mechanicAddress?.district || "",
      },
      workingHours: {
        weekdays: {
          open: user?.workingHours?.weekdays?.open || "",
          close: user?.workingHours?.weekdays?.close || "",
        },
        weekend: {
          open: user?.workingHours?.weekend?.open || "",
          close: user?.workingHours?.weekend?.close || "",
        },
      },
      website: user?.website || "",
      socialMedia: {
        facebook: user?.socialMedia?.facebook || "",
        instagram: user?.socialMedia?.instagram || "",
        twitter: user?.socialMedia?.twitter || "",
      },
      expertiseAreas: user?.expertiseAreas || [],
      vehicleBrands: user?.vehicleBrands || [],
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        name: user?.name || "",
        phone: user?.phone || "",
        mechanicName: user?.mechanicName || "",
        mechanicLogo: user?.mechanicLogo || "",
        mechanicAddress: {
          fullAddress: user?.mechanicAddress?.fullAddress || "",
          city: user?.mechanicAddress?.city || "",
          district: user?.mechanicAddress?.district || "",
        },
        workingHours: {
          weekdays: {
            open: user?.workingHours?.weekdays?.open || "",
            close: user?.workingHours?.weekdays?.close || "",
          },
          weekend: {
            open: user?.workingHours?.weekend?.open || "",
            close: user?.workingHours?.weekend?.close || "",
          },
        },
        website: user?.website || "",
        socialMedia: {
          facebook: user?.socialMedia?.facebook || "",
          instagram: user?.socialMedia?.instagram || "",
          twitter: user?.socialMedia?.twitter || "",
        },
        expertiseAreas: user?.expertiseAreas || [],
        vehicleBrands: user?.vehicleBrands || [],
      });
    }
  }, [user, reset]);

  const fetchCityData = async (selectedCity) => {
    setIsLoadingCities(true);
    try {
      const response = await axios.get(
        "https://turkiyeapi.dev/api/v1/provinces"
      );
      const result = response.data;

      if (result.status === "OK" && Array.isArray(result.data)) {
        const cityList = result.data.map((city) => city.name);
        const districtMap = result.data.reduce((acc, city) => {
          acc[city.name] = city.districts.map((dist) => dist.name);
          return acc;
        }, {});
        setCities(cityList);
        if (selectedCity) {
          setDistricts((prev) => ({
            ...prev,
            [selectedCity]: districtMap[selectedCity] || [],
          }));
        } else {
          setDistricts(districtMap);
        }
      } else {
        throw new Error("Geçersiz API yanıtı");
      }
    } catch (error) {
      console.error("Fetch City Data Error:", error);
      setCities(["İstanbul", "Ankara", "İzmir"]);
      if (selectedCity) {
        setDistricts((prev) => ({
          ...prev,
          [selectedCity]:
            selectedCity === "İstanbul"
              ? ["Kadıköy", "Beşiktaş", "Şişli"]
              : selectedCity === "Ankara"
              ? ["Çankaya", "Kızılay", "Yenimahalle"]
              : selectedCity === "İzmir"
              ? ["Bornova", "Karşıyaka", "Konak"]
              : [],
        }));
      } else {
        setDistricts({
          İstanbul: ["Kadıköy", "Beşiktaş", "Şişli"],
          Ankara: ["Çankaya", "Kızılay", "Yenimahalle"],
          İzmir: ["Bornova", "Karşıyaka", "Konak"],
        });
      }
    } finally {
      setIsLoadingCities(false);
    }
  };

  useEffect(() => {
    fetchCityData();
  }, []);

  const handleCityChange = (city) => {
    setValue("mechanicAddress.city", city);
    if (isEditable && city) {
      setIsLoadingCities(true);
      fetchCityData(city).then(() => {
        setValue("mechanicAddress.district", "");
      });
    }
  };

  const pickImage = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert(
          t("mechanicProfile.permissionRequired"),
          t("mechanicProfile.galleryPermission")
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
        setValue("mechanicLogo", imageUri);
        Alert.alert(t("success"), t("mechanicProfile.photoSelected"));
      }
    } catch (error) {
      console.error("Image Picker Error:", error);
      Alert.alert(
        t("error"),
        error.message || t("mechanicProfile.photoSelectionFailed")
      );
    }
  };

  const onSubmit = async (data) => {
    console.log("onSubmit called with data:", data); // Hata ayıklama için
    setIsSaving(true);
    try {
      let mechanicLogoUrl = data.mechanicLogo;
      if (mechanicLogoUrl && mechanicLogoUrl.startsWith("file://")) {
        console.log("Uploading logo:", mechanicLogoUrl);
        const response = await uploadMechanicLogo(mechanicLogoUrl);
        if (!response.mechanicLogo) {
          throw new Error(t("mechanicProfile.serverError"));
        }
        mechanicLogoUrl = response.mechanicLogo;
        console.log("Logo uploaded successfully:", mechanicLogoUrl);
      }

      const payload = {
        ...data,
        mechanicLogo: mechanicLogoUrl,
        expertiseAreas: data.expertiseAreas || [],
        vehicleBrands: data.vehicleBrands || [],
      };

      console.log("Updating profile with payload:", payload);
      await updateMechanicProfile(payload);
      await fetchUser();
      reset({
        ...data,
        mechanicLogo: mechanicLogoUrl,
      });
      Alert.alert(t("success"), t("mechanicProfile.updateSuccess"));
      setIsEditable(false);
      router.replace("/(mechanic)/profile");
    } catch (error) {
      console.error("onSubmit Error:", error);
      Alert.alert(
        t("error"),
        error.message || t("mechanicProfile.updateFailed")
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleSave = () => {
    console.log("handleSave called"); // Hata ayıklama için
    handleSubmit(
      (data) => onSubmit(data),
      (errors) => {
        console.log("Form validation errors:", errors); // Hata ayıklama için
        Alert.alert(
          t("error"),
          t("mechanicProfile.validationError") +
            "\n" +
            Object.values(errors)
              .map((err) => err.message)
              .join("\n")
        );
      }
    )();
  };

  const handleLogout = async () => {
    await logout();
    router.replace("/(auth)");
  };

  const toggleDropdown = (type) => {
    setDropdownVisible(dropdownVisible === type ? null : type);
  };

  if (!user || isLoading) {
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
          accessibilityLabel={t("mechanicProfile.selectLogo")}
          accessibilityHint={
            isEditable ? t("mechanicProfile.tapToSelectLogo") : ""
          }
        >
          {watch("mechanicLogo") ? (
            <Image
              source={{ uri: watch("mechanicLogo") }}
              style={styles.profileImage}
            />
          ) : (
            <View style={styles.profilePlaceholder}>
              <Ionicons name="business" size={50} color={COLORS.white} />
            </View>
          )}
          {isEditable && (
            <Ionicons
              name="camera"
              size={18}
              color={COLORS.accentMechanic}
              style={styles.cameraIcon}
            />
          )}
        </TouchableOpacity>
        <Text style={styles.profileName}>
          {watch("mechanicName") || t("mechanicProfile.noMechanicNameSet")}
        </Text>

        {/* Personal Information */}
        <View style={styles.cardContainer}>
          <Text style={styles.sectionTitle}>
            {t("mechanicProfile.personalInfo")}
          </Text>
          {[
            {
              name: "name",
              label: t("mechanicProfile.nameLabel"),
              placeholder: t("mechanicProfile.enterName"),
              editable: true,
            },
            {
              name: "phone",
              label: t("mechanicProfile.phoneLabel"),
              placeholder: t("mechanicProfile.enterPhone"),
              editable: true,
              keyboardType: "phone-pad",
            },
            {
              name: "mechanicName",
              label: t("mechanicProfile.mechanicNameLabel"),
              placeholder: t("mechanicProfile.enterMechanicName"),
              editable: true,
            },
            {
              name: "email",
              label: t("mechanicProfile.emailLabel"),
              value: user.email || t("mechanicProfile.noEmailSet"),
              editable: false,
            },
          ].map((field, index, array) => (
            <View
              key={field.name}
              style={[
                field.editable ? styles.inputRow : styles.disabledInputRow,
                index === array.length - 1 && styles.noBorderBottom,
              ]}
            >
              <Text style={styles.label}>{field.label}</Text>
              {field.editable ? (
                <Controller
                  control={control}
                  name={field.name}
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      style={styles.inputValue}
                      value={value}
                      onChangeText={onChange}
                      editable={isEditable}
                      placeholder={field.placeholder}
                      keyboardType={field.keyboardType}
                      accessibilityLabel={field.label}
                    />
                  )}
                />
              ) : (
                <Text style={styles.disabledInputValue}>{field.value}</Text>
              )}
            </View>
          ))}
          {errors.name && (
            <Text style={styles.errorText}>{errors.name.message}</Text>
          )}
          {errors.phone && (
            <Text style={styles.errorText}>{errors.phone.message}</Text>
          )}
          {errors.mechanicName && (
            <Text style={styles.errorText}>{errors.mechanicName.message}</Text>
          )}
        </View>

        {/* Address Information */}
        <View style={[styles.cardContainer, { marginTop: 24 }]}>
          <Text style={styles.sectionTitle}>
            {t("mechanicProfile.addressInfo")}
          </Text>
          {[
            {
              name: "mechanicAddress.fullAddress",
              label: t("mechanicProfile.fullAddressLabel"),
              placeholder: t("mechanicProfile.enterFullAddress"),
              editable: true,
              multiline: true,
            },
            {
              name: "mechanicAddress.city",
              label: t("mechanicProfile.cityLabel"),
              placeholder: t("mechanicProfile.enterCity"),
              editable: true,
              options: cities,
            },
            {
              name: "mechanicAddress.district",
              label: t("mechanicProfile.districtLabel"),
              placeholder: t("mechanicProfile.enterDistrict"),
              editable: true,
              options: districts[watch("mechanicAddress.city")] || [],
            },
          ].map((field, index, array) => (
            <View
              key={field.name}
              style={[
                styles.inputRow,
                index === array.length - 1 && styles.noBorderBottom,
              ]}
            >
              <Text style={styles.label}>{field.label}</Text>
              <Controller
                control={control}
                name={field.name}
                render={({ field: { onChange, value } }) => {
                  const fieldOptions = field.options || [];
                  return isEditable && fieldOptions.length > 0 ? (
                    <DropdownSelect
                      label={field.label}
                      value={value ? [value] : []}
                      onSelect={
                        field.name === "mechanicAddress.city"
                          ? handleCityChange
                          : onChange
                      }
                      type={field.name}
                      dropdownVisible={dropdownVisible}
                      toggleDropdown={toggleDropdown}
                      options={fieldOptions}
                      isEditable={isEditable}
                      isMultiSelect={false}
                    />
                  ) : isLoadingCities &&
                    field.name === "mechanicAddress.district" ? (
                    <ActivityIndicator size="small" color={COLORS.primary} />
                  ) : (
                    <TextInput
                      style={styles.inputValue}
                      value={value}
                      onChangeText={onChange}
                      editable={isEditable}
                      placeholder={field.placeholder}
                      multiline={field.multiline}
                      numberOfLines={field.multiline ? 3 : 1}
                      accessibilityLabel={field.label}
                    />
                  );
                }}
              />
            </View>
          ))}
          {errors.mechanicAddress?.fullAddress && (
            <Text style={styles.errorText}>
              {errors.mechanicAddress.fullAddress.message}
            </Text>
          )}
          {errors.mechanicAddress?.city && (
            <Text style={styles.errorText}>
              {errors.mechanicAddress.city.message}
            </Text>
          )}
          {errors.mechanicAddress?.district && (
            <Text style={styles.errorText}>
              {errors.mechanicAddress.district.message}
            </Text>
          )}
        </View>

        {/* Working Hours */}
        <View style={[styles.cardContainer, { marginTop: 24 }]}>
          <Text style={styles.sectionTitle}>
            {t("mechanicProfile.workingHours")}
          </Text>
          {[
            {
              name: "workingHours.weekdays.open",
              label: t("mechanicProfile.weekdaysOpenLabel"),
              placeholder: t("mechanicProfile.select"),
              editable: true,
              options: timeOptions,
            },
            {
              name: "workingHours.weekdays.close",
              label: t("mechanicProfile.weekdaysCloseLabel"),
              placeholder: t("mechanicProfile.select"),
              editable: true,
              options: timeOptions,
            },
            {
              name: "workingHours.weekend.open",
              label: t("mechanicProfile.weekendOpenLabel"),
              placeholder: t("mechanicProfile.select"),
              editable: true,
              options: timeOptions,
            },
            {
              name: "workingHours.weekend.close",
              label: t("mechanicProfile.weekendCloseLabel"),
              placeholder: t("mechanicProfile.select"),
              editable: true,
              options: timeOptions,
            },
          ].map((field, index, array) => (
            <View
              key={field.name}
              style={[
                styles.inputRow,
                index === array.length - 1 && styles.noBorderBottom,
              ]}
            >
              <Text style={styles.label}>{field.label}</Text>
              <Controller
                control={control}
                name={field.name}
                render={({ field: { onChange, value } }) =>
                  isEditable && field.options ? (
                    <DropdownSelect
                      label={field.label}
                      value={value ? [value] : []}
                      onSelect={onChange}
                      type={field.name}
                      dropdownVisible={dropdownVisible}
                      toggleDropdown={toggleDropdown}
                      options={field.options.map((time) => time)}
                      isEditable={isEditable}
                      isMultiSelect={false}
                    />
                  ) : (
                    <TextInput
                      style={styles.inputValue}
                      value={value}
                      onChangeText={onChange}
                      editable={isEditable}
                      placeholder={field.placeholder}
                      accessibilityLabel={field.label}
                    />
                  )
                }
              />
            </View>
          ))}
          {errors.workingHours?.weekdays?.open && (
            <Text style={styles.errorText}>
              {errors.workingHours.weekdays.open.message}
            </Text>
          )}
          {errors.workingHours?.weekdays?.close && (
            <Text style={styles.errorText}>
              {errors.workingHours.weekdays.close.message}
            </Text>
          )}
          {errors.workingHours?.weekend?.open && (
            <Text style={styles.errorText}>
              {errors.workingHours.weekend.open.message}
            </Text>
          )}
          {errors.workingHours?.weekend?.close && (
            <Text style={styles.errorText}>
              {errors.workingHours.weekend.close.message}
            </Text>
          )}
        </View>

        {/* Social Media & Website */}
        <View style={[styles.cardContainer, { marginTop: 24 }]}>
          <Text style={styles.sectionTitle}>
            {t("mechanicProfile.socialMediaWebsite")}
          </Text>
          {[
            {
              name: "website",
              label: t("mechanicProfile.websiteLabel"),
              placeholder: t("mechanicProfile.enterWebsite"),
              editable: true,
            },
            {
              name: "socialMedia.facebook",
              label: t("mechanicProfile.facebookLabel"),
              placeholder: t("mechanicProfile.enterFacebook"),
              editable: true,
            },
            {
              name: "socialMedia.instagram",
              label: t("mechanicProfile.instagramLabel"),
              placeholder: t("mechanicProfile.enterInstagram"),
              editable: true,
            },
            {
              name: "socialMedia.twitter",
              label: t("mechanicProfile.twitterLabel"),
              placeholder: t("mechanicProfile.enterTwitter"),
              editable: true,
            },
          ].map((field, index, array) => (
            <View
              key={field.name}
              style={[
                styles.inputRow,
                index === array.length - 1 && styles.noBorderBottom,
              ]}
            >
              <Text style={styles.label}>{field.label}</Text>
              <Controller
                control={control}
                name={field.name}
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    style={styles.inputValue}
                    value={value}
                    onChangeText={onChange}
                    editable={isEditable}
                    placeholder={field.placeholder}
                    accessibilityLabel={field.label}
                  />
                )}
              />
            </View>
          ))}
          {errors.website && (
            <Text style={styles.errorText}>{errors.website.message}</Text>
          )}
          {errors.socialMedia?.facebook && (
            <Text style={styles.errorText}>
              {errors.socialMedia.facebook.message}
            </Text>
          )}
          {errors.socialMedia?.instagram && (
            <Text style={styles.errorText}>
              {errors.socialMedia.instagram.message}
            </Text>
          )}
          {errors.socialMedia?.twitter && (
            <Text style={styles.errorText}>
              {errors.socialMedia.twitter.message}
            </Text>
          )}
        </View>

        {/* Expertise & Brands */}
        <View style={[styles.cardContainer, { marginTop: 24 }]}>
          <Text style={styles.sectionTitle}>
            {t("mechanicProfile.expertiseBrands")}
          </Text>
          {[
            {
              name: "expertiseAreas",
              label: t("mechanicProfile.expertiseAreasLabel"),
              type: "select",
              options: expertise_areas,
            },
            {
              name: "vehicleBrands",
              label: t("mechanicProfile.vehicleBrandsLabel"),
              type: "select",
              options: VEHICLE_BRANDS,
            },
          ].map((field, index, array) => (
            <View
              key={field.name}
              style={[
                styles.inputRow,
                index === array.length - 1 && styles.noBorderBottom,
              ]}
            >
              <Text style={styles.label}>{field.label}</Text>
              <Controller
                control={control}
                name={field.name}
                render={({ field: { onChange, value } }) =>
                  isEditable ? (
                    <DropdownSelect
                      label={field.label}
                      value={value || []}
                      onSelect={onChange}
                      type={field.name}
                      dropdownVisible={dropdownVisible}
                      toggleDropdown={toggleDropdown}
                      options={field.options}
                      isEditable={isEditable}
                      isMultiSelect={true}
                    />
                  ) : (
                    <Text style={styles.inputValue}>
                      {value?.length
                        ? value.map((opt) => t(opt)).join(", ")
                        : t("mechanicProfile.noValueSet")}
                    </Text>
                  )
                }
              />
            </View>
          ))}
          {errors.expertiseAreas && (
            <Text style={styles.errorText}>
              {errors.expertiseAreas.message}
            </Text>
          )}
          {errors.vehicleBrands && (
            <Text style={styles.errorText}>{errors.vehicleBrands.message}</Text>
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: COLORS.accentMechanic }]}
            onPress={isEditable ? handleSave : () => setIsEditable(true)}
            disabled={isSaving}
            accessibilityLabel={
              isEditable
                ? t("mechanicProfile.save")
                : t("mechanicProfile.editProfile")
            }
          >
            {isSaving ? (
              <ActivityIndicator size="small" color={COLORS.white} />
            ) : (
              <Text style={styles.buttonText}>
                {isEditable
                  ? t("mechanicProfile.save")
                  : t("mechanicProfile.editProfile")}
              </Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: COLORS.error }]}
            onPress={handleLogout}
            accessibilityLabel={t("mechanicProfile.logout")}
          >
            <Text style={styles.buttonText}>{t("mechanicProfile.logout")}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
