import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import COLORS from "../../constants/colors";
import styles from "../../constants/styles/login-styles";

export default function Login() {
  const { userType } = useLocalSearchParams(); // Önceki sayfadan userType al
  const router = useRouter(); // Yönlendirme için

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const loginTitle = `Login as ${
    userType === "Mechanic" ? "Auto Mechanic" : "Customer"
  }`;

  const caretColor =
    userType === "Mechanic" ? COLORS.accentMechanic : COLORS.accentCustomer; // Caret rengi

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleLogin = () => {
    if (!email || !password) {
      setError("Please fill all fields");
      return;
    }
    if (!validateEmail(email)) {
      setError("Please enter a valid email");
      return;
    }
    setError("");
    router.push("/(tabs)");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <Text style={styles.title}> {loginTitle} </Text>
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
        accessible
        accessibilityLabel="Login button"
        accessibilityRole="button"
      >
        <Text style={styles.buttonText}>Login</Text>
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
