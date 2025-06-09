import { StyleSheet } from "react-native";
import COLORS from "../../colors";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    padding: 20,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    elevation: 2,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: COLORS.textDark,
    marginBottom: 12,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.inputBackground,
    borderRadius: 10,
    paddingHorizontal: 14,
    marginTop: 12,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 44,
    color: COLORS.textDark,
    fontSize: 16,
  },
  filterButton: {
    padding: 10,
  },
  listContainer: {
    padding: 20,
    paddingBottom: 100,
  },
  card: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    elevation: 3,
    shadowColor: COLORS.black,
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  avatarContainer: {
    marginRight: 16,
  },
  avatarImage: {
    width: 44,
    height: 44,
    borderRadius: 22,
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
    marginLeft: 6,
    color: COLORS.textDark,
    fontSize: 14,
  },
  cardSubtitle: {
    fontSize: 13,
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  cardText: {
    fontSize: 13,
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  detailsButton: {
    backgroundColor: COLORS.accentCustomer,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: "center",
    marginTop: 12,
  },
  detailsButtonText: {
    color: COLORS.white,
    fontWeight: "bold",
    fontSize: 14,
  },
  emptyText: {
    textAlign: "center",
    color: COLORS.textPrimary,
    fontSize: 16,
    marginTop: 24,
    padding: 20,
    backgroundColor: COLORS.cardBackground,
    borderRadius: 10,
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
    borderRadius: 16,
    padding: 24,
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: COLORS.textDark,
    marginBottom: 20,
    textAlign: "center",
  },
  modalContent: {
    marginBottom: 20,
  },
  filterSection: {
    marginBottom: 24,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.textDark,
    marginBottom: 12,
  },
  pickerContainer: {
    backgroundColor: COLORS.inputBackground,
    borderRadius: 10,
    marginBottom: 16,
  },
  picker: {
    height: 55,
    color: COLORS.textDark,
  },
  checkboxList: {
    maxHeight: 200,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: COLORS.border,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  checkboxSelected: {
    backgroundColor: COLORS.accentCustomer,
    borderColor: COLORS.accentCustomer,
  },
  checkboxLabel: {
    fontSize: 15,
    color: COLORS.textPrimary,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginHorizontal: 6,
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
    fontWeight: "600",
    fontSize: 15,
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 20,
    backgroundColor: COLORS.cardBackground,
    borderRadius: 10,
    marginTop: 12,
  },
  paginationButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: COLORS.accentCustomer,
    borderRadius: 8,
  },
  disabledButton: {
    backgroundColor: COLORS.border,
  },
  paginationText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: "500",
  },
  loader: {
    marginVertical: 10,
  },
});

export default styles;
