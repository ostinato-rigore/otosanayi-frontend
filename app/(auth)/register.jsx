import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
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

const registerSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters" })
    .nonempty("Name is required"),
  email: z
    .string()
    .email({ message: "Enter a valid email address" })
    .nonempty("Email is required"),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" })
    .nonempty("Password is required"),
  phone: z
    .string()
    .regex(/^\+?\d{10,15}$/, { message: "Enter a valid phone number" })
    .nonempty("Phone is required"),
});

export default function Register() {
  const { userType } = useLocalSearchParams();
  const router = useRouter();
  const { isLoading, register } = useAuthStore();

  const [showPassword, setShowPassword] = useState(false);

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
      phone: "",
    },
  });

  const registerTitle = `Register as ${
    userType === "Mechanic" ? "Auto Mechanic" : "Customer"
  }`;

  const caretColor =
    userType === "Mechanic" ? COLORS.accentMechanic : COLORS.primary;

  const handleRegister = async (data) => {
    try {
      const response = await register(userType, data);
      console.log("Register response:", response);
    } catch (err) {
      console.log("Kayıt Hatası:", err);
      // Sunucu hataları api.js interceptor tarafından yönetiliyor
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <Text style={styles.title}>{registerTitle}</Text>
      <Text style={styles.subtitle}>Create your account</Text>

      <Controller
        control={control}
        name="name"
        render={({ field: { onChange, onBlur, value } }) => (
          <>
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              placeholderTextColor={COLORS.placeholderText}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              autoCapitalize="words"
              selectionColor={caretColor}
              accessible
              accessibilityLabel="Full name input"
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

      <Controller
        control={control}
        name="phone"
        render={({ field: { onChange, onBlur, value } }) => (
          <>
            <TextInput
              style={styles.input}
              placeholder="Phone"
              placeholderTextColor={COLORS.placeholderText}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              keyboardType="phone-pad"
              selectionColor={caretColor}
              accessible
              accessibilityLabel="Phone input"
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
