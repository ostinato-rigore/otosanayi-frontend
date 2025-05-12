import { StyleSheet } from "react-native";
import COLORS from "../colors";

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: 20, paddingBottom: 40 },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
  },
  loadingText: { marginTop: 10, color: COLORS.textPrimary, fontSize: 16 },
  header: { alignItems: "center", marginBottom: 20 },
  logoContainer: { alignItems: "center" },
  logoWrapper: {
    position: "relative",
    width: 120,
    height: 120,
  },
  logo: { width: 120, height: 120, borderRadius: 60 },
  logoPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.cardBackground,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
    position: "relative", // İkonun doğru konumlanması için
  },
  uploadText: {
    color: COLORS.accentMechanic,
    fontSize: 16,
    fontWeight: "500",
  },
  editIcon: {
    position: "absolute",
    bottom: 5,
    right: 5,
    backgroundColor: COLORS.white, // İkonun daha belirgin olması için arka plan
    borderRadius: 12,
    padding: 2,
  },
  statusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    backgroundColor: COLORS.cardBackground,
    borderRadius: 10,
    marginBottom: 20,
    paddingHorizontal: 15,
  },
  verifiedBadge: { flexDirection: "row", alignItems: "center", gap: 5 },
  verifiedText: { color: "#4CAF50", fontWeight: "600" },
  ratingBox: { flexDirection: "row", alignItems: "center", gap: 4 },
  ratingText: { color: COLORS.textPrimary, fontWeight: "600" },
  reviewRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.cardBackground,
    padding: 15,
    marginBottom: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  reviewText: {
    marginLeft: 10,
    flex: 1,
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: "500",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.textPrimary,
    marginBottom: 10,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  inputContainer: { marginBottom: 15 },
  label: {
    marginBottom: 5,
    color: COLORS.textSecondary,
    fontWeight: "500",
    fontSize: 14,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: 10,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, fontSize: 16, paddingVertical: 12 },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    flexWrap: "wrap", // Üç buton için esneklik
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginHorizontal: 5,
    marginBottom: 10, // Butonlar arasında boşluk
  },
  buttonText: { color: COLORS.white, fontWeight: "600", fontSize: 16 },
});

export default styles;
