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
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { fetchMechanicById, postReview } from "../../../api/apiClient";
import StarRating from "../../../components/StarRating";
import COLORS from "../../../constants/colors";

export default function MechanicsDetail() {
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
    try {
      const newReview = await postReview(id, {
        rating,
        comment: reviewText,
      });
      setReviews([...reviews, newReview]);
      setModalVisible(false);
      setReviewText("");
      Alert.alert("Başarılı", "Yorumunuz gönderildi");
    } catch (error) {
      Alert.alert("Hata", "Yorum gönderilemedi");
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
          <StarRating rating={mechanic.averageRating} size={24} />
          <Text style={styles.ratingText}>
            {mechanic.averageRating?.toFixed(1) || "0.0"} ({reviews.length}{" "}
            yorum)
          </Text>
        </View>
      </View>

      {/* Contact Info Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>İletişim Bilgileri</Text>
        <View style={styles.infoRow}>
          <Ionicons name="call" size={20} color={COLORS.primary} />
          <Text style={styles.infoText}>
            {mechanic.phone || "Belirtilmemiş"}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="mail" size={20} color={COLORS.primary} />
          <Text style={styles.infoText}>{mechanic.email}</Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="location" size={20} color={COLORS.primary} />
          <Text style={styles.infoText}>
            {mechanic.mechanicAddress?.city},{" "}
            {mechanic.mechanicAddress?.district}
          </Text>
        </View>
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
          {mechanic.expertiseAreas?.map((area, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>{area}</Text>
            </View>
          ))}
          {mechanic.expertiseAreas?.length === 0 && (
            <Text style={styles.noInfoText}>Belirtilmemiş</Text>
          )}
        </View>
      </View>

      {/* Vehicle Brands Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Hizmet Verilen Markalar</Text>
        <View style={styles.tagsContainer}>
          {mechanic.vehicleBrands?.map((brand, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>{brand}</Text>
            </View>
          ))}
          {mechanic.vehicleBrands?.length === 0 && (
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
            renderItem={({ item }) => (
              <View style={styles.reviewCard}>
                <View style={styles.reviewHeader}>
                  <Text style={styles.reviewAuthor}>
                    {item.user?.name || "Anonim"}
                  </Text>
                  <StarRating rating={item.rating} size={16} />
                </View>
                <Text style={styles.reviewText}>{item.comment}</Text>
                <Text style={styles.reviewDate}>
                  {new Date(item.createdAt).toLocaleDateString()}
                </Text>
              </View>
            )}
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
                disabled={!reviewText.trim()}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 18,
    color: COLORS.textDark,
  },
  header: {
    alignItems: "center",
    padding: 20,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 15,
  },
  logoPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.textDark,
    marginBottom: 5,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  ratingText: {
    marginLeft: 10,
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  section: {
    backgroundColor: COLORS.white,
    marginTop: 10,
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  infoText: {
    fontSize: 16,
    color: COLORS.textDark,
    marginLeft: 10,
  },
  addressText: {
    fontSize: 14,
    color: COLORS.textPrimary,
    marginTop: 5,
    marginLeft: 30,
  },
  hoursContainer: {
    marginTop: 5,
  },
  hoursRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  hoursDay: {
    fontSize: 16,
    color: COLORS.textDark,
  },
  hoursTime: {
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  tag: {
    backgroundColor: COLORS.accentCustomer,
    borderRadius: 15,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    color: COLORS.white,
    fontSize: 14,
  },
  noInfoText: {
    fontSize: 16,
    color: COLORS.placeholderText,
  },
  socialContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  socialButton: {
    marginRight: 15,
  },
  reviewsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  addReviewButton: {
    backgroundColor: COLORS.accentCustomer,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addReviewText: {
    color: COLORS.white,
    fontSize: 14,
  },
  reviewCard: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 8,
    padding: 15,
    marginTop: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  reviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  reviewAuthor: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.textDark,
  },
  reviewText: {
    fontSize: 14,
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  reviewDate: {
    fontSize: 12,
    color: COLORS.placeholderText,
  },
  noReviewsText: {
    fontSize: 16,
    color: COLORS.placeholderText,
    textAlign: "center",
    marginTop: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "90%",
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 20,
    textAlign: "center",
  },
  ratingLabel: {
    fontSize: 16,
    color: COLORS.textDark,
    marginBottom: 10,
  },
  starContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  reviewInput: {
    height: 120,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
    textAlignVertical: "top",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: COLORS.inputBackground,
  },
  submitButton: {
    backgroundColor: COLORS.accentCustomer,
  },
  buttonText: {
    color: COLORS.white,
    fontWeight: "bold",
  },
});
