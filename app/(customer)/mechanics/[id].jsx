import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";

import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { fetchMechanicById, postReview } from "../../../api/apiClient";
import StarRating from "../../../components/StarRating";
import COLORS from "../../../constants/colors";
import styles from "../../../constants/styles/customer/mechanic-detail-styles";

const InfoRow = ({ labelText, text, style }) => (
  <View style={[styles.infoRowContainer, style]}>
    <View style={styles.infoRow}>
      <View style={styles.infoLabelContainer}>
        <Text style={styles.infoLabel}>{labelText}</Text>
      </View>
      <Text style={styles.infoValue}>{text}</Text>
    </View>
    <View style={styles.infoUnderline} />
  </View>
);

const ReviewCard = ({ review }) => (
  <View style={styles.reviewCard}>
    <View style={styles.reviewHeader}>
      <Text style={styles.reviewAuthor}>
        {review.customer?.name || "Anonim"}
      </Text>
      <View style={styles.reviewRatingContainer}>
        <StarRating rating={review.rating} size={14} />
        <Text style={styles.reviewRatingText}>{review.rating}/5</Text>
      </View>
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
  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const [commentsModalVisible, setCommentsModalVisible] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(5);

  const getMechanic = useCallback(async () => {
    try {
      const data = await fetchMechanicById(id);
      setMechanic(data);
      setReviews(data.reviews || []);
    } catch (error) {
      Alert.alert(
        "Hata",
        "Tamirci bilgileri yüklenemedi. Lütfen tekrar deneyin."
      );
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) getMechanic();
  }, [id, getMechanic]);

  const handleSubmitReview = async () => {
    if (!reviewText.trim()) {
      Alert.alert("Hata", "Lütfen bir yorum yazın.");
      return;
    }
    try {
      const newReview = await postReview(id, { rating, comment: reviewText });
      setReviews((prev) => [newReview, ...prev]);
      setReviewModalVisible(false);
      setReviewText("");
      setRating(5);
      Alert.alert("Başarılı", "Yorumunuz gönderildi.");
    } catch (error) {
      Alert.alert("Hata", error.message || "Yorum gönderilemedi.");
      console.log(error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.accentCustomer} />
        <Text style={styles.loadingText}>Yükleniyor...</Text>
      </View>
    );
  }

  if (!mechanic) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Tamirci bulunamadı.</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => {
            setLoading(true);
            getMechanic();
          }}
        >
          <Text style={styles.retryButtonText}>Tekrar Dene</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1, backgroundColor: COLORS.background }}
      keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
      >
        {/* Header Section */}
        <View style={styles.header}>
          {mechanic.mechanicLogo ? (
            <Image
              source={{ uri: mechanic.mechanicLogo }}
              style={styles.logo}
            />
          ) : (
            <View style={styles.logoPlaceholder}>
              <Ionicons name="car" size={40} color={COLORS.white} />
            </View>
          )}
          <Text style={styles.title}>
            {mechanic.mechanicName || mechanic.name}
          </Text>
          <View style={styles.ratingContainer}>
            <View style={styles.ratingStars}>
              <StarRating rating={mechanic.averageRating || 0} size={20} />
              <Text style={styles.ratingValue}>
                {mechanic.averageRating?.toFixed(1) || "0.0"}/5
              </Text>
            </View>
            <Text style={styles.ratingCount}>({reviews.length} yorum)</Text>
          </View>
        </View>

        {/* Contact Info Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>İletişim Bilgileri</Text>
          <InfoRow
            text={mechanic.phone || "Belirtilmemiş"}
            labelText={"Telefon"}
          />
          <InfoRow
            text={mechanic.email || "Belirtilmemiş"}
            labelText={"E-posta"}
          />
          <InfoRow
            text={`${mechanic.mechanicAddress?.city || "Belirtilmemiş"}${
              mechanic.mechanicAddress?.district
                ? `, ${mechanic.mechanicAddress.district}`
                : ""
            }`}
            labelText={"Konum"}
          />
          {mechanic.mechanicAddress?.fullAddress && (
            <View style={styles.fullAddressContainer}>
              <Text style={styles.addressLabel}>Adres:</Text>
              <Text style={styles.addressText}>
                {mechanic.mechanicAddress.fullAddress}
              </Text>
            </View>
          )}
        </View>

        {/* Working Hours Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Çalışma Saatleri</Text>
          <View style={styles.hoursContainer}>
            <InfoRow
              labelText={"Hafta İçi"}
              text={`${mechanic.workingHours?.weekdays?.open || "09:00"} - ${
                mechanic.workingHours?.weekdays?.close || "18:00"
              }`}
              style={styles.hoursRow}
            />
            <InfoRow
              labelText={"Hafta Sonu"}
              text={`${mechanic.workingHours?.weekend?.open || "10:00"} - ${
                mechanic.workingHours?.weekend?.close || "16:00"
              }`}
              style={styles.hoursRow}
            />
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
              onPress={() => setReviewModalVisible(true)}
            >
              <Text style={styles.addReviewText}>Yorum Yap</Text>
            </TouchableOpacity>
          </View>
          {reviews.length > 0 ? (
            <>
              <ReviewCard review={reviews[0]} />
              {reviews.length > 1 && (
                <TouchableOpacity
                  style={styles.viewCommentsButton}
                  onPress={() => setCommentsModalVisible(true)}
                >
                  <Text style={styles.viewCommentsText}>
                    Tüm Yorumları Görüntüle ({reviews.length})
                  </Text>
                </TouchableOpacity>
              )}
            </>
          ) : (
            <Text style={styles.noReviewsText}>Henüz yorum yapılmamış.</Text>
          )}
        </View>

        {/* Review Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={reviewModalVisible}
          onRequestClose={() => setReviewModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Yorum Yap</Text>

              <View style={styles.ratingInputContainer}>
                <Text style={styles.ratingLabel}>Puanınız:</Text>
                <View style={styles.starRatingContainer}>
                  <View style={styles.starContainer}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <TouchableOpacity
                        key={star}
                        onPress={() => setRating(star)}
                        activeOpacity={0.7}
                      >
                        <Ionicons
                          name={star <= rating ? "star" : "star-outline"}
                          size={28}
                          color="#FFD700"
                        />
                      </TouchableOpacity>
                    ))}
                  </View>
                  <Text style={styles.selectedRatingText}>{rating}/5</Text>
                </View>
              </View>
              <TextInput
                style={styles.reviewInput}
                multiline
                placeholder="Yorumunuzu buraya yazın..."
                placeholderTextColor={COLORS.placeholderText}
                value={reviewText}
                onChangeText={setReviewText}
              />

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setReviewModalVisible(false)}
                >
                  <Text style={styles.cancelButtonText}>İptal</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.submitButton]}
                  onPress={handleSubmitReview}
                >
                  <Text style={styles.submitButtonText}>Gönder</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Comments Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={commentsModalVisible}
          onRequestClose={() => setCommentsModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={[styles.modalContent, styles.commentsModalContent]}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  Tüm Yorumlar ({reviews.length})
                </Text>
                <TouchableOpacity
                  onPress={() => setCommentsModalVisible(false)}
                  style={styles.closeButton}
                >
                  <Ionicons name="close" size={24} color={COLORS.textDark} />
                </TouchableOpacity>
              </View>
              <FlatList
                data={reviews}
                renderItem={({ item }) => <ReviewCard review={item} />}
                keyExtractor={(item) => item._id}
                contentContainerStyle={styles.commentsListContent}
                showsVerticalScrollIndicator={false}
              />
            </View>
          </View>
        </Modal>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
