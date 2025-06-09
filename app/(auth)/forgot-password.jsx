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
import styles from "../../constants/styles/auth/forgot-password-styles";
import useAuthStore from "../../store/useAuthStore";

const createForgotPasswordSchema = (t) =>
  z.object({
    email: z
      .string()
      .email({ message: t("invalidEmail") })
      .nonempty({ message: t("emailRequired") }),
  });

export default function ForgotPassword() {
  const { userType } = useLocalSearchParams();
  const router = useRouter();
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const { forgotPassword } = useAuthStore();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createForgotPasswordSchema(t)),
    defaultValues: { email: "" },
  });

  const buttonColor =
    userType === "Mechanic" ? COLORS.accentMechanic : COLORS.accentCustomer;

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const type = userType.toLowerCase();
      const response = await forgotPassword(type, data.email);

      if (response.success) {
        Alert.alert(t("success"), t("codeSent"));
        router.push({
          pathname: "/(auth)/verify-code",
          params: { userType, email: data.email },
        });
      } else {
        Alert.alert(
          t("error"),
          response.error?.message || t("unexpectedError")
        );
      }
    } catch (error) {
      Alert.alert(t("error"), t("unexpectedError"));
      console.log(error);
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
        <Text style={styles.title}>{t("forgotPasswordTitle")}</Text>
        <Text style={styles.subtitle}>{t("forgotPasswordSubtitle")}</Text>

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
                accessible
                accessibilityLabel={t("emailLabel")}
              />
              {errors.email && (
                <Text style={styles.error}>{errors.email.message}</Text>
              )}
            </>
          )}
        />

        <TouchableOpacity
          style={[styles.button, { backgroundColor: buttonColor }]}
          onPress={handleSubmit(onSubmit)}
          disabled={isLoading}
          accessible
          accessibilityLabel={t("sendCode")}
          accessibilityRole="button"
        >
          {isLoading ? (
            <ActivityIndicator color={COLORS.white} />
          ) : (
            <Text style={styles.buttonText}>{t("sendCode")}</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
