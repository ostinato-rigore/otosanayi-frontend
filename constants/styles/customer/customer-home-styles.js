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
    gap: 8,
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
    marginBottom: 20,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.textDark,
    marginBottom: 10,
  },
  dropdownButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLORS.inputBackground,
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  dropdownText: {
    fontSize: 15,
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
  dropdownCloseButton: {
    padding: 12,
    backgroundColor: COLORS.accentCustomer,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    alignItems: "center",
  },
  dropdownCloseText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: "600",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: COLORS.border,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  checkboxSelected: {
    backgroundColor: COLORS.accentCustomer,
    borderColor: COLORS.accentCustomer,
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
    marginBottom: 8,
  },
  chipSelected: {
    backgroundColor: COLORS.accentCustomer,
  },
  chipText: {
    fontSize: 14,
    color: COLORS.textDark,
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
    backgroundColor: COLORS.accentCustomer,
    borderColor: COLORS.accentCustomer,
  },
  ratingButtonText: {
    fontSize: 16,
    color: COLORS.textDark,
  },
  ratingButtonTextSelected: {
    color: COLORS.white,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
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
  loader: {
    marginVertical: 10,
  },
});

export default styles;
