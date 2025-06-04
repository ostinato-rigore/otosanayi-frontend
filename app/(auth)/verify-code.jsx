import { zodResolver } from "@hookform/resolvers/zod";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
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
import styles from "../../constants/styles/verify-code-styles";

const createVerifyCodeSchema = (t) =>
  z.object({
    code: z
      .string()
      .min(6, { message: t("invalidCode") })
      .nonempty({ message: t("codeRequired") }),
  });

export default function VerifyCode() {
  const { userType, email } = useLocalSearchParams();
  const router = useRouter();
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createVerifyCodeSchema(t)),
    defaultValues: { code: "" },
  });

  const buttonColor =
    userType === "Mechanic" ? COLORS.accentMechanic : COLORS.accentCustomer;
  const borderColor =
    userType === "Mechanic" ? COLORS.accentMechanic : COLORS.accentCustomer;

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      Alert.alert(t("success"), t("codeVerified"));
      router.push({
        pathname: "/(auth)/reset-password",
        params: { userType, email },
      });
    } catch (error) {
      Alert.alert(t("error"), t("invalidCode"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (index, value) => {
    const newCode = [...code];
    newCode[index] = value.slice(0, 1); // Sadece 1 karakter al
    setCode(newCode);

    // Sonraki input'a geç
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }

    // Tüm kutular doluysa formu submit et
    if (newCode.every((char) => char !== "") && index === 5) {
      handleSubmit(onSubmit)();
    }
  };

  const handleKeyPress = (index, { nativeEvent }) => {
    if (nativeEvent.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  useEffect(() => {
    // İlk input'a odaklan
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1, backgroundColor: COLORS.background }}
      keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
    >
      <View style={styles.container}>
        <Text style={styles.title}>{t("verifyCodeTitle")}</Text>
        <Text style={styles.subtitle}>{t("verifyCodeSubtitle")}</Text>

        <View style={styles.otpContainer}>
          {code.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => (inputRefs.current[index] = ref)}
              style={[styles.otpInput, { borderColor }]}
              value={digit}
              onChangeText={(value) => handleChange(index, value)}
              onKeyPress={handleKeyPress.bind(null, index)}
              keyboardType="number-pad"
              maxLength={1}
              autoFocus={index === 0}
              accessible
              accessibilityLabel={`${t("codeLabel")} digit ${index + 1}`}
            />
          ))}
        </View>
        {errors.code && <Text style={styles.error}>{errors.code.message}</Text>}

        <TouchableOpacity
          style={[styles.button, { backgroundColor: buttonColor }]}
          onPress={handleSubmit(onSubmit)}
          disabled={isLoading}
          accessible
          accessibilityLabel={t("verifyButton")}
          accessibilityRole="button"
        >
          {isLoading ? (
            <ActivityIndicator color={COLORS.white} />
          ) : (
            <Text style={styles.buttonText}>{t("verifyButton")}</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
