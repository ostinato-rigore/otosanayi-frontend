import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Modal,
  RefreshControl,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { fetchMechanics } from "../../api/apiClient";
import COLORS from "../../constants/colors";
import styles from "../../constants/styles/customer/customer-home-styles";

// Örnek filtre seçenekleri
const cities = ["İstanbul", "Ankara", "İzmir", "Bursa"];
const districts = {
  İstanbul: ["Kadıköy", "Beşiktaş", "Şişli"],
  Ankara: ["Çankaya", "Kızılay", "Yenimahalle"],
  İzmir: ["Bornova", "Karşıyaka", "Konak"],
};
const expertiseAreasOptions = [
  "Motor Tamiri",
  "Elektrik",
  "Kaporta",
  "Boya",
  "Fren Sistemleri",
  "Lastik",
];
const vehicleBrandsOptions = [
  "BMW",
  "Mercedes",
  "Toyota",
  "Honda",
  "Ford",
  "Volkswagen",
];
const ratingOptions = [0, 1, 2, 3, 4, 5];

// Filter item types
const FILTER_TYPES = {
  CITY: "city",
  DISTRICT: "district",
  EXPERTISE_AREAS: "expertiseAreas",
  VEHICLE_BRANDS: "vehicleBrands",
  MIN_RATING: "minRating",
};

