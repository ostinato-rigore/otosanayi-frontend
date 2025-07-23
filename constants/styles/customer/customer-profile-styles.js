import { StyleSheet } from "react-native";
import COLORS from "../../colors";
import THEME from "../../theme";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flexGrow: 1,
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
  card: {
    width: "100%",
    backgroundColor: COLORS.white,
    borderRadius: THEME.sizes.card.borderRadius,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: COLORS.black,
    shadowOpacity: THEME.sizes.card.shadowOpacity,
    shadowRadius: THEME.sizes.card.shadowRadius,
    shadowOffset: THEME.sizes.card.shadowOffset,
    elevation: THEME.sizes.card.elevation,
    flexGrow: 1,
    position: "relative",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: THEME.spacing.sm,
    paddingTop: THEME.spacing.lg,
    paddingHorizontal: THEME.spacing.sm,
  },
  profileImageContainer: {
    marginRight: THEME.spacing.sm,
    padding: THEME.spacing.md,
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
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.accentCustomer,
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
    backgroundColor: COLORS.cardBackground,
    paddingVertical: THEME.spacing.md,
    padding: THEME.spacing.md,
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
  spacer: {
    flex: 1,
  },
  logoutContainer: {
    width: "100%",
    backgroundColor: COLORS.cardBackground,
    padding: THEME.spacing.md,

    paddingVertical: THEME.spacing.md,
    position: "absolute",
    bottom: 0,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: THEME.spacing.md,
    paddingHorizontal: THEME.spacing.md,
    borderBottomColor: COLORS.border,
  },
  logoutButtonText: {
    fontSize: THEME.fontSizes.h3,
    color: COLORS.error,
    marginLeft: THEME.spacing.md,
  },
});

export default styles;
