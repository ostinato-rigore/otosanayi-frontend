import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import COLORS from "../../constants/colors";
import styles from "../../constants/styles/register-styles";
import useAuthStore from "../../store/useAuthStore";
import useUiStore from "../../store/useUiStore";
import { validateRegisterForm } from "../../validations/auth-validations";

export default function Register() {
  const { userType } = useLocalSearchParams();
  const router = useRouter();
  const { isLoading, register } = useAuthStore();
  const { error, setError, clearError } = useUiStore();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    phone: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const registerTitle = `Register as ${
    userType === "Mechanic" ? "Auto Mechanic" : "Customer"
  }`;

  const caretColor =
    userType === "Mechanic" ? COLORS.accentMechanic : COLORS.primary;

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleRegister = async () => {
    clearError();
    if (!validateRegisterForm(formData, setError)) return;

    try {
      const response = await register(userType, formData);
      if (response.success) {
        router.replace({
          pathname: "/(auth)",
          params: { userType },
        });
      } else {
        setError(response.error.message || "Registration failed");
      }
    } catch (err) {
      setError(err.message || "An unexpected error occurred");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <Text style={styles.title}>{registerTitle}</Text>
      <Text style={styles.subtitle}>Create your account</Text>

      <TextInput
        style={styles.input}
        placeholder="Full Name"
        placeholderTextColor={COLORS.placeholderText}
        value={formData.name}
        onChangeText={(text) => handleInputChange("name", text)}
        autoCapitalize="words"
        selectionColor={caretColor}
        accessible
        accessibilityLabel="Full name input"
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor={COLORS.placeholderText}
        value={formData.email}
        onChangeText={(text) => handleInputChange("email", text)}
        keyboardType="email-address"
        autoCapitalize="none"
        selectionColor={caretColor}
        accessible
        accessibilityLabel="Email input"
      />

      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Password"
          placeholderTextColor={COLORS.placeholderText}
          value={formData.password}
          onChangeText={(text) => handleInputChange("password", text)}
          secureTextEntry={!showPassword}
          selectionColor={caretColor}
          accessible
          accessibilityLabel="Password input"
        />
        <TouchableOpacity
          onPress={() => setShowPassword(!showPassword)}
          style={styles.iconContainer}
          accessible
          accessibilityLabel={showPassword ? "Hide password" : "Show password"}
          accessibilityRole="button"
        >
          <Ionicons
            name={showPassword ? "eye-outline" : "eye-off-outline"}
            size={24}
            color={COLORS.placeholderText}
          />
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Phone"
        placeholderTextColor={COLORS.placeholderText}
        value={formData.phone}
        onChangeText={(text) => handleInputChange("phone", text)}
        keyboardType="phone-pad"
        selectionColor={caretColor}
        accessible
        accessibilityLabel="Phone input"
      />

      {error ? (
        <Text
          style={styles.error}
          accessible
          accessibilityLabel={error}
          accessibilityLiveRegion="polite"
        >
          {error}
        </Text>
      ) : null}

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
        onPress={handleRegister}
        disabled={isLoading}
        accessible
        accessibilityLabel="Register button"
        accessibilityRole="button"
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Register</Text>
        )}
      </TouchableOpacity>

      <Text style={styles.loginText}>
        Already have an account?{" "}
        <Text
          style={styles.loginLink}
          onPress={() =>
            router.push({ pathname: "/(auth)", params: { userType } })
          }
          accessible
          accessibilityRole="link"
        >
          Login
        </Text>
      </Text>
    </KeyboardAvoidingView>
  );
}
