import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Image, StyleSheet, View } from "react-native";
import COLORS from "../constants/colors";

const OptimizedImage = ({
  source,
  style,
  fallbackIcon = "image-outline",
  resizeMode = "cover",
  ...props
}) => {
  const [error, setError] = useState(false);

  // Source geçersizse error göster
  if (!source || !source.uri || !source.uri.trim() || error) {
    return (
      <View style={[styles.container, style]}>
        <View style={styles.errorContainer}>
          <Ionicons
            name={fallbackIcon}
            size={Math.min(style?.width || 50, style?.height || 50) * 0.4}
            color={COLORS.placeholderText}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      <Image
        source={source}
        style={styles.image}
        resizeMode={resizeMode}
        onError={() => setError(true)}
        {...props}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  errorContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
    backgroundColor: COLORS.inputBackground,
  },
});

export default OptimizedImage;
