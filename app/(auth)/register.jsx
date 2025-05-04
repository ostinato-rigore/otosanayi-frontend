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
import styles from "../../constants/styles/register-styles";

export default function Register() {
  const { userType } = useLocalSearchParams();
  const router = useRouter();

  // Tek bir state objesinde tüm form verileri
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullname: "",
    phone: "",
  });

  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const registerTitle = `Register as ${
    userType === "Mechanic" ? "Auto Mechanic" : "Customer"
  }`;

  const caretColor =
    userType === "Mechanic" ? COLORS.accentMechanic : COLORS.primary;

  // Input değişikliklerini yöneten tek fonksiyon
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = () => {
    const { email, password, fullname } = formData;

    if (!email || !password || !fullname) {
      setError("Please fill all required fields");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address");
      return false;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return false;
    }
    return true;
  };

  const handleRegister = () => {
    if (!validateForm()) return;
    setError("");
    console.log("Form Data:", formData); // API gönderiminden önce kontrol
    router.push("/(auth)");
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
        value={formData.fullname}
        onChangeText={(text) => handleInputChange("fullname", text)}
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
        placeholder="Phone (Optional)"
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
        accessible
        accessibilityLabel="Register button"
        accessibilityRole="button"
      >
        <Text style={styles.buttonText}>Register</Text>
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
