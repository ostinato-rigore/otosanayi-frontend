import { StyleSheet } from "react-native";
import COLORS from "../../colors";
import THEME from "../../theme";

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
    paddingHorizontal: THEME.spacing.xl, // Yanlardan boşluk ekledik
  },
  logo: {
    width: 400, // Daha makul bir boyut
    height: 400,
    resizeMode: "contain",
  },
  title: {
    fontSize: THEME.fontSizes.h1, // Daha okunabilir boyut
    fontWeight: THEME.fontWeights.extraBold, // Kalın yazı tipi
    color: COLORS.primary,
    marginBottom: THEME.spacing.md, // Başlık ile metin arasında boşluk
    textAlign: "center",
  },
  subtitle: {
    fontSize: THEME.fontSizes.h2,
    color: COLORS.textPrimary,
    marginBottom: THEME.spacing.xl,
    textAlign: "center",
    lineHeight: 24, // Satır aralığı
    paddingHorizontal: THEME.spacing.md, // Metin yan boşlukları
  },
  button: {
    width: THEME.sizes.button.maxWidth, // Tam genişlik
    paddingVertical: THEME.sizes.button.paddingVertical,
    borderRadius: THEME.sizes.button.borderRadius,
    marginBottom: THEME.spacing.md,
    alignItems: "center",
  },
  customerButton: {
    backgroundColor: COLORS.accentCustomer,
  },
  mechanicButton: {
    backgroundColor: COLORS.accentMechanic,
  },
  buttonText: {
    fontSize: THEME.fontSizes.button,
    color: COLORS.white,
    fontWeight: THEME.fontWeights.bold,
  },
});
