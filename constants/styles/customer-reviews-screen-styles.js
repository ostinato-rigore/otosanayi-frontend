import { StyleSheet } from "react-native";
import COLORS from "../colors";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: COLORS.border,
  },
  logoWrapper: {
    width: "100%",
    height: "100%",
    position: "relative",
  },
  logo: {
    width: "100%",
    height: "100%",
  },
  logoPlaceholder: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.cardBackground,
  },
  uploadText: {
    color: COLORS.textPrimary,
    fontSize: 16,
  },
  editIcon: {
    position: "absolute",
    bottom: 5,
    right: 5,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 2,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.textDark,
    marginBottom: 20,
    textAlign: "center",
  },
  inputContainer: {
    marginBottom: 15,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.inputBackground,
    borderRadius: 10,
    paddingHorizontal: 12,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: COLORS.textDark,
  },
  label: {
    fontSize: 16,
    color: COLORS.textDark,
    marginBottom: 5,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 12,
    marginTop: 5,
  },
  reviewsContainer: {
    marginBottom: 20,
  },
  reviewItem: {
    backgroundColor: COLORS.cardBackground,
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    elevation: 3,
    shadowColor: COLORS.black,
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  reviewHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  reviewIcon: {
    marginRight: 10,
  },
  reviewInfo: {
    flex: 1,
  },
  reviewMechanic: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.textDark,
    marginBottom: 5,
  },
  reviewRating: {
    fontSize: 14,
    color: COLORS.textPrimary,
    marginBottom: 5,
  },
  reviewComment: {
    fontSize: 14,
    color: COLORS.textPrimary,
    marginBottom: 5,
    fontStyle: "italic",
  },
  reviewDate: {
    fontSize: 12,
    color: COLORS.textPrimary,
    marginBottom: 10,
  },
  noReviewsText: {
    textAlign: "center",
    color: COLORS.textPrimary,
    fontSize: 16,
    marginTop: 20,
  },
  buttonContainer: {
    flexDirection: "column",
    gap: 10,
  },
  button: {
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "600",
  },
  detailsButton: {
    backgroundColor: COLORS.accentCustomer,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 5,
  },
  detailsButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: "500",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
  },
  loadingText: {
    color: COLORS.textPrimary,
    marginTop: 10,
  },
  listContainer: {
    paddingBottom: 20,
  },
});

export default styles;
