import { StyleSheet } from "react-native";
import COLORS from "../../colors";
import THEME from "../../theme";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    padding: THEME.spacing.lg,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    elevation: 2,
  },
  title: {
    fontSize: THEME.fontSizes.h1,
    fontWeight: THEME.fontWeights.extraBold,
    color: COLORS.primary,
    marginBottom: THEME.spacing.md,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.inputBackground,
    borderRadius: THEME.sizes.input.borderRadius,
    paddingHorizontal: THEME.sizes.input.paddingHorizontal,
    marginTop: THEME.spacing.md,
  },
  searchIcon: {
    marginRight: THEME.spacing.sm,
  },
  searchInput: {
    flex: 1,
    height: THEME.sizes.input.height,
    color: COLORS.textDark,
    fontSize: THEME.fontSizes.body,
  },
  filterButton: {
    padding: THEME.spacing.sm,
  },
  listContainer: {
    padding: THEME.spacing.lg,
    paddingBottom: 100,
  },
  card: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: THEME.sizes.card.borderRadius,
    padding: THEME.sizes.card.padding,
    marginBottom: THEME.sizes.card.marginBottom,
    elevation: THEME.sizes.card.elevation,
    shadowColor: COLORS.black,
    shadowOpacity: THEME.sizes.card.shadowOpacity,
    shadowRadius: THEME.sizes.card.shadowRadius,
    shadowOffset: THEME.sizes.card.shadowOffset,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: THEME.spacing.md,
  },
  avatarContainer: {
    marginRight: THEME.spacing.sm,
  },
  avatarImage: {
    width: THEME.sizes.icon.xlarge,
    height: THEME.sizes.icon.xlarge,
    borderRadius: THEME.sizes.icon.xlarge / 2,
  },
  cardTitle: {
    fontSize: THEME.fontSizes.h2,
    fontWeight: THEME.fontWeights.bold,
    color: COLORS.textDark,
    flex: 1,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: THEME.spacing.xs,
  },
  ratingContainerStar: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    marginLeft: THEME.spacing.xs,
    color: COLORS.textDark,
    fontSize: THEME.fontSizes.body,
  },
  cardSubtitle: {
    fontSize: THEME.fontSizes.secondary,
    color: COLORS.textPrimary,
    marginBottom: THEME.spacing.sm,
  },
  cardText: {
    fontSize: THEME.fontSizes.secondary,
    color: COLORS.textPrimary,
    marginBottom: THEME.spacing.sm,
  },
  detailsButton: {
    backgroundColor: COLORS.accentMechanic,
    borderRadius: THEME.sizes.button.borderRadius,
    paddingVertical: 10,
    alignItems: "center",
    marginTop: THEME.spacing.md,
  },
  detailsButtonText: {
    color: COLORS.white,
    fontWeight: THEME.fontWeights.bold,
    fontSize: THEME.fontSizes.secondary,
  },
  emptyText: {
    textAlign: "center",
    color: COLORS.textPrimary,
    fontSize: THEME.fontSizes.body,
    marginTop: THEME.spacing.xl,
    padding: THEME.spacing.xl,
    backgroundColor: COLORS.cardBackground,
    borderRadius: THEME.sizes.card.borderRadius,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "90%",
    maxWidth: 500,
    backgroundColor: COLORS.white,
    borderRadius: THEME.sizes.card.borderRadius,
    padding: THEME.sizes.card.padding,
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: THEME.fontSizes.h1,
    fontWeight: THEME.fontWeights.extraBold,
    color: COLORS.primary,
    marginBottom: THEME.spacing.md,
    textAlign: "center",
  },
  modalContent: {
    marginBottom: THEME.spacing,
  },
  filterSection: {
    marginBottom: THEME.spacing.lg,
  },
  filterLabel: {
    fontSize: THEME.fontSizes.h3,
    fontWeight: THEME.fontWeights.bold,
    color: COLORS.primary,
    marginBottom: THEME.spacing.md,
  },
  dropdownButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLORS.inputBackground,
    borderRadius: THEME.sizes.input.borderRadius,
    padding: THEME.sizes.input.paddingHorizontal,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  dropdownText: {
    fontSize: THEME.fontSizes.body,
    color: COLORS.textDark,
  },
  dropdownContainer: {
    backgroundColor: COLORS.white,
    borderRadius: THEME.sizes.input.borderRadius,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginTop: THEME.spacing.sm,
    elevation: THEME.sizes.card.elevation,
    shadowColor: COLORS.black,
    shadowOpacity: THEME.sizes.card.shadowOpacity,
    shadowRadius: THEME.sizes.card.shadowRadius,
    shadowOffset: THEME.sizes.card.shadowOffset,
    position: "relative",
  },
  dropdownScroll: {
    maxHeight: 180,
  },
  dropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: THEME.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  dropdownItemText: {
    fontSize: THEME.fontSizes.body,
    color: COLORS.textDark,
    flex: 1,
  },
  dropdownCloseButton: {
    padding: THEME.spacing.md,
    backgroundColor: COLORS.accentMechanic,
    borderBottomLeftRadius: THEME.sizes.input.borderRadius,
    borderBottomRightRadius: THEME.sizes.input.borderRadius,
    alignItems: "center",
  },
  dropdownCloseText: {
    color: COLORS.white,
    fontSize: THEME.fontSizes.body,
    fontWeight: THEME.fontWeights.bold,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: COLORS.border,
    justifyContent: "center",
    alignItems: "center",
    marginRight: THEME.spacing.sm,
  },
  checkboxSelected: {
    backgroundColor: COLORS.accentMechanic,
    borderColor: COLORS.accentMechanic,
  },
  chipsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    backgroundColor: COLORS.inputBackground,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginBottom: THEME.spacing.sm,
  },
  chipSelected: {
    backgroundColor: COLORS.accentMechanic,
  },
  chipText: {
    fontSize: THEME.fontSizes.body,
    color: COLORS.textDark,
    fontWeight: "400",
  },
  chipTextSelected: {
    color: COLORS.white,
  },

  ratingButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.inputBackground,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  ratingButtonSelected: {
    backgroundColor: COLORS.accentMechanic,
    borderColor: COLORS.accentMechanic,
  },
  ratingButtonText: {
    fontSize: THEME.fontSizes.h3,
    color: COLORS.textDark,
  },
  ratingButtonTextSelected: {
    color: COLORS.white,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: THEME.spacing.lg,
  },
  modalButton: {
    flex: 1,
    paddingVertical: THEME.sizes.button.paddingVertical,
    borderRadius: THEME.sizes.button.borderRadius,
    alignItems: "center",
    marginHorizontal: THEME.spacing.xs,
  },
  modalButtonCancel: {
    backgroundColor: COLORS.error,
  },
  modalButtonReset: {
    backgroundColor: COLORS.textPrimary,
  },
  modalButtonApply: {
    backgroundColor: COLORS.accentMechanic,
  },
  modalButtonText: {
    color: COLORS.white,
    fontWeight: THEME.fontWeights.bold,
    fontSize: THEME.fontSizes.body,
  },
  loader: {
    marginVertical: THEME.spacing.sm,
  },
  loadingIndicator: {
    marginLeft: THEME.spacing.sm,
  },
});

export default styles;
