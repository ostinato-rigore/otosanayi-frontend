import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Linking,
  Modal,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { fetchMechanicById } from "../../../api/apiClient";
import ErrorBoundary from "../../../components/ErrorBoundary";
import OptimizedImage from "../../../components/OptimizedImage";
import StarRating from "../../../components/StarRating";
import COLORS from "../../../constants/colors";
import styles from "../../../constants/styles/mechanic/mechanic-detail-styles";

// ObjectId'den tarih tahmini için yardımcı fonksiyon
const getDateFromObjectId = (objectId) => {
  try {
    const timestamp = parseInt(objectId.substring(0, 8), 16) * 1000;
    return new Date(timestamp);
  } catch {
    return null;
  }
};

// Tarih formatlama için yardımcı fonksiyon
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
        });
      }
    } catch {
      // Hata durumunda fallback
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
      })}`;
    }
  }
  return t("mechanicDetail.noDate");
};

// Çalışma saatleri formatlama için yardımcı fonksiyon
const formatWorkingHours = (open, close, t) => {
  if (open === "closed" && close === "closed") {
    return t("mechanicProfile.closed");
  } else if (open === "closed" || close === "closed") {
    const openTime =
      open === "closed" ? t("mechanicProfile.closed") : open || "09:00";
    const closeTime =
      close === "closed" ? t("mechanicProfile.closed") : close || "18:00";
    return `${openTime} - ${closeTime}`;
  } else {
    return `${open || "09:00"} - ${close || "18:00"}`;
  }
};

// Yorumları tarihe göre sıralama için yardımcı fonksiyon
const sortReviewsByDate = (reviews) => {
  return reviews.sort((a, b) => {
    const dateA = new Date(a.createdAt || a._id);
    const dateB = new Date(b.createdAt || b._id);
    return dateB - dateA; // En yeni en üstte
  });
};

const InfoRow = ({
  labelText,
  text,
  style,
  accessibilityLabel,
  noUnderline,
}) => {
  return (
    <View style={[styles.infoRowContainer, style]}>
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>{labelText}</Text>
        <Text style={styles.infoValue} accessibilityLabel={accessibilityLabel}>
          {text}
        </Text>
      </View>
      {!noUnderline && <View style={styles.infoUnderline} />}
    </View>
  );
};

const ReviewCard = ({ review }) => {
  const { t } = useTranslation();

  return (
    <View style={styles.reviewCard}>
      <View style={styles.reviewHeader}>
        <View style={styles.avatarContainer}>
          {review.customer?.profilePhoto &&
          review.customer.profilePhoto.trim() ? (
            <OptimizedImage
              source={{ uri: review.customer.profilePhoto }}
              style={styles.avatar}
              fallbackIcon="person-outline"
            />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Ionicons
                name="person-outline"
                size={16}
                color={COLORS.placeholderText}
              />
            </View>
          )}
        </View>
        <View style={styles.reviewAuthorContainer}>
          <Text style={styles.reviewAuthor}>
            {review.customer?.name || t("mechanicDetail.anonymous")}
          </Text>
          <View style={styles.reviewRatingContainer}>
            <StarRating rating={review.rating || 0} size={14} />
            <Text style={styles.reviewRatingText}>{review.rating || 0}/5</Text>
          </View>
        </View>
      </View>
      <Text style={styles.reviewText}>
        {review.comment || t("mechanicDetail.noInfo")}
      </Text>
      <View style={styles.reviewFooter}>
        <Text
          style={styles.reviewDate}
          accessibilityLabel={t("mechanicDetail.reviewDateAccessibility", {
            date: formatReviewDate(review.createdAt, review._id, t),
          })}
        >
          {formatReviewDate(review.createdAt, review._id, t)}
        </Text>
        <View style={styles.likeContainer}>
          <Ionicons
            name="heart-outline"
            size={16}
            color={COLORS.textPrimary}
            style={styles.likeIcon}
          />
          <Text style={styles.likeCount}>{review.likeCount || 0}</Text>
        </View>
      </View>
    </View>
  );
};

export default function MechanicDetail() {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams();
  const [mechanic, setMechanic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [commentsModalVisible, setCommentsModalVisible] = useState(false);

  const getMechanic = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchMechanicById(id);

      // Yorumları en yeni tarihli olanın en üstte olacak şekilde sırala
      const sortedReviews = sortReviewsByDate(data.reviews || []);

      setMechanic(data);
      setReviews(sortedReviews);
    } catch (error) {
      console.log(error);
      Alert.alert(t("error"), t("mechanicDetail.mechanicNotFound"));
    } finally {
      setLoading(false);
    }
  }, [id, t]);

  useEffect(() => {
    if (id) getMechanic();
  }, [id, getMechanic]);

  const cleanUrl = (url) => {
    if (!url || typeof url !== "string" || !url.startsWith("http")) {
      return null;
    }
    return url;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.accentMechanic} />
        <Text
          style={styles.loadingText}
          accessibilityLabel={t("mechanicDetail.loadingAccessibility")}
        >
          {t("mechanicDetail.loading")}
        </Text>
      </View>
    );
  }

  if (!mechanic) {
    return (
      <View style={styles.errorContainer}>
        <Text
          style={styles.errorText}
          accessibilityLabel={t("mechanicDetail.mechanicNotFoundAccessibility")}
        >
          {t("mechanicDetail.mechanicNotFound")}
        </Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={getMechanic}
          accessibilityLabel={t("mechanicDetail.retryAccessibility")}
        >
          <Text style={styles.retryButtonText}>
            {t("mechanicDetail.retry")}
          </Text>
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
          {mechanic.mechanicLogo && mechanic.mechanicLogo.trim() ? (
            <OptimizedImage
              source={{ uri: mechanic.mechanicLogo }}
              style={styles.logo}
              fallbackIcon="business-outline"
              accessibilityLabel={t("mechanicDetail.mechanicLogo", {
                name: mechanic.mechanicName || mechanic.name,
              })}
            />
          ) : (
            <View style={styles.logoPlaceholder}>
              <Ionicons name="business" size={40} color={COLORS.white} />
            </View>
          )}
          <Text style={styles.title} accessibilityRole="header">
            {mechanic.mechanicName ||
              mechanic.name ||
              t("mechanicDetail.noInfo")}
          </Text>
          <View style={styles.ratingContainer}>
            <View style={styles.ratingStars}>
              <StarRating rating={mechanic.averageRating || 0} size={20} />
              <Text style={styles.ratingValue}>
                {(mechanic.averageRating || 0).toFixed(1)}/5
              </Text>
            </View>
            <Text style={styles.ratingCount}>
              ({reviews.length} {t("mechanicDetail.reviews")})
            </Text>
          </View>
        </View>

        {/* Contact Info Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle} accessibilityRole="header">
            {t("mechanicDetail.contactInfo")}
          </Text>
          {[
            {
              labelText: t("mechanicDetail.phone"),
              text: mechanic.phone || t("mechanicDetail.noInfo"),
              accessibilityLabel: t("mechanicDetail.phoneAccessibility", {
                phone: mechanic.phone || t("mechanicDetail.noInfo"),
              }),
            },
            {
              labelText: t("mechanicDetail.email"),
              text: mechanic.email || t("mechanicDetail.noInfo"),
              accessibilityLabel: t("mechanicDetail.emailAccessibility", {
                email: mechanic.email || t("mechanicDetail.noInfo"),
              }),
            },
            {
              labelText: t("mechanicDetail.location"),
              text: `${
                mechanic.mechanicAddress?.city || t("mechanicDetail.noInfo")
              }${
                mechanic.mechanicAddress?.district
                  ? `, ${mechanic.mechanicAddress.district}`
                  : ""
              }`,
              accessibilityLabel: t("mechanicDetail.locationAccessibility", {
                location: `${
                  mechanic.mechanicAddress?.city || t("mechanicDetail.noInfo")
                }${
                  mechanic.mechanicAddress?.district
                    ? `, ${mechanic.mechanicAddress.district}`
                    : ""
                }`,
              }),
            },
          ].map((row, index, array) => (
            <InfoRow
              key={index}
              labelText={row.labelText}
              text={row.text}
              accessibilityLabel={row.accessibilityLabel}
              noUnderline={index === array.length - 1}
            />
          ))}
          {mechanic.mechanicAddress?.fullAddress && (
            <View style={styles.fullAddressContainer}>
              <Text style={styles.addressLabel}>
                {t("mechanicDetail.address")}
              </Text>
              <Text
                style={styles.addressText}
                accessibilityLabel={t("mechanicDetail.addressAccessibility", {
                  address: mechanic.mechanicAddress.fullAddress,
                })}
              >
                {mechanic.mechanicAddress.fullAddress}
              </Text>
            </View>
          )}
        </View>

        {/* Working Hours Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle} accessibilityRole="header">
            {t("mechanicDetail.workingHours")}
          </Text>
          <View style={styles.hoursContainer}>
            {[
              {
                labelText: t("mechanicDetail.weekdays"),
                text: formatWorkingHours(
                  mechanic.workingHours?.weekdays?.open,
                  mechanic.workingHours?.weekdays?.close,
                  t
                ),
                accessibilityLabel: t("mechanicDetail.weekdaysAccessibility", {
                  hours: formatWorkingHours(
                    mechanic.workingHours?.weekdays?.open,
                    mechanic.workingHours?.weekdays?.close,
                    t
                  ),
                }),
              },
              {
                labelText: t("mechanicDetail.weekend"),
                text: formatWorkingHours(
                  mechanic.workingHours?.weekend?.open,
                  mechanic.workingHours?.weekend?.close,
                  t
                ),
                accessibilityLabel: t("mechanicDetail.weekendAccessibility", {
                  hours: formatWorkingHours(
                    mechanic.workingHours?.weekend?.open,
                    mechanic.workingHours?.weekend?.close,
                    t
                  ),
                }),
              },
            ].map((row, index, array) => (
              <InfoRow
                key={index}
                labelText={row.labelText}
                text={row.text}
                style={styles.hoursRow}
                accessibilityLabel={row.accessibilityLabel}
                noUnderline={index === array.length - 1}
              />
            ))}
          </View>
        </View>

        {/* Expertise Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle} accessibilityRole="header">
            {t("mechanicDetail.expertiseAreas")}
          </Text>
          <View style={styles.tagsContainer}>
            {mechanic.expertiseAreas?.length > 0 ? (
              mechanic.expertiseAreas.map((area, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{t(area)}</Text>
                </View>
              ))
            ) : (
              <Text
                style={styles.noInfoText}
                accessibilityLabel={t(
                  "mechanicDetail.noExpertiseAccessibility"
                )}
              >
                {t("mechanicDetail.noInfo")}
              </Text>
            )}
          </View>
        </View>

        {/* Vehicle Brands Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle} accessibilityRole="header">
            {t("mechanicDetail.vehicleBrands")}
          </Text>
          <View style={styles.tagsContainer}>
            {mechanic.vehicleBrands?.length > 0 ? (
              mechanic.vehicleBrands.map((brand, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{brand}</Text>
                </View>
              ))
            ) : (
              <Text
                style={styles.noInfoText}
                accessibilityLabel={t("mechanicDetail.noBrandsAccessibility")}
              >
                {t("mechanicDetail.noInfo")}
              </Text>
            )}
          </View>
        </View>

        {/* Social Media Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle} accessibilityRole="header">
            {t("mechanicDetail.socialMedia")}
          </Text>
          <View style={styles.socialContainer}>
            {mechanic.socialMedia?.facebook ||
            mechanic.socialMedia?.instagram ||
            mechanic.socialMedia?.twitter ? (
              <>
                {mechanic.socialMedia?.facebook && (
                  <TouchableOpacity
                    style={styles.socialButton}
                    onPress={async () => {
                      const url = cleanUrl(mechanic.socialMedia.facebook);
                      if (url) {
                        try {
                          await Linking.openURL(url);
                        } catch {
                          Alert.alert(
                            t("error"),
                            t("mechanicDetail.linkCannotBeOpened")
                          );
                        }
                      }
                    }}
                    disabled={!cleanUrl(mechanic.socialMedia.facebook)}
                    accessibilityLabel={t(
                      "mechanicDetail.facebookAccessibility"
                    )}
                  >
                    <FontAwesome name="facebook" size={24} color="#3b5998" />
                  </TouchableOpacity>
                )}
                {mechanic.socialMedia?.instagram && (
                  <TouchableOpacity
                    style={styles.socialButton}
                    onPress={async () => {
                      const url = cleanUrl(mechanic.socialMedia.instagram);
                      if (url) {
                        try {
                          await Linking.openURL(url);
                        } catch {
                          Alert.alert(
                            t("error"),
                            t("mechanicDetail.linkCannotBeOpened")
                          );
                        }
                      }
                    }}
                    disabled={!cleanUrl(mechanic.socialMedia.instagram)}
                    accessibilityLabel={t(
                      "mechanicDetail.instagramAccessibility"
                    )}
                  >
                    <FontAwesome name="instagram" size={24} color="#E1306C" />
                  </TouchableOpacity>
                )}
                {mechanic.socialMedia?.twitter && (
                  <TouchableOpacity
                    style={styles.socialButton}
                    onPress={async () => {
                      const url = cleanUrl(mechanic.socialMedia.twitter);
                      if (url) {
                        try {
                          await Linking.openURL(url);
                        } catch {
                          Alert.alert(
                            t("error"),
                            t("mechanicDetail.linkCannotBeOpened")
                          );
                        }
                      }
                    }}
                    disabled={!cleanUrl(mechanic.socialMedia.twitter)}
                    accessibilityLabel={t(
                      "mechanicDetail.twitterAccessibility"
                    )}
                  >
                    <FontAwesome name="twitter" size={24} color="#1DA1F2" />
                  </TouchableOpacity>
                )}
              </>
            ) : (
              <Text
                style={styles.noInfoText}
                accessibilityLabel={t(
                  "mechanicDetail.noSocialMediaAccessibility"
                )}
              >
                {t("mechanicDetail.noInfo")}
              </Text>
            )}
          </View>
        </View>

        {/* Reviews Section */}
        <View style={styles.section}>
          <View style={styles.reviewsHeader}>
            <Text style={styles.sectionTitle} accessibilityRole="header">
              {t("mechanicDetail.reviews")}
            </Text>
          </View>
          <ErrorBoundary>
            {reviews.length > 0 ? (
              <>
                <ReviewCard review={reviews[0]} />
                {reviews.length > 1 && (
                  <TouchableOpacity
                    style={styles.viewCommentsButton}
                    onPress={() => setCommentsModalVisible(true)}
                    accessibilityLabel={t(
                      "mechanicDetail.viewAllCommentsAccessibility",
                      { count: reviews.length }
                    )}
                  >
                    <Text style={styles.viewCommentsText}>
                      {t("mechanicDetail.viewAllComments")} ({reviews.length})
                    </Text>
                  </TouchableOpacity>
                )}
              </>
            ) : (
              <Text
                style={styles.noReviewsText}
                accessibilityLabel={t("mechanicDetail.noReviewsAccessibility")}
              >
                {t("mechanicDetail.noReviews")}
              </Text>
            )}
          </ErrorBoundary>
        </View>

        {/* Comments Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={commentsModalVisible}
          onRequestClose={() => setCommentsModalVisible(false)}
          accessibilityViewIsModal={true}
        >
          <View style={styles.modalContainer}>
            <View style={[styles.modalContent, styles.commentsModalContent]}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle} accessibilityRole="header">
                  {t("mechanicDetail.allComments")} ({reviews.length})
                </Text>
                <TouchableOpacity
                  onPress={() => setCommentsModalVisible(false)}
                  style={styles.closeButton}
                  accessibilityLabel={t(
                    "mechanicDetail.closeCommentsAccessibility"
                  )}
                >
                  <Ionicons name="close" size={24} color={COLORS.textDark} />
                </TouchableOpacity>
              </View>
              <FlatList
                data={reviews}
                renderItem={({ item }) => <ReviewCard review={item} />}
                keyExtractor={(item) => item._id || Math.random().toString()}
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