/* --- Ana Bileşen --- */
export default function CustomerHome() {
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [filters, setFilters] = useState({
    city: "",
    district: "",
    expertiseAreas: [],
    vehicleBrands: [],
    minRating: 0,
  });
  const [appliedFilters, setAppliedFilters] = useState({
    city: "",
    district: "",
    expertiseAreas: [],
    vehicleBrands: [],
    minRating: 0,
  });
  const [mechanics, setMechanics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchMechanicsData = useCallback(
    async (pageNum = 1, refresh = false) => {
      setLoading(true);
      try {
        const result = await fetchMechanics({
          city: appliedFilters.city,
          district: appliedFilters.district,
          expertiseAreas: appliedFilters.expertiseAreas,
          vehicleBrands: appliedFilters.vehicleBrands,
          minRating: appliedFilters.minRating,
          page: pageNum,
          limit: 10,
        });

        const formattedMechanics = result.data.map((mechanic) => ({
          id: mechanic._id,
          name: mechanic.name || "Bilinmeyen Sanayici",
          mechanicName: mechanic.mechanicName || "Bilinmeyen Sanayici",
          city: mechanic.mechanicAddress?.city || "",
          district: mechanic.mechanicAddress?.district || "",
          expertiseAreas: mechanic.expertiseAreas || [],
          vehicleBrands: mechanic.vehicleBrands || [],
          rating: mechanic.averageRating || 0,
          avatarUrl: mechanic.avatarUrl || null,
        }));

        setMechanics((prev) => {
          const uniqueMechanics =
            refresh || pageNum === 1
              ? formattedMechanics
              : [...prev, ...formattedMechanics];
          return uniqueMechanics;
        });

        setHasMore(pageNum < result.totalPages);
        setPage(pageNum);
      } catch (error) {
        Alert.alert("Hata", error.message || "Sanayiciler yüklenemedi");
        console.error("Fetch Mechanics Error:", error);
      } finally {
        setLoading(false);
        if (refresh) {
          setRefreshing(false);
        }
      }
    },
    [appliedFilters]
  );

  useEffect(() => {
    fetchMechanicsData();
  }, [fetchMechanicsData]);

  const filteredMechanics = useMemo(() => {
    return mechanics.filter((mechanic) =>
      mechanic.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [mechanics, searchQuery]);

  const toggleSelection = (key, value) => {
    setFilters((prev) => {
      const updatedValues = prev[key].includes(value)
        ? prev[key].filter((v) => v !== value)
        : [...prev[key], value];
      return { ...prev, [key]: updatedValues };
    });
  };

  const applyFilters = () => {
    setAppliedFilters({ ...filters });
    setFilterModalVisible(false);
    fetchMechanicsData(1, true); // Filtreler değiştiğinde 1. sayfadan başla
  };

  const resetFilters = () => {
    setFilters({
      city: "",
      district: "",
      expertiseAreas: [],
      vehicleBrands: [],
      minRating: 0,
    });
    setAppliedFilters({
      city: "",
      district: "",
      expertiseAreas: [],
      vehicleBrands: [],
      minRating: 0,
    });
    fetchMechanicsData(1, true); // Sıfırlama sonrası 1. sayfadan başla
  };

  const MechanicCard = ({ mechanic }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => {
        console.log("Navigating to:", `/(customer)/mechanics/${mechanic.id}`);
        router.push(`/(customer)/mechanics/${mechanic.id}`);
      }}
      accessibilityLabel={`Mekanik detayları: ${mechanic.name}`}
    >
      <View style={styles.cardHeader}>
        <View style={styles.avatarContainer}>
          {mechanic.avatarUrl ? (
            <Image
              source={{ uri: mechanic.avatarUrl }}
              style={styles.avatarImage}
              onError={() =>
                console.log("Avatar yüklenemedi:", mechanic.avatarUrl)
              }
            />
          ) : (
            <Ionicons
              name="person-circle-outline"
              size={40}
              color={COLORS.accentCustomer}
            />
          )}
        </View>
        <Text style={styles.cardTitle}>{mechanic.mechanicName}</Text>
        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={16} color={COLORS.accentCustomer} />
          <Text style={styles.ratingText}>{mechanic.rating}/5</Text>
        </View>
      </View>
      <Text style={styles.cardSubtitle}>
        {mechanic.city}, {mechanic.district}
      </Text>
      <Text style={styles.cardText}>
        Uzmanlık: {mechanic.expertiseAreas.join(", ")}
      </Text>
      <Text style={styles.cardText}>
        Araç Markaları: {mechanic.vehicleBrands.join(", ")}
      </Text>
      <TouchableOpacity
        style={styles.detailsButton}
        onPress={() => {
          console.log("Navigating to:", `/mechanics/${mechanic.id}`);
          router.push(`/(customer)/mechanics/${mechanic.id}`);
        }}
        accessibilityLabel="Detayları gör"
      >
        <Text style={styles.detailsButtonText}>Detayları Gör</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderFilterItem = ({ item }) => {
    switch (item.type) {
      case FILTER_TYPES.CITY:
        return (
          <FilterPicker
            label="Şehir"
            selectedValue={filters.city}
            onValueChange={(value) =>
              setFilters((prev) => ({
                ...prev,
                city: value,
                district: "",
              }))
            }
            options={cities}
          />
        );
      case FILTER_TYPES.DISTRICT:
        return filters.city ? (
          <FilterPicker
            label="İlçe"
            selectedValue={filters.district}
            onValueChange={(value) =>
              setFilters((prev) => ({ ...prev, district: value }))
            }
            options={districts[filters.city] || []}
          />
        ) : null;
      case FILTER_TYPES.EXPERTISE_AREAS:
        return (
          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Uzmanlık Alanları</Text>
            <FlatList
              data={expertiseAreasOptions}
              renderItem={({ item: option }) => (
                <TouchableOpacity
                  style={styles.checkboxContainer}
                  onPress={() => toggleSelection("expertiseAreas", option)}
                  accessibilityLabel={`${option} seçeneği ${
                    filters.expertiseAreas.includes(option)
                      ? "seçildi"
                      : "seçilmedi"
                  }`}
                >
                  <View
                    style={[
                      styles.checkbox,
                      filters.expertiseAreas.includes(option) &&
                        styles.checkboxSelected,
                    ]}
                  >
                    {filters.expertiseAreas.includes(option) && (
                      <Ionicons
                        name="checkmark"
                        size={16}
                        color={COLORS.white}
                      />
                    )}
                  </View>
                  <Text style={styles.checkboxLabel}>{option}</Text>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item}
              style={styles.checkboxList}
            />
          </View>
        );
      case FILTER_TYPES.VEHICLE_BRANDS:
        return (
          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Araç Markaları</Text>
            <FlatList
              data={vehicleBrandsOptions}
              renderItem={({ item: option }) => (
                <TouchableOpacity
                  style={styles.checkboxContainer}
                  onPress={() => toggleSelection("vehicleBrands", option)}
                  accessibilityLabel={`${option} seçeneği ${
                    filters.vehicleBrands.includes(option)
                      ? "seçildi"
                      : "seçilmedi"
                  }`}
                >
                  <View
                    style={[
                      styles.checkbox,
                      filters.vehicleBrands.includes(option) &&
                        styles.checkboxSelected,
                    ]}
                  >
                    {filters.vehicleBrands.includes(option) && (
                      <Ionicons
                        name="checkmark"
                        size={16}
                        color={COLORS.white}
                      />
                    )}
                  </View>
                  <Text style={styles.checkboxLabel}>{option}</Text>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item}
              style={styles.checkboxList}
            />
          </View>
        );
      case FILTER_TYPES.MIN_RATING:
        return (
          <FilterPicker
            label="Minimum Puan"
            selectedValue={filters.minRating}
            onValueChange={(value) =>
              setFilters((prev) => ({ ...prev, minRating: value }))
            }
            options={ratingOptions}
          />
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {/* Başlık ve Arama */}
      <View style={styles.header}>
        <Text style={styles.title} accessibilityRole="header">
          Sanayiciler
        </Text>
        <View style={styles.searchContainer} accessibilityRole="search">
          <Ionicons
            name="search"
            size={20}
            style={styles.searchIcon}
            color={COLORS.placeholderText}
          />
          <TextInput
            placeholder="Sanayici ara..."
            placeholderTextColor={COLORS.placeholderText}
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchInput}
            accessibilityLabel="Sanayici arama çubuğu"
          />
          <TouchableOpacity
            onPress={() => setFilterModalVisible(true)}
            style={styles.filterButton}
            accessibilityLabel="Filtreleme menüsünü aç"
          >
            <Ionicons name="filter" size={24} color={COLORS.accentCustomer} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Liste */}
      <FlatList
        data={filteredMechanics}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => <MechanicCard mechanic={item} />}
        ListEmptyComponent={
          <Text style={styles.emptyText} accessibilityRole="alert">
            Sanayici bulunamadı.
          </Text>
        }
        refreshing={loading}
        onRefresh={() => {
          setRefreshing(true);
          fetchMechanicsData(1, true);
        }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              fetchMechanicsData(1, true);
            }}
            colors={[COLORS.accentCustomer]}
            tintColor={COLORS.accentCustomer}
          />
        }
        onEndReached={async () => {
          if (hasMore && !loading) {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            fetchMechanicsData(page + 1);
          }
        }}
        onEndReachedThreshold={0.1}
        ListFooterComponent={
          loading && mechanics.length > 0 ? (
            <ActivityIndicator
              size="small"
              color={COLORS.accentCustomer}
              style={styles.loader}
            />
          ) : null
        }
      />

      {/* Modal */}
      <Modal
        visible={filterModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setFilterModalVisible(false)}
        accessibilityViewIsModal={true}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle} accessibilityRole="header">
              Filtreleme Seçenekleri
            </Text>
            <FlatList
              data={[
                { type: FILTER_TYPES.CITY },
                { type: FILTER_TYPES.DISTRICT },
                { type: FILTER_TYPES.EXPERTISE_AREAS },
                { type: FILTER_TYPES.VEHICLE_BRANDS },
                { type: FILTER_TYPES.MIN_RATING },
              ]}
              renderItem={renderFilterItem}
              keyExtractor={(item, index) => index.toString()}
              style={styles.modalContent}
              contentContainerStyle={{ paddingBottom: 16 }}
            />
            <View style={styles.modalButtons}>
              <ModalButton
                title="İptal"
                onPress={() => setFilterModalVisible(false)}
                style={styles.modalButtonCancel}
                accessibilityLabel="Filtreleme iptal"
              />
              <ModalButton
                title="Sıfırla"
                onPress={resetFilters}
                style={styles.modalButtonReset}
                accessibilityLabel="Filtreleri sıfırla"
              />
              <ModalButton
                title="Uygula"
                onPress={applyFilters}
                style={styles.modalButtonApply}
                accessibilityLabel="Filtreleri uygula"
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

/* --- Reusable Picker --- */
const FilterPicker = ({ label, selectedValue, onValueChange, options }) => (
  <View style={styles.filterSection}>
    <Text style={styles.filterLabel}>{label}</Text>
    <View style={styles.pickerContainer}>
      <Picker
        selectedValue={selectedValue}
        onValueChange={onValueChange}
        style={styles.picker}
        accessibilityLabel={`${label} seçimi`}
      >
        <Picker.Item label="Seçiniz" value="" />
        {options.map((item) => (
          <Picker.Item key={item} label={`${item}`} value={item} />
        ))}
      </Picker>
    </View>
  </View>
);

const ModalButton = ({ title, onPress, style, accessibilityLabel }) => (
  <TouchableOpacity
    onPress={onPress}
    style={[styles.modalButton, style]}
    accessibilityLabel={accessibilityLabel}
  >
    <Text style={styles.modalButtonText}>{title}</Text>
  </TouchableOpacity>
);
