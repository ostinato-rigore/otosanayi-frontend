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
    marginBottom: 10,
    textAlign: "center",
  },
  infoText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 20,
    textAlign: "center",
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  otpInput: {
    width: 50,
    height: 50,
    borderWidth: 2,
    borderRadius: 8,
    textAlign: "center",
    marginHorizontal: 5,
    fontSize: 18,
    color: COLORS.textDark,
    backgroundColor: COLORS.inputBackground,
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
  resendText: {
    fontSize: 14,
    color: COLORS.primary,
    marginTop: 15,
    textDecorationLine: "underline",
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
