import { zodResolver } from "@hookform/resolvers/zod";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { z } from "zod";
import COLORS from "../../constants/colors";
import styles from "../../constants/styles/reset-password-styles";

const createResetPasswordSchema = (t) =>
  z
    .object({
      newPassword: z
        .string()
        .min(6, { message: t("passwordMinLength") })
        .nonempty({ message: t("newPasswordRequired") }),
      confirmPassword: z
        .string()
        .nonempty({ message: t("confirmPasswordRequired") }),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: t("passwordsMatch"),
      path: ["confirmPassword"],
    });

export default function ResetPassword() {
  const { userType, email } = useLocalSearchParams();
  const router = useRouter();
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createResetPasswordSchema(t)),
    defaultValues: { newPassword: "", confirmPassword: "" },
  });

  const buttonColor =
    userType === "Mechanic" ? COLORS.accentMechanic : COLORS.accentCustomer;

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      Alert.alert(t("success"), t("passwordReset"));
      router.push({
        pathname: "/(auth)/login",
        params: { userType },
      });
    } catch (error) {
      Alert.alert(t("error"), t("unexpectedError"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1, backgroundColor: COLORS.background }}
      keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
    >
      <View style={styles.container}>
        <Text style={styles.title}>{t("resetPasswordTitle")}</Text>
        <Text style={styles.subtitle}>{t("resetPasswordSubtitle")}</Text>

        <Controller
          control={control}
          name="newPassword"
          render={({ field: { onChange, onBlur, value } }) => (
            <>
              <TextInput
                style={styles.input}
                placeholder={t("newPasswordLabel")}
                placeholderTextColor={COLORS.placeholderText}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                secureTextEntry
                accessible
                accessibilityLabel={t("newPasswordLabel")}
              />
              {errors.newPassword && (
                <Text style={styles.error}>{errors.newPassword.message}</Text>
              )}
            </>
          )}
        />

        <Controller
          control={control}
          name="confirmPassword"
          render={({ field: { onChange, onBlur, value } }) => (
            <>
              <TextInput
                style={styles.input}
                placeholder={t("confirmPasswordLabel")}
                placeholderTextColor={COLORS.placeholderText}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                secureTextEntry
                accessible
                accessibilityLabel={t("confirmPasswordLabel")}
              />
              {errors.confirmPassword && (
                <Text style={styles.error}>
                  {errors.confirmPassword.message}
                </Text>
              )}
            </>
          )}
        />

        <TouchableOpacity
          style={[styles.button, { backgroundColor: buttonColor }]}
          onPress={handleSubmit(onSubmit)}
          disabled={isLoading}
          accessible
          accessibilityLabel={t("resetButton")}
          accessibilityRole="button"
        >
          {isLoading ? (
            <ActivityIndicator color={COLORS.white} />
          ) : (
            <Text style={styles.buttonText}>{t("resetButton")}</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
