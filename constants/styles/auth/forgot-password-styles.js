import { StyleSheet } from "react-native";
import COLORS from "../../colors";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textPrimary,
    marginBottom: 30,
    textAlign: "center",
  },
  input: {
    width: "90%",
    backgroundColor: COLORS.inputBackground,
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
    color: COLORS.textDark,
  },
  button: {
    width: "90%",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.white,
  },
  error: {
    color: COLORS.error,
    fontSize: 14,
    marginBottom: 15,
    textAlign: "left",
    alignSelf: "flex-start",
    marginLeft: 20,
  },
});

export default styles;
