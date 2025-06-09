// (customer)/reviews.jsx
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { fetchCustomerReviews } from "../../api/apiClient";
import COLORS from "../../constants/colors";
import styles from "../../constants/styles/customer/customer-reviews-screen-styles";

export default function CustomerReviews() {
  const router = useRouter();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadReviews = async () => {
      try {
        const data = await fetchCustomerReviews();
        setReviews(data || []);
      } catch (error) {
        Alert.alert("Hata", "Yorumlar yüklenemedi: " + error.message);
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    loadReviews();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  const ReviewItem = ({ review }) => (
    <View style={styles.reviewItem}>
      <View style={styles.reviewHeader}>
        <Ionicons
          name="person-outline"
          size={24}
          color={COLORS.primary}
          style={styles.reviewIcon}
        />
        <View style={styles.reviewInfo}>
          <Text style={styles.reviewMechanic}>
            Mechanic: {review.mechanic.name || "Unknown"} (
            {review.mechanic.mechanicName})
          </Text>
          <Text style={styles.reviewRating}>Rating: {review.rating} / 5</Text>
          <Text style={styles.reviewComment}>
            Comment: {review.comment || "No comment"}
          </Text>
          <Text style={styles.reviewDate}>
            Date: {new Date(review.createdAt).toLocaleDateString()}
          </Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.detailsButton}
        onPress={() => router.push(`/mechanics/${review.mechanic._id}`)}
      >
        <Text style={styles.detailsButtonText}>View Mechanic Details</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={styles.content}
      ListHeaderComponent={<Text style={styles.sectionTitle}>My Reviews</Text>}
      ListEmptyComponent={
        <Text style={styles.noReviewsText}>No reviews yet.</Text>
      }
      data={reviews}
      renderItem={({ item }) => <ReviewItem review={item} />}
      keyExtractor={(item) => item._id}
    />
  );
}
