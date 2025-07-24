import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";
import COLORS from "../constants/colors";
import THEME from "../constants/theme";
import useNetworkStatus from "../hooks/useNetworkStatus";

const OfflineIndicator = () => {
  const { isOffline } = useNetworkStatus();
  const { t } = useTranslation();

  if (!isOffline) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Ionicons name="cloud-offline-outline" size={16} color={COLORS.white} />
      <Text style={styles.text}>
        {t("common.offlineMode", "Çevrimdışı mod")}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.error,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  text: {
    color: COLORS.white,
    fontSize: THEME.fontSizes.tag,
    fontWeight: THEME.fontWeights.semiBold,
    marginLeft: 8,
  },
});

export default OfflineIndicator;
