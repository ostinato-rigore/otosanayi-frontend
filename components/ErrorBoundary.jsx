import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import COLORS from "../constants/colors";
import THEME from "../constants/theme";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log error to console for debugging
    console.error("ErrorBoundary caught an error:", error, errorInfo);

    // Here you can also log to your analytics service
    // Analytics.logError(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      return (
        <View style={styles.container}>
          <View style={styles.content}>
            <Ionicons
              name="warning-outline"
              size={64}
              color={COLORS.error}
              style={styles.icon}
            />
            <Text style={styles.title}>
              {this.props.title || "Bir şeyler ters gitti"}
            </Text>
            <Text style={styles.message}>
              {this.props.message ||
                "Bu bölümde bir hata oluştu. Lütfen tekrar deneyin."}
            </Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={() => {
                this.setState({ hasError: false, error: null });
                if (this.props.onRetry) {
                  this.props.onRetry();
                }
              }}
            >
              <Text style={styles.retryText}>Tekrar Dene</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: "center",
    alignItems: "center",
    padding: THEME.spacing.lg,
  },
  content: {
    alignItems: "center",
    maxWidth: 300,
  },
  icon: {
    marginBottom: THEME.spacing.lg,
  },
  title: {
    fontSize: THEME.fontSizes.h2,
    fontWeight: THEME.fontWeights.bold,
    color: COLORS.textPrimary,
    textAlign: "center",
    marginBottom: THEME.spacing.md,
  },
  message: {
    fontSize: THEME.fontSizes.body,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginBottom: THEME.spacing.xl,
    lineHeight: 22,
  },
  retryButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: THEME.spacing.xl,
    paddingVertical: THEME.spacing.md,
    borderRadius: THEME.sizes.button.borderRadius,
  },
  retryText: {
    color: COLORS.white,
    fontSize: THEME.fontSizes.body,
    fontWeight: THEME.fontWeights.semiBold,
  },
});

export default ErrorBoundary;
