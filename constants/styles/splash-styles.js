import { StyleSheet } from "react-native";
import COLORS from "../colors";

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
    paddingHorizontal: 20, // Yanlardan boşluk ekledik
  },
  logo: {
    width: 400, // Daha makul bir boyut
    height: 400,
    marginBottom: 30,
    resizeMode: "contain",
  },
  title: {
    fontSize: 24, // Daha okunabilir boyut
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 15,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textPrimary,
    marginBottom: 40,
    textAlign: "center",
    lineHeight: 24, // Satır aralığı
    paddingHorizontal: 20, // Metin yan boşlukları
  },
  button: {
    width: "100%", // Tam genişlik
    paddingVertical: 15,
    borderRadius: 8,
    marginBottom: 15,
    alignItems: "center",
  },
  customerButton: {
    backgroundColor: COLORS.accentCustomer,
  },
  mechanicButton: {
    backgroundColor: COLORS.accentMechanic,
  },
  buttonText: {
    fontSize: 16,
    color: COLORS.white,
    fontWeight: "600", // Semi-bold
  },
});
