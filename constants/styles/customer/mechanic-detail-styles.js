import { StyleSheet } from "react-native";
import COLORS from "../../colors";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    paddingBottom: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
  },
  errorText: {
    fontSize: 16,
    color: COLORS.textDark,
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: COLORS.accentCustomer,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  retryButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: "600",
  },
  header: {
    alignItems: "center",
    padding: 16,
    backgroundColor: COLORS.background,
  },
  logo: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  logoPlaceholder: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: COLORS.accentCustomer,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.textDark,
    marginBottom: 6,
    textAlign: "center",
  },
  ratingContainer: {
    alignItems: "center",
    marginTop: 6,
  },
  ratingStars: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingValue: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.textDark,
    marginLeft: 6,
  },
  ratingCount: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  section: {
    backgroundColor: COLORS.white,
    marginTop: 10,
    padding: 16,
    borderRadius: 8,
    marginHorizontal: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.primary,
    marginBottom: 12,
  },
  infoRowContainer: {
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    width: 100,
  },
  infoValue: {
    fontSize: 14,
    color: COLORS.textDark,
    textAlign: "right",
    flex: 1,
  },
  infoUnderline: {
    height: 1,
    backgroundColor: COLORS.border,
    marginTop: 6,
  },
  fullAddressContainer: {
    marginTop: 8,
    padding: 10,
    backgroundColor: COLORS.inputBackground,
    borderRadius: 6,
  },
  addressLabel: {
    fontSize: 13,
    fontWeight: "500",
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  addressText: {
    fontSize: 14,
    color: COLORS.textDark,
    lineHeight: 20,
  },
  hoursContainer: {
    marginTop: 4,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
  },
  tag: {
    backgroundColor: COLORS.accentCustomer,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: "500",
  },
  noInfoText: {
    fontSize: 14,
    color: COLORS.placeholderText,
    marginTop: 6,
  },
  socialContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  socialButton: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    borderRadius: 22,
    backgroundColor: COLORS.inputBackground,
  },
  reviewsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  addReviewButton: {
    backgroundColor: COLORS.accentCustomer,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    alignItems: "center",
  },
  addReviewText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: "600",
  },
  reviewCard: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  reviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  reviewAuthor: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textDark,
  },
  reviewRatingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  reviewRatingText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginLeft: 4,
  },
  reviewText: {
    fontSize: 13,
    color: COLORS.textPrimary,
    lineHeight: 18,
    marginBottom: 8,
  },
  reviewDate: {
    fontSize: 12,
    color: COLORS.placeholderText,
  },
  noReviewsText: {
    fontSize: 14,
    color: COLORS.placeholderText,
    textAlign: "center",
    marginTop: 10,
    paddingVertical: 16,
  },
  viewCommentsButton: {
    backgroundColor: COLORS.inputBackground,
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: "center",
    marginTop: 8,
  },
  viewCommentsText: {
    color: COLORS.accentCustomer,
    fontSize: 13,
    fontWeight: "600",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "90%",
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 20,
  },
  commentsModalContent: {
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.primary,
    marginBottom: 10,
  },
  closeButton: {
    padding: 4,
  },
  ratingInputContainer: {
    marginBottom: 16,
    flexDirection: "row", // Changed from column to row
    alignItems: "center", // Vertically center items
    justifyContent: "space-between", // Space between label and stars
  },
  ratingLabel: {
    fontSize: 15,
    color: COLORS.textDark,
    marginRight: 10, // Added margin between label and stars
  },
  starRatingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  starContainer: {
    flexDirection: "row",
    marginRight: 10, // Added margin between stars and rating text
  },
  selectedRatingText: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.textDark,
  },
  reviewInput: {
    height: 120,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    textAlignVertical: "top",
    fontSize: 14,
    color: COLORS.textDark,
    backgroundColor: COLORS.inputBackground,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 8,
  },
  cancelButton: {
    backgroundColor: COLORS.inputBackground,
  },
  cancelButtonText: {
    color: COLORS.textDark,
    fontSize: 14,
    fontWeight: "600",
  },
  submitButton: {
    backgroundColor: COLORS.accentCustomer,
  },
  submitButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: "600",
  },
  commentsListContent: {
    paddingBottom: 20,
  },
});
