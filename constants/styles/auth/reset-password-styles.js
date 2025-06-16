import { StyleSheet } from "react-native";
import COLORS from "../../colors";
import THEME from "../../theme";

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: THEME.spacing.xl,
    backgroundColor: COLORS.background,
  },
  title: {
    fontSize: THEME.fontSizes.h1,
    fontWeight: THEME.fontWeights.extraBold,
    color: COLORS.textPrimary,
    marginBottom: THEME.spacing.md,
  },
  subtitle: {
    fontSize: THEME.fontSizes.h2,
    color: COLORS.textSecondary,
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
  passwordContainer: {
    width: THEME.sizes.input.width,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: THEME.spacing.lg,
  },
  passwordInput: {
    flex: 1,
    backgroundColor: COLORS.inputBackground,
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: THEME.sizes.input.borderRadius,
    padding: THEME.spacing.md,
    fontSize: THEME.fontSizes.body,
    color: COLORS.textDark,
  },
  iconContainer: {
    position: "absolute",
    right: THEME.spacing.md,
    padding: THEME.spacing.xs,
  },
  error: {
    color: COLORS.error,
    fontSize: THEME.fontSizes.secondary,
    marginBottom: THEME.spacing.md,
    textAlign: "left",
    alignSelf: "flex-start",
    marginLeft: THEME.spacing.xl,
  },
  button: {
    width: THEME.sizes.button.maxWidth,
    paddingVertical: THEME.sizes.button.paddingVertical,
    borderRadius: THEME.sizes.button.borderRadius,
    alignItems: "center",
    marginBottom: THEME.spacing.md,
  },
  buttonText: {
    fontSize: THEME.fontSizes.button,
    fontWeight: THEME.fontWeights.bold,
    color: COLORS.white,
  },
});
