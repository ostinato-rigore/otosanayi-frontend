import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";
import COLORS from "../constants/colors";

export default function StarRating({ rating, size = 16 }) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  return (
    <View style={styles.container}>
      {[...Array(5)].map((_, i) => {
        if (i < fullStars) {
          return (
            <Ionicons
              key={i}
              name="star"
              size={size}
              color={COLORS.accentCustomer}
            />
          );
        } else if (i === fullStars && hasHalfStar) {
          return (
            <Ionicons
              key={i}
              name="star-half"
              size={size}
              color={COLORS.accentCustomer}
            />
          );
        } else {
          return (
            <Ionicons
              key={i}
              name="star-outline"
              size={size}
              color={COLORS.accentCustomer}
            />
          );
        }
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
  },
});
