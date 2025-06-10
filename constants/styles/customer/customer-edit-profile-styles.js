// constants/styles/customer-edit-profile-styles.js
import { StyleSheet } from "react-native";
import COLORS from "../../colors";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
  },
  loadingText: {
    marginTop: 16,
    color: COLORS.textPrimary,
    fontSize: 16,
  },
  profileImageContainer: {
    alignSelf: "center",
    marginBottom: 16,
    position: "relative",
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  profilePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
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
    fontSize: 20,
    fontWeight: "600",
    color: COLORS.textPrimary,
    textAlign: "center",
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.textPrimary,
    marginBottom: 12,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingVertical: 12,
    minHeight: 48,
  },
  disabledInputRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingVertical: 12,
    minHeight: 48,
    backgroundColor: COLORS.lightGray, // Değiştirilemez olduğunu gösterir
    opacity: 0.7, // Hafif soluk görünüm
  },
  label: {
    fontSize: 16,
    color: COLORS.textSecondary,
    width: 100,
  },
  inputValue: {
    flex: 1,
    textAlign: "right",
    fontSize: 16,
    color: COLORS.textPrimary,
    paddingVertical: 0,
  },
  disabledInputValue: {
    flex: 1,
    textAlign: "right",
    fontSize: 16,
    color: COLORS.textSecondary, // Daha soluk renk
    paddingVertical: 0,
  },
  picker: {
    flex: 1,
    color: COLORS.textPrimary,
    fontSize: 16,
  },
  disabledPicker: {
    opacity: 0.5,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 12,
    marginTop: 12,
  },
  actionButtons: {
    marginTop: 24,
  },
  button: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 12,
  },
  buttonText: {
    color: COLORS.white,
    fontWeight: "600",
    fontSize: 16,
  },
});
