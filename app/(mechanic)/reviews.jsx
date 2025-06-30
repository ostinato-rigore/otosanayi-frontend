import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Text,
  View,
} from "react-native";
import { fetchMechanicReviews } from "../../api/apiClient";
import StarRating from "../../components/StarRating";
import COLORS from "../../constants/colors";
import styles from "../../constants/styles/mechanic/mechanic-reviews-screen-styles";

// ObjectId'den tarih tahmini için yardımcı fonksiyon
const getDateFromObjectId = (objectId) => {
  try {
    const timestamp = parseInt(objectId.substring(0, 8), 16) * 1000;
    return new Date(timestamp);
  } catch (error) {
    console.error("Error extracting date from ObjectId:", objectId, error);
    return null;
  }
};

// Tarih doğrulama ve formatlama için yardımcı fonksiyon
const formatReviewDate = (dateString, objectId, t) => {
  if (dateString) {
    try {
      const date = new Date(dateString);
      if (!isNaN(date.getTime())) {
        return date.toLocaleString("tr-TR", {
          year: "numeric",
          month: "numeric",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }); // Ör: "18/6/2025 12:43"
      }
    } catch (error) {
      console.error("Invalid date format:", dateString, error);
    }
  }
  if (objectId) {
    const estimatedDate = getDateFromObjectId(objectId);
    if (estimatedDate && !isNaN(estimatedDate.getTime())) {
      return `${t(
        "mechanicDetail.estimatedDate"
      )} ${estimatedDate.toLocaleDateString("tr-TR", {
        year: "numeric",
        month: "numeric",
        day: "numeric",
      })}`; // Ör: "Tahmini Tarih: 18/6/2025"
    }
  }
  return t("mechanicDetail.noDate");
};

const ReviewItem = ({ review }) => {
  const { t } = useTranslation();

  return (
    <View style={styles.reviewItem}>
      <View style={styles.reviewHeader}>
        <View style={styles.avatarContainer}>
          {review.customer?.profilePhoto ? (
            <Image
              source={{ uri: review.customer.profilePhoto }}
              style={styles.avatar}
            />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Ionicons
                name="person-outline"
                size={16}
                color={COLORS.accentMechanic}
              />
            </View>
          )}
        </View>
        <View style={styles.reviewAuthorContainer}>
          <Text style={styles.reviewMechanic}>
            {review.customer?.name ||
              review.mechanic?.name ||
              t("mechanicDetail.noInfo")}
          </Text>
        </View>
        <View style={styles.reviewRatingContainer}>
          <StarRating rating={review.rating || 0} size={14} />
          <Text style={styles.reviewRatingText}>{review.rating || 0}/5</Text>
        </View>
      </View>
      <Text style={styles.reviewComment}>
        {review.comment || t("mechanicDetail.noInfo")}
      </Text>

      <Text
        style={styles.reviewDate}
        accessibilityLabel={t("mechanicDetail.reviewDateAccessibility", {
          date: formatReviewDate(review.createdAt, review._id, t),
        })}
      >
        {formatReviewDate(review.createdAt, review._id, t)}
      </Text>
    </View>
  );
};

export default function MechanicReviews() {
  const { t } = useTranslation();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadReviews = async () => {
      try {
        const data = await fetchMechanicReviews();
        // Yorumları createdAt veya _id'den türetilen tarihe göre azalan sırayla sırala
        const sortedReviews = (data || []).sort((a, b) => {
          const dateA = a.createdAt
            ? new Date(a.createdAt)
            : getDateFromObjectId(a._id) || new Date(0);
          const dateB = b.createdAt
            ? new Date(b.createdAt)
            : getDateFromObjectId(b._id) || new Date(0);
          return dateB - dateA; // En yeni tarih önce
        });
        setReviews(sortedReviews);
      } catch (error) {
        Alert.alert(t("error"), t("mechanicDetail.reviewsLoadFailed"));
        console.error("Load Reviews Error:", error);
      } finally {
        setLoading(false);
      }
    };
    loadReviews();
  }, [t]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>{t("mechanicDetail.loading")}</Text>
      </View>
    );
  }

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={styles.content}
      ListHeaderComponent={
        <Text style={styles.sectionTitle}>
          {t("mechanicProfile.customerReviews")}
        </Text>
      }
      ListEmptyComponent={
        <Text style={styles.noReviewsText}>
          {t("customerReviews.noReviews")}
        </Text>
      }
      data={reviews}
      renderItem={({ item }) => <ReviewItem review={item} />}
      keyExtractor={(item) => item._id}
    />
  );
}
