// (customer)/reviews.jsx
import { Ionicons } from "@expo/vector-icons"; // İkonlar için ekledik
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import COLORS from "../../constants/colors";
import styles from "../../constants/styles/customer-reviews-screen-styles";

// Sahte veri seti
const fakeReviews = [
  {
    _id: "review1",
    mechanic: {
      _id: "mechanic1",
      name: "Ahmet Usta",
      mechanicName: "Ahmet'in Tamir Atölyesi",
    },
    rating: 4.5,
    comment: "Harika bir hizmet, çok memnun kaldım!",
    createdAt: "2025-05-15T10:00:00Z",
  },
  {
    _id: "review2",
    mechanic: {
      _id: "mechanic2",
      name: "Ayşe Usta",
      mechanicName: "Ayşe Motor Servisi",
    },
    rating: 3.0,
    comment: "İyi bir servis ama biraz pahalı.",
    createdAt: "2025-05-10T14:30:00Z",
  },
  {
    _id: "review3",
    mechanic: {
      _id: "mechanic3",
      name: "Mehmet Usta",
      mechanicName: "Mehmet’in Garajı",
    },
    rating: 5.0,
    comment: "Mükemmel bir deneyim, kesinlikle öneririm!",
    createdAt: "2025-05-01T09:15:00Z",
  },
];

export default function CustomerReviews() {
  const router = useRouter();
  const { userId } = useLocalSearchParams();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadReviews = async () => {
      try {
        if (!userId) {
          Alert.alert("Error", "User ID is missing");
          return;
        }
        // Sahte veriyi kullan
        setReviews(fakeReviews);
      } catch (error) {
        Alert.alert("Hata", "Yorumlar yüklenemedi: " + error.message);
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    loadReviews();
  }, [userId]);

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
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.sectionTitle}>My Reviews</Text>
      {reviews.length > 0 ? (
        <FlatList
          data={reviews}
          renderItem={({ item }) => <ReviewItem review={item} />}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <Text style={styles.noReviewsText}>No reviews yet.</Text>
      )}
    </ScrollView>
  );
}
