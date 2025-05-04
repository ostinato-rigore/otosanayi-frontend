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
import styles from "../../constants/styles/login-styles";
import useAuthStore from "../../store/useAuthStore";
import useUiStore from "../../store/useUiStore";
import { validateLoginForm } from "../../validations/auth-validations";

export default function Login() {
  const { userType } = useLocalSearchParams();
  const router = useRouter();
  const { isLoading, login } = useAuthStore();
  const { error, setError, clearError } = useUiStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const loginTitle = `Login as ${
    userType === "Mechanic" ? "Auto Mechanic" : "Customer"
  }`;

  const caretColor =
    userType === "Mechanic" ? COLORS.accentMechanic : COLORS.accentCustomer;

  const handleLogin = async () => {
    clearError();
    if (!validateLoginForm(email, password)) return;
    const formData = { email, password };
    try {
      const response = await login(userType, formData);
      console.log("Login response:", response);
      if (response.success) {
        router.replace("/(tabs)");
      } else {
        setError(response.error?.message || response.error || "Login failed");
      }
    } catch (err) {
      console.log("Login error:", err);
      setError(err.message || "An unexpected error occurred");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <Text style={styles.title}>{loginTitle}</Text>
      <Text style={styles.subtitle}>Sign in to continue</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor={COLORS.placeholderText}
        value={email}
        onChangeText={setEmail}
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
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          selectionColor={caretColor}
          accessible
          accessibilityLabel="Password input"
          autoComplete="password"
          textContentType="password"
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
      {error ? (
        <Text style={styles.error} accessible accessibilityLabel={error}>
          {error}
        </Text>
      ) : null}

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
        onPress={handleLogin}
        disabled={isLoading}
        accessible
        accessibilityLabel="Login button"
        accessibilityRole="button"
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Login</Text>
        )}
      </TouchableOpacity>

      <Text style={styles.registerText}>
        Don’t have an account?{" "}
        <Text
          style={styles.registerLink}
          onPress={() =>
            router.push({
              pathname: "/(auth)/register",
              params: { userType },
            })
          }
          accessible
          accessibilityRole="link"
        >
          Register
        </Text>
      </Text>
    </KeyboardAvoidingView>
  );
}
