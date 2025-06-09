import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
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
import COLORS from "../../constants/colors";
import styles from "../../constants/styles/auth/verify-code-styles";
import useAuthStore from "../../store/useAuthStore";

export default function VerifyCode() {
  const { userType, email } = useLocalSearchParams();
  const router = useRouter();
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);
  const { verifyCode, forgotPassword } = useAuthStore();

  const buttonColor =
    userType === "Mechanic" ? COLORS.accentMechanic : COLORS.accentCustomer;
  const borderColor =
    userType === "Mechanic" ? COLORS.accentMechanic : COLORS.accentCustomer;

  const onSubmit = async () => {
    const enteredCode = code.join(""); // 6 haneli kodu birleştir
    if (enteredCode.length !== 6) {
      Alert.alert(t("error"), t("codeRequired"));
      return;
    }

    setIsLoading(true);
    try {
      const type = userType.toLowerCase();
      const response = await verifyCode(type, email, enteredCode);
      if (response.success) {
        Alert.alert(t("success"), t("codeVerified"));
        router.push({
          pathname: "/(auth)/reset-password",
          params: { userType, email },
        });
      } else {
        Alert.alert(t("error"), t("invalidCode")); // Kendi hata mesajı
        console.log("Backend error:", response.error.message); // Hata loglanabilir
      }
    } catch (error) {
      Alert.alert(t("error"), t("unexpectedError")); // Kendi hata mesajı
      console.log("Unexpected error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setIsLoading(true);
    try {
      const type = userType.toLowerCase();
      const response = await forgotPassword(type, email);
      if (response.success) {
        Alert.alert(t("success"), t("codeSent"));
        setCode(["", "", "", "", "", ""]);
        inputRefs.current[0].focus();
      } else {
        Alert.alert(t("error"), t("unexpectedError")); // Kendi hata mesajı
        console.log("Backend error:", response.error?.message); // Hata loglanabilir
      }
    } catch (error) {
      Alert.alert(t("error"), t("unexpectedError")); // Kendi hata mesajı
      console.log("Unexpected error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (index, value) => {
    // Sadece rakamları kabul et
    if (value && !/^[0-9]$/.test(value)) {
      return;
    }

    const newCode = [...code];
    newCode[index] = value.slice(0, 1);
    setCode(newCode);

    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }

    // Otomatik submit'i kaldır
    // if (newCode.every((char) => char !== "") && index === 5) {
    //   onSubmit();
    // }
  };

  const handleKeyPress = (index, { nativeEvent }) => {
    if (nativeEvent.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  useEffect(() => {
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
        <Text style={styles.infoText}>{t("codeValidityInfo")}</Text>

        <View style={styles.otpContainer}>
          {code.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => (inputRefs.current[index] = ref)}
              style={[styles.otpInput, { borderColor }]}
              value={digit}
              onChangeText={(value) => handleChange(index, value)}
              onKeyPress={handleKeyPress.bind(null, index)}
              keyboardType="numeric"
              maxLength={1}
              autoFocus={index === 0}
              accessible
              accessibilityLabel={`${t("codeLabel")} digit ${index + 1}`}
            />
          ))}
        </View>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: buttonColor }]}
          onPress={onSubmit}
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

        <TouchableOpacity
          onPress={handleResendCode}
          disabled={isLoading}
          accessible
          accessibilityLabel={t("resendCode")}
          accessibilityRole="button"
        >
          <Text style={styles.resendText}>{t("resendCode")}</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
