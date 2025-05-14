import { StyleSheet } from "react-native";
import COLORS from "../colors";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    padding: 16,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.textDark,
    marginBottom: 8,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.inputBackground,
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: COLORS.textDark,
  },
  filterButton: {
    padding: 8,
  },
  listContainer: {
    padding: 16,
  },
  card: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: COLORS.black,
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  avatarContainer: {
    marginRight: 12,
  },
  avatarImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.textDark,
    flex: 1,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    marginLeft: 4,
    color: COLORS.textDark,
    fontSize: 14,
  },
  cardSubtitle: {
    fontSize: 14,
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  cardText: {
    fontSize: 14,
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  detailsButton: {
    backgroundColor: COLORS.accentCustomer,
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: "center",
    marginTop: 8,
  },
  detailsButtonText: {
    color: COLORS.white,
    fontWeight: "bold",
  },
  emptyText: {
    textAlign: "center",
    color: COLORS.textPrimary,
    fontSize: 16,
    marginTop: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "90%",
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.textDark,
    marginBottom: 16,
  },
  modalContent: {
    marginBottom: 16,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.textDark,
    marginBottom: 8,
  },
  pickerContainer: {
    backgroundColor: COLORS.inputBackground,
    borderRadius: 8,
    marginBottom: 16,
  },
  picker: {
    height: 55,
    color: COLORS.textDark,
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
    marginHorizontal: 4,
  },
  modalButtonCancel: {
    backgroundColor: COLORS.error,
  },
  modalButtonReset: {
    backgroundColor: COLORS.textPrimary,
  },
  modalButtonApply: {
    backgroundColor: COLORS.accentCustomer,
  },
  modalButtonText: {
    color: COLORS.white,
    fontWeight: "bold",
  },
});

export default styles;
