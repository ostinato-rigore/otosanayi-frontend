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
    marginBottom: THEME.spacing.xxl,
    textAlign: "center",
  },
  input: {
    width: THEME.sizes.input.width,
    backgroundColor: COLORS.inputBackground,
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: THEME.sizes.input.borderRadius,
    padding: THEME.spacing.md,
    marginBottom: THEME.spacing.lg,
    fontSize: THEME.fontSizes.body,
    color: COLORS.textDark,
  },
  button: {
    width: THEME.sizes.button.maxWidth,
    paddingVertical: THEME.sizes.button.paddingVertical,
    borderRadius: THEME.sizes.button.borderRadius,
    alignItems: "center",
  },
  buttonText: {
    fontSize: THEME.fontSizes.button,
    fontWeight: THEME.fontWeights.bold,
    color: COLORS.white,
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
