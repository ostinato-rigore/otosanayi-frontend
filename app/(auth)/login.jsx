import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
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
import styles from "../../constants/styles/login-styles";
import useAuthStore from "../../store/useAuthStore";

// Validation schema factory
const createLoginSchema = (t) =>
  z.object({
    email: z
      .string()
      .email({ message: t("invalidEmail") })
      .nonempty({ message: t("emailRequired") }),
    password: z
      .string()
      .min(6, { message: t("passwordMinLength") })
      .nonempty({ message: t("passwordRequired") }),
  });

export default function Login() {
  const { userType } = useLocalSearchParams();
  const router = useRouter();
  const { isLoading, login, fetchUser } = useAuthStore();
  const { t } = useTranslation();

  const [showPassword, setShowPassword] = useState(false);

  const loginSchema = useMemo(() => createLoginSchema(t), [t]);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const loginTitle =
    userType === "Mechanic" ? t("mechanicLogin") : t("customerLogin");

  const caretColor =
    userType === "Mechanic" ? COLORS.accentMechanic : COLORS.accentCustomer;

  const handleLogin = async (data) => {
    try {
      const response = await login(userType, data);
      if (response.success) {
        await fetchUser();
        console.log("Login successful:", response);
      } else {
        const errorMessage = response.error?.message || t("invalidCredentials");
        Alert.alert(t("loginFailed"), errorMessage);
      }
    } catch (err) {
      console.error("Login error:", err);
      Alert.alert(t("error"), t("unexpectedError"));
    }
  };

  const handleNavigateToRegister = () => {
    Keyboard.dismiss();
    setTimeout(() => {
      router.push({
        pathname: "/(auth)/register",
        params: { userType },
      });
    }, 100);
  };

  const handleNavigateToForgotPassword = () => {
    Keyboard.dismiss();
    setTimeout(() => {
      router.push({
        pathname: "/(auth)/forgot-password",
        params: { userType },
      });
    }, 100);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1, backgroundColor: COLORS.background }}
      keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
    >
      <View style={styles.container}>
        <Text style={styles.title}>{loginTitle}</Text>
        <Text style={styles.subtitle}>{t("signInToContinue")}</Text>

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

        <TouchableOpacity
          style={[
            styles.loginButton,
            {
              backgroundColor:
                userType === "Mechanic"
                  ? COLORS.accentMechanic
                  : COLORS.accentCustomer,
            },
          ]}
          onPress={handleSubmit(handleLogin)}
          disabled={isLoading}
          accessible
          accessibilityLabel={t("loginButton")}
          accessibilityRole="button"
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>{t("loginButton")}</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.registerText}>
          <Text
            style={styles.registerLink}
            onPress={handleNavigateToForgotPassword}
            accessible
            accessibilityRole="link"
          >
            {t("forgotPassword")}
          </Text>
        </Text>

        <Text style={styles.registerText}>
          {t("dontHaveAccount")}{" "}
          <Text
            style={styles.registerLink}
            onPress={handleNavigateToRegister}
            accessible
            accessibilityRole="link"
          >
            {t("register")}
          </Text>
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}
