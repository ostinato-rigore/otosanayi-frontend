import { StyleSheet } from "react-native";
import COLORS from "../../colors";
import THEME from "../../theme";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: THEME.spacing.xl,
  },
  title: {
    fontSize: THEME.fontSizes.h1,
    fontWeight: THEME.fontWeights.extraBold,
    color: COLORS.primary,
    marginBottom: THEME.spacing.md,
    textAlign: "center",
  },
  subtitle: {
    fontSize: THEME.fontSizes.h2,
    color: COLORS.textPrimary,
    marginBottom: THEME.spacing.md,
    textAlign: "center",
  },
  infoText: {
    fontSize: THEME.fontSizes.tag,
    color: COLORS.textSecondary,
    marginBottom: THEME.spacing.lg,
    textAlign: "center",
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: THEME.spacing.md,
  },
  otpInput: {
    width: 50,
    height: 50,
    borderWidth: 2,
    borderRadius: 8,
    textAlign: "center",
    marginHorizontal: 5,
    fontSize: THEME.fontSizes.h2,
    color: COLORS.textDark,
    backgroundColor: COLORS.inputBackground,
  },
  button: {
    width: THEME.sizes.button.maxWidth,
    paddingVertical: THEME.sizes.button.paddingVertical,
    borderRadius: THEME.sizes.button.borderRadius,
    alignItems: "center",
    marginTop: THEME.spacing.md,
  },
  buttonText: {
    fontSize: THEME.fontSizes.button,
    fontWeight: THEME.fontWeights.bold,
    color: COLORS.white,
  },
  resendText: {
    fontSize: THEME.fontSizes.secondary,
    color: COLORS.primary,
    marginTop: THEME.spacing.md,
    textDecorationLine: "underline",
  },
  error: {
    color: COLORS.error,
    fontSize: THEME.fontSizes.secondary,
    marginBottom: THEME.spacing.md,
    textAlign: "left",
    alignSelf: "flex-start",
    marginLeft: THEME.spacing.xl,
  },
});

export default styles;
