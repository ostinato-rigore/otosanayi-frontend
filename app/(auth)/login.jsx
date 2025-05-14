import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
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

// Validation schema
const loginSchema = z.object({
  email: z
    .string()
    .email({ message: "Enter a valid email address" })
    .nonempty("Email is required"),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" })
    .nonempty("Password is required"),
});

export default function Login() {
  const { userType } = useLocalSearchParams();
  const router = useRouter();
  const { isLoading, login, fetchUser } = useAuthStore();

  const [showPassword, setShowPassword] = useState(false);

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
    userType === "Mechanic" ? "Auto Mechanic Login" : "Customer Login";

  const caretColor =
    userType === "Mechanic" ? COLORS.accentMechanic : COLORS.accentCustomer;

  const handleLogin = async (data) => {
    try {
      const response = await login(userType, data);
      if (response.success) {
        await fetchUser();
        console.log("Login successful:", response);
      } else {
        // Hata durumunda kullanıcıya mesaj göster
        const errorMessage =
          response.error?.message || "Invalid email or password";
        Alert.alert("Login Failed", errorMessage);
      }
    } catch (err) {
      console.error("Login error:", err);
      Alert.alert("Error", "An unexpected error occurred. Please try again.");
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

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1, backgroundColor: COLORS.background }}
      keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
    >
      <View style={styles.container}>
        <Text style={styles.title}>{loginTitle}</Text>
        <Text style={styles.subtitle}>Sign in to continue</Text>

        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <>
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor={COLORS.placeholderText}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                keyboardType="email-address"
                autoCapitalize="none"
                selectionColor={caretColor}
                accessible
                accessibilityLabel="Email input"
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
                  placeholder="Password"
                  placeholderTextColor={COLORS.placeholderText}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
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
                  accessibilityLabel={
                    showPassword ? "Hide password" : "Show password"
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
            onPress={handleNavigateToRegister}
            accessible
            accessibilityRole="link"
          >
            Register
          </Text>
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}
