import { StyleSheet } from "react-native";
import COLORS from "../../colors";
import THEME from "../../theme";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: THEME.spacing.md,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
  },
  loadingText: {
    marginTop: THEME.spacing.md,
    color: COLORS.textPrimary,
    fontSize: 16,
  },
  profileImageContainer: {
    alignSelf: "center",
    marginBottom: THEME.spacing.md,
    position: "relative",
  },
  profileImage: {
    width: THEME.sizes.logo.width,
    height: THEME.sizes.logo.height,
    borderRadius: THEME.sizes.logo.borderRadius,
  },
  profilePlaceholder: {
    width: THEME.sizes.logo.width,
    height: THEME.sizes.logo.height,
    borderRadius: THEME.sizes.logo.borderRadius,
    backgroundColor: COLORS.lightGray,
    justifyContent: "center",
    alignItems: "center",
  },
  cameraIcon: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 4,
  },
  profileName: {
    fontSize: THEME.fontSizes.h2,
    fontWeight: THEME.fontWeights.bold,
    color: COLORS.textPrimary,
    textAlign: "center",
    marginBottom: THEME.spacing.xl,
  },
  sectionTitle: {
    fontSize: THEME.fontSizes.h3,
    fontWeight: THEME.fontWeights.bold,
    color: COLORS.textPrimary,
    marginBottom: THEME.spacing.md,
  },
  cardContainer: {
    backgroundColor: COLORS.white,
    borderRadius: THEME.sizes.card.borderRadius,
    padding: THEME.sizes.card.padding,
    marginBottom: THEME.spacing.xs,
    elevation: THEME.sizes.card.elevation, // For Android shadow
    shadowColor: COLORS.black,
    shadowOpacity: THEME.sizes.card.shadowOpacity, // For iOS shadow
    shadowRadius: THEME.sizes.card.shadowRadius,
    shadowOffset: THEME.sizes.card.shadowOffset, // For iOS shadow
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingVertical: THEME.spacing.sm,
    minHeight: THEME.sizes.input.height,
  },
  disabledInputRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingVertical: THEME.spacing.md,
    minHeight: THEME.sizes.input.height,
    backgroundColor: COLORS.lightGray,
    opacity: 0.7,
  },
  label: {
    fontSize: THEME.fontSizes.body,
    color: COLORS.textSecondary,
    width: 100,
  },
  inputValue: {
    flex: 1,
    textAlign: "right",
    fontSize: THEME.fontSizes.body,
    color: COLORS.textPrimary,
    paddingVertical: 0,
  },
  disabledInputValue: {
    flex: 1,
    textAlign: "right",
    fontSize: THEME.fontSizes.body,
    color: COLORS.textSecondary,
    paddingVertical: 0,
  },
  errorText: {
    color: COLORS.error,
    fontSize: THEME.fontSizes.body,
    marginTop: THEME.spacing.md,
  },
  actionButtons: {
    marginTop: THEME.spacing.xl,
  },
  button: {
    paddingVertical: THEME.sizes.button.paddingVertical,
    borderRadius: THEME.sizes.button.borderRadius,
    alignItems: "center",
    marginBottom: THEME.spacing.md,
  },
  buttonText: {
    color: COLORS.white,
    fontWeight: "600",
    fontSize: THEME.fontSizes.h3,
  },
  filterSection: {
    marginBottom: THEME.spacing.md,
  },
  dropdownButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLORS.inputBackground,
    borderRadius: THEME.sizes.button.borderRadius,
    padding: THEME.spacing.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
    flex: 1,
  },
  dropdownText: {
    fontSize: THEME.fontSizes.body,
    color: COLORS.textDark,
  },
  dropdownContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginTop: 8,
    elevation: 5,
    shadowColor: COLORS.black,
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    position: "relative",
  },
  dropdownScroll: {
    maxHeight: 200,
  },
  dropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  dropdownItemText: {
    fontSize: 15,
    color: COLORS.textDark,
    flex: 1,
  },
});
