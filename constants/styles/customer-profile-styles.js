import { StyleSheet } from "react-native";
import COLORS from "../colors";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: 15,
    alignItems: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
  },
  loadingText: {
    marginTop: 10,
    color: COLORS.textPrimary,
    fontSize: 14,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
    paddingTop: 20,
    paddingHorizontal: 10,
  },
  profileImageContainer: {
    marginRight: 15,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  profilePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
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
    fontSize: 20,
    fontWeight: "600",
    color: COLORS.textPrimary,
    marginBottom: 5,
  },
  email: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 15,
  },
  menuContainer: {
    width: "100%",
    marginBottom: 30,
    backgroundColor: COLORS.background,
    borderRadius: 12,
    paddingVertical: 15,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderBottomColor: COLORS.border,
  },
  menuItemText: {
    fontSize: 16,
    color: COLORS.textPrimary,
    marginLeft: 15,
  },
  logoutContainer: {
    width: "100%",
    backgroundColor: COLORS.background,
    borderRadius: 12,
    paddingVertical: 15,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 35,
    borderBottomColor: COLORS.border,
  },
  logoutButtonText: {
    fontSize: 16,
    color: COLORS.error,
    marginLeft: 15,
  },
});

export default styles;
