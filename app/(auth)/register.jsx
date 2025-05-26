import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next"; // Çeviri hook'u
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { z } from "zod";
import COLORS from "../../constants/colors";
import styles from "../../constants/styles/register-styles";
import useAuthStore from "../../store/useAuthStore";

// Validation schema factory
const createRegisterSchema = (t) =>
  z
    .object({
      name: z
        .string()
        .min(2, { message: t("nameMinLength") })
        .nonempty({ message: t("nameRequired") }),
      email: z
        .string()
        .email({ message: t("invalidEmail") })
        .nonempty({ message: t("emailRequired") }),
      password: z
        .string()
        .min(6, { message: t("passwordMinLength") })
        .nonempty({ message: t("passwordRequired") }),
      confirmPassword: z
        .string()
        .nonempty({ message: t("confirmPasswordRequired") }),
      phone: z
        .string()
        .regex(/^\+?\d{10,15}$/, { message: t("invalidPhone") })
        .nonempty({ message: t("phoneRequired") }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t("passwordsDoNotMatch"),
      path: ["confirmPassword"], // Hata mesajını confirmPassword alanına bağla
    });

export default function Register() {
  const { userType } = useLocalSearchParams();
  const router = useRouter();
  const { isLoading, register } = useAuthStore();
  const { t } = useTranslation(); // Çeviri fonksiyonunu al

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Schema’yı useMemo ile sabitleyelim
  const registerSchema = useMemo(() => createRegisterSchema(t), [t]);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
    },
  });

  const registerTitle =
    userType === "Mechanic" ? t("mechanicRegister") : t("customerRegister");

  const caretColor =
    userType === "Mechanic" ? COLORS.accentMechanic : COLORS.primary;

  const handleNavigateToLogin = () => {
    Keyboard.dismiss();
    setTimeout(() => {
      router.push({
        pathname: "/(auth)/login",
        params: { userType },
      });
    }, 100);
  };

  const handleRegister = async (data) => {
    Keyboard.dismiss();
    try {
      // confirmPassword alanını çıkararak yalnızca gerekli verileri backend’e gönder
      const { confirmPassword, ...registerData } = data;
      const response = await register(userType, registerData);
      if (response.success) {
        console.log("Register successful:", response);
        router.push({
          pathname: "/(auth)/login",
          params: { userType },
        });
      } else {
        const errorMessage = response.error?.message || t("unexpectedError");
        Alert.alert(errorMessage);
      }
    } catch (err) {
      console.error("Registration error:", err);
      // Alert.alert(t("error"), t("unexpectedError"));
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1, backgroundColor: COLORS.background }}
      keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
    >
      <View style={styles.container}>
        <Text style={styles.title}>{registerTitle}</Text>
        <Text style={styles.subtitle}>{t("createYourAccount")}</Text>

        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, onBlur, value } }) => (
            <>
              <TextInput
                style={styles.input}
                placeholder={t("nameLabel")}
                placeholderTextColor={COLORS.placeholderText}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                autoCapitalize="words"
                selectionColor={caretColor}
                accessible
                accessibilityLabel={t("nameLabel")}
              />
              {errors.name && (
                <Text style={styles.error}>{errors.name.message}</Text>
              )}
            </>
          )}
        />

        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <>
              <TextInput
                style={styles.input}
                placeholder={t("emailLabel")}
                placeholderTextColor={COLORS.placeholderText}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                keyboardType="email-address"
                autoCapitalize="none"
                selectionColor={caretColor}
                accessible
                accessibilityLabel={t("emailLabel")}
              />
              {errors.email && (
                <Text style={styles.error}>{errors.email.message}</Text>
              )}
            </>
          )}
        />

        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder={t("passwordLabel")}
                  placeholderTextColor={COLORS.placeholderText}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  secureTextEntry={!showPassword}
                  selectionColor={caretColor}
                  accessible
                  accessibilityLabel={t("passwordLabel")}
                  autoComplete="password"
                  textContentType="password"
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.iconContainer}
                  accessible
                  accessibilityLabel={
                    showPassword ? t("hidePassword") : t("showPassword")
                  }
                  accessibilityRole="button"
                >
                  <Ionicons
                    name={showPassword ? "eye-outline" : "eye-off-outline"}
                    size={24}
                    color={COLORS.placeholderText}
                  />
                </TouchableOpacity>
              </View>
              {errors.password && (
                <Text style={styles.error}>{errors.password.message}</Text>
              )}
            </>
          )}
        />

        <Controller
          control={control}
          name="confirmPassword"
          render={({ field: { onChange, onBlur, value } }) => (
            <>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder={t("confirmPasswordLabel")}
                  placeholderTextColor={COLORS.placeholderText}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  secureTextEntry={!showConfirmPassword}
                  selectionColor={caretColor}
                  accessible
                  accessibilityLabel={t("confirmPasswordLabel")}
                  autoComplete="password"
                  textContentType="password"
                />
                <TouchableOpacity
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={styles.iconContainer}
                  accessible
                  accessibilityLabel={
                    showConfirmPassword ? t("hidePassword") : t("showPassword")
                  }
                  accessibilityRole="button"
                >
                  <Ionicons
                    name={
                      showConfirmPassword ? "eye-outline" : "eye-off-outline"
                    }
                    size={24}
                    color={COLORS.placeholderText}
                  />
                </TouchableOpacity>
              </View>
              {errors.confirmPassword && (
                <Text style={styles.error}>
                  {errors.confirmPassword.message}
                </Text>
              )}
            </>
          )}
        />

        <Controller
          control={control}
          name="phone"
          render={({ field: { onChange, onBlur, value } }) => (
            <>
              <TextInput
                style={styles.input}
                placeholder={t("phoneLabel")}
                placeholderTextColor={COLORS.placeholderText}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                keyboardType="phone-pad"
                selectionColor={caretColor}
                accessible
                accessibilityLabel={t("phoneLabel")}
              />
              {errors.phone && (
                <Text style={styles.error}>{errors.phone.message}</Text>
              )}
            </>
          )}
        />

        <TouchableOpacity
          style={[
            styles.registerButton,
            {
              backgroundColor:
                userType === "Mechanic"
                  ? COLORS.accentMechanic
                  : COLORS.accentCustomer,
            },
          ]}
          onPress={handleSubmit(handleRegister)}
          disabled={isLoading}
          accessible
          accessibilityLabel={t("registerButton")}
          accessibilityRole="button"
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>{t("registerButton")}</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.loginText}>
          {t("alreadyHaveAccount")}{" "}
          <Text
            style={styles.loginLink}
            onPress={handleNavigateToLogin}
            accessible
            accessibilityRole="link"
          >
            {t("login")}
          </Text>
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}
