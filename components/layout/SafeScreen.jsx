// SafeScreen.jsx: Ekranı güvenli alanda (çentik, durum çubuğu dışında) gösterir ve arka plan rengini ayarlar.
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import COLORS from "../../constants/colors";

export default function SafeScreen({ children }) {
  const insets = useSafeAreaInsets(); // Cihazın güvenli alan kenar boşluklarını alır
  return (
    // paddingTop: insets.top: İçeriği çentik altına iterek kaydırır.
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // Tüm ekranı kaplar
    backgroundColor: COLORS.background, // Arka plan rengi
  },
});
