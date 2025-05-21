import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { fetchMechanicById, postReview } from "../../../api/apiClient";
import StarRating from "../../../components/StarRating";
import COLORS from "../../../constants/colors";
import styles from "../../../constants/styles/mechanic-detail-styles";
// InfoRow bileşeni
const InfoRow = ({ iconName, text, iconColor = COLORS.primary, style }) => (
  <View style={[styles.infoRow, style]}>
    <Ionicons name={iconName} size={20} color={iconColor} />
    <Text style={styles.infoText}>{text}</Text>
  </View>
);

// ReviewCard bileşeni
const ReviewCard = ({ review }) => (
  <View style={styles.reviewCard}>
    <View style={styles.reviewHeader}>
      <Text style={styles.reviewAuthor}>
        {review.customer.name || "Anonim"}
      </Text>
      <StarRating rating={review.rating} size={16} />
    </View>
    <Text style={styles.reviewText}>{review.comment}</Text>
    <Text style={styles.reviewDate}>
      {new Date(review.createdAt).toLocaleDateString()}
    </Text>
  </View>
);

export default function MechanicDetail() {
  const { id } = useLocalSearchParams();
  const [mechanic, setMechanic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(5);

  useEffect(() => {
    const getMechanic = async () => {
      try {
        const data = await fetchMechanicById(id);
        setMechanic(data);
        setReviews(data.reviews || []);
        console.log("Fetched mechanic data:", data.reviews[0]);
      } catch (error) {
        Alert.alert("Hata", "Sanayici detayları yüklenemedi");
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    if (id) getMechanic();
  }, [id]);

  const handleSubmitReview = async () => {
    if (!reviewText.trim()) {
      Alert.alert("Hata", "Lütfen bir yorum yazın");
      return;
    }
    if (rating < 1 || rating > 5) {
      Alert.alert("Hata", "Puan 1 ile 5 arasında olmalıdır");
      return;
    }
    try {
      const newReview = await postReview(id, { rating, comment: reviewText });
      setReviews((prev) => [newReview, ...prev]); // Yeni yorumu listeye ekle
      setModalVisible(false);
      setReviewText("");
      setRating(5);
      Alert.alert("Başarılı", "Yorumunuz gönderildi");
    } catch (error) {
      Alert.alert("Hata", error.message || "Yorum gönderilemedi");
      console.log(error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.accentCustomer} />
      </View>
    );
  }

  if (!mechanic) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Sanayici bulunamadı</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        {mechanic.mechanicLogo ? (
          <Image source={{ uri: mechanic.mechanicLogo }} style={styles.logo} />
        ) : (
          <View style={styles.logoPlaceholder}>
            <Ionicons name="car-sport" size={40} color={COLORS.white} />
          </View>
        )}
        <Text style={styles.title}>
          {mechanic.mechanicName || mechanic.name}
        </Text>
        <View style={styles.ratingContainer}>
          <StarRating rating={mechanic.averageRating} size={20} />
          <Text style={styles.ratingText}>
            {mechanic.averageRating?.toFixed(1) || "0.0"} ({reviews.length}{" "}
            yorum)
          </Text>
        </View>
      </View>

      {/* Contact Info Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>İletişim Bilgileri</Text>
        <InfoRow iconName="call" text={mechanic.phone || "Belirtilmemiş"} />
        <InfoRow iconName="mail" text={mechanic.email} />
        <InfoRow
          iconName="location"
          text={`${mechanic.mechanicAddress?.city}, ${mechanic.mechanicAddress?.district}`}
        />
        {mechanic.mechanicAddress?.fullAddress && (
          <Text style={styles.addressText}>
            {mechanic.mechanicAddress.fullAddress}
          </Text>
        )}
      </View>

      {/* Working Hours Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Çalışma Saatleri</Text>
        <View style={styles.hoursContainer}>
          <View style={styles.hoursRow}>
            <Text style={styles.hoursDay}>Hafta İçi:</Text>
            <Text style={styles.hoursTime}>
              {mechanic.workingHours?.weekdays?.open || "09:00"} -{" "}
              {mechanic.workingHours?.weekdays?.close || "18:00"}
            </Text>
          </View>
          <View style={styles.hoursRow}>
            <Text style={styles.hoursDay}>Hafta Sonu:</Text>
            <Text style={styles.hoursTime}>
              {mechanic.workingHours?.weekend?.open || "10:00"} -{" "}
              {mechanic.workingHours?.weekend?.close || "16:00"}
            </Text>
          </View>
        </View>
      </View>

      {/* Expertise Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Uzmanlık Alanları</Text>
        <View style={styles.tagsContainer}>
          {mechanic.expertiseAreas?.length > 0 ? (
            mechanic.expertiseAreas.map((area, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{area}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.noInfoText}>Belirtilmemiş</Text>
          )}
        </View>
      </View>

      {/* Vehicle Brands Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Hizmet Verilen Markalar</Text>
        <View style={styles.tagsContainer}>
          {mechanic.vehicleBrands?.length > 0 ? (
            mechanic.vehicleBrands.map((brand, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{brand}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.noInfoText}>Belirtilmemiş</Text>
          )}
        </View>
      </View>

      {/* Social Media Section */}
      {(mechanic.socialMedia?.facebook ||
        mechanic.socialMedia?.instagram ||
        mechanic.socialMedia?.twitter) && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sosyal Medya</Text>
          <View style={styles.socialContainer}>
            {mechanic.socialMedia?.facebook && (
              <TouchableOpacity style={styles.socialButton}>
                <FontAwesome name="facebook" size={24} color="#3b5998" />
              </TouchableOpacity>
            )}
            {mechanic.socialMedia?.instagram && (
              <TouchableOpacity style={styles.socialButton}>
                <FontAwesome name="instagram" size={24} color="#E1306C" />
              </TouchableOpacity>
            )}
            {mechanic.socialMedia?.twitter && (
              <TouchableOpacity style={styles.socialButton}>
                <FontAwesome name="twitter" size={24} color="#1DA1F2" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}

      {/* Reviews Section */}
      <View style={styles.section}>
        <View style={styles.reviewsHeader}>
          <Text style={styles.sectionTitle}>Yorumlar</Text>
          <TouchableOpacity
            style={styles.addReviewButton}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.addReviewText}>Yorum Yap</Text>
          </TouchableOpacity>
        </View>

        {reviews.length > 0 ? (
          <FlatList
            data={reviews}
            scrollEnabled={false}
            renderItem={({ item }) => <ReviewCard review={item} />}
            keyExtractor={(item) => item._id}
          />
        ) : (
          <Text style={styles.noReviewsText}>Henüz yorum yapılmamış</Text>
        )}
      </View>

      {/* Review Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Yorum Yap</Text>

            <Text style={styles.ratingLabel}>Puanınız:</Text>
            <View style={styles.starContainer}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity key={star} onPress={() => setRating(star)}>
                  <Ionicons
                    name={star <= rating ? "star" : "star-outline"}
                    size={32}
                    color={COLORS.accentCustomer}
                  />
                </TouchableOpacity>
              ))}
            </View>

            <TextInput
              style={styles.reviewInput}
              multiline
              placeholder="Yorumunuzu buraya yazın..."
              value={reviewText}
              onChangeText={setReviewText}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>İptal</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.submitButton]}
                onPress={handleSubmitReview}
              >
                <Text style={styles.buttonText}>Gönder</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}
