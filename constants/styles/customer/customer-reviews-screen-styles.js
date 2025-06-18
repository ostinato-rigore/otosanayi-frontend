import { StyleSheet } from "react-native";
import COLORS from "../../colors";
import THEME from "../../theme";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: THEME.spacing.lg,
    paddingBottom: 100,
  },
  sectionTitle: {
    fontSize: THEME.fontSizes.h1,
    fontWeight: THEME.fontWeights.extraBold,
    color: COLORS.primary,
    marginBottom: THEME.spacing.md,
  },
  noReviewsText: {
    fontSize: THEME.fontSizes.tag,
    color: COLORS.placeholderText,
    textAlign: "center",
    marginTop: THEME.spacing.lg,
    paddingVertical: THEME.spacing.lg,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
  },
  loadingText: {
    fontSize: THEME.fontSizes.tag,
    color: COLORS.textSecondary,
    marginTop: THEME.spacing.sm,
  },
  reviewItem: {
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
  reviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: THEME.spacing.sm,
  },
  reviewAuthorContainer: {
    flexDirection: "column",
    flex: 1,
  },
  reviewMechanic: {
    fontSize: THEME.fontSizes.tag,
    fontWeight: THEME.fontWeights.bold,
    color: COLORS.primary,
    marginBottom: THEME.spacing.xs,
  },
  reviewDate: {
    fontSize: 12,
    color: COLORS.placeholderText,
    lineHeight: 16,
  },
  reviewRatingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: THEME.spacing.sm,
  },
  reviewRatingText: {
    fontSize: THEME.fontSizes.tag,
    color: COLORS.textSecondary,
    marginLeft: THEME.spacing.xs,
  },
  reviewComment: {
    fontSize: THEME.fontSizes.secondary,
    color: COLORS.textPrimary,
    lineHeight: 18,
    marginBottom: THEME.spacing.sm,
  },
  detailsButton: {
    backgroundColor: COLORS.accentCustomer,
    borderRadius: THEME.sizes.button.borderRadius,
    paddingVertical: THEME.spacing.xs,
    paddingHorizontal: THEME.sizes.button.paddingHorizontal,
    alignSelf: "flex-end",
  },
  detailsButtonText: {
    color: COLORS.white,
    fontSize: THEME.fontSizes.tag,
    fontWeight: THEME.fontWeights.semiBold,
  },
});
