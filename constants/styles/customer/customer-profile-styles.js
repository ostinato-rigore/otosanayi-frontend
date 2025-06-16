import { StyleSheet } from "react-native";
import COLORS from "../../colors";
import THEME from "../../theme";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: THEME.spacing.md,
    alignItems: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
  },
  loadingText: {
    marginTop: THEME.spacing.sm,
    color: COLORS.textPrimary,
    fontSize: THEME.fontSizes.secondary,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: THEME.spacing.xxl,
    paddingTop: THEME.spacing.lg,
    paddingHorizontal: THEME.spacing.md,
  },
  profileImageContainer: {
    marginRight: THEME.spacing.lg,
  },
  profileImage: {
    width: THEME.sizes.logo.width,
    height: THEME.sizes.logo.height,
    borderRadius: THEME.sizes.logo.borderRadius,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  profilePlaceholder: {
    width: THEME.sizes.logo.width,
    height: THEME.sizes.logo.height,
    borderRadius: THEME.sizes.logo.borderRadius,
    backgroundColor: COLORS.cardBackground,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  profileInfo: {
    flex: 1,
  },
  name: {
    fontSize: THEME.fontSizes.h2,
    fontWeight: THEME.fontWeights.bold,
    color: COLORS.textPrimary,
    marginBottom: THEME.spacing.sm,
  },
  email: {
    fontSize: THEME.fontSizes.tag,
    color: COLORS.textSecondary,
    marginBottom: THEME.spacing.sm,
  },
  menuContainer: {
    width: "100%",
    marginBottom: THEME.spacing.xxl,
    backgroundColor: COLORS.background,
    paddingVertical: THEME.spacing.md,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: THEME.spacing.md,
    paddingHorizontal: THEME.spacing.md,
    borderBottomColor: COLORS.border,
  },
  menuItemText: {
    fontSize: THEME.fontSizes.h3,
    color: COLORS.textPrimary,
    marginLeft: THEME.spacing.md,
  },
  logoutContainer: {
    width: "100%",
    backgroundColor: COLORS.background,
    paddingVertical: THEME.spacing.md,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: THEME.spacing.md,
    paddingHorizontal: THEME.spacing.xxl,
    borderBottomColor: COLORS.border,
  },
  logoutButtonText: {
    fontSize: THEME.fontSizes.h3,
    color: COLORS.error,
    marginLeft: THEME.spacing.md,
  },
});

export default styles;
