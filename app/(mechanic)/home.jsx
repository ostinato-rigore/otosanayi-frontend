import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Modal,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { fetchMechanics } from "../../api/apiClient";
import COLORS from "../../constants/colors";
import styles from "../../constants/styles/mechanic/mechanic-home-styles";
import { VEHICLE_BRANDS } from "../../constants/vehicleData";

const FILTER_TYPES = {
  CITY: "city",
  DISTRICT: "district",
  EXPERTISE_AREAS: "expertiseAreas",
  VEHICLE_BRANDS: "vehicleBrands",
  MIN_RATING: "minRating",
};

const expertiseAreasOptions = [
  "customerHome.expertiseMotorRepair",
  "customerHome.expertiseElectrical",
  "customerHome.expertiseBodywork",
  "customerHome.expertisePainting",
  "customerHome.expertiseBrakeSystems",
  "customerHome.expertiseTires",
  "customerHome.expertiseTransmissionRepair",
  "customerHome.expertiseSuspension",
  "customerHome.expertiseExhaustSystems",
  "customerHome.expertiseACService",
  "customerHome.expertiseFuelSystem",
  "customerHome.expertiseWheelAlignment",
  "customerHome.expertiseClutchRepair",
  "customerHome.expertiseHydraulicSystems",
  "customerHome.expertiseAxleDifferential",
  "customerHome.expertiseOther",
];

const vehicleBrandsOptions = VEHICLE_BRANDS;
const ratingOptions = [0, 1, 2, 3, 4, 5];

export default function MechanicHome() {
  const router = useRouter();
  const { t } = useTranslation();

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
  const [dropdownVisible, setDropdownVisible] = useState(null);
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState({});
  const [isLoadingCities, setIsLoadingCities] = useState(false);

  const fetchCityData = async () => {
    setIsLoadingCities(true);
    try {
      const response = await axios.get(
        "https://turkiyeapi.dev/api/v1/provinces"
      );
      const result = response.data;

      if (result.status === "OK" && Array.isArray(result.data)) {
        const cityList = result.data.map((city) => city.name);
        const districtMap = result.data.reduce((acc, city) => {
          acc[city.name] = city.districts.map((dist) => dist.name);
          return acc;
        }, {});
        setCities(cityList);
        setDistricts(districtMap);
      } else {
        throw new Error("Geçersiz API yanıtı");
      }
    } catch (error) {
      console.error("Fetch City Data Error:", error);
      // Fallback to static data if API fails
      setCities(["İstanbul", "Ankara", "İzmir"]);
      setDistricts({
        İstanbul: ["Kadıköy", "Beşiktaş", "Şişli"],
        Ankara: ["Çankaya", "Kızılay", "Yenimahalle"],
        İzmir: ["Bornova", "Karşıyaka", "Konak"],
      });
    } finally {
      setIsLoadingCities(false);
    }
  };

  useEffect(() => {
    fetchCityData();
  }, []);

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
          mechanicLogo: mechanic.mechanicLogo || null,
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
        Alert.alert(
          t("error"),
          t("unexpectedError") || "Sanayiciler yüklenemedi"
        );
        console.error("Fetch Mechanics Error:", error);
      } finally {
        setLoading(false);
        if (refresh) {
          setRefreshing(false);
        }
      }
    },
    [appliedFilters, t]
  );

  useEffect(() => {
    fetchMechanicsData();
  }, [fetchMechanicsData]);

  const filteredMechanics = useMemo(() => {
    if (!searchQuery.trim()) {
      return mechanics;
    }

    const queryWords = searchQuery.toLowerCase().trim().split(/\s+/);

    return mechanics.filter((mechanic) => {
      const mechanicName = mechanic.mechanicName.toLowerCase();
      return queryWords.every((word) => mechanicName.includes(word));
    });
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
    setDropdownVisible(null);
    fetchMechanicsData(1, true);
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
    setDropdownVisible(null);
    fetchMechanicsData(1, true);
  };

  const toggleDropdown = (type) => {
    setDropdownVisible(dropdownVisible === type ? null : type);
  };

  const MechanicCard = ({ mechanic }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/(mechanic)/mechanics/${mechanic.id}`)}
      accessibilityLabel={t("customerHome.mechanicDetails", {
        name: mechanic.name,
      })}
    >
      <View style={styles.cardHeader}>
        <View style={styles.avatarContainer}>
          {mechanic.mechanicLogo ? (
            <Image
              source={{ uri: mechanic.mechanicLogo }}
              style={styles.avatarImage}
              onError={() =>
                console.log("Avatar yüklenemedi:", mechanic.mechanicLogo)
              }
            />
          ) : (
            <Ionicons
              name="person-circle-outline"
              size={40}
              color={COLORS.accentMechanic}
            />
          )}
        </View>
        <Text style={styles.cardTitle}>{mechanic.mechanicName}</Text>
        <View style={styles.ratingContainerStar}>
          <Ionicons name="star" size={16} color={COLORS.star} />
          <Text style={styles.ratingText}>{mechanic.rating}/5</Text>
        </View>
      </View>
      <Text style={styles.cardSubtitle}>
        {mechanic.city}, {mechanic.district}
      </Text>
      <Text style={styles.cardText}>
        {t("customerHome.expertise")}:{" "}
        {mechanic.expertiseAreas.map((area) => t(area)).join(", ")}
      </Text>
      <Text style={styles.cardText}>
        {t("customerHome.vehicleBrands")}: {mechanic.vehicleBrands.join(", ")}
      </Text>
      <TouchableOpacity
        style={styles.detailsButton}
        onPress={() => router.push(`/(customer)/mechanics/${mechanic.id}`)}
        accessibilityLabel={t("customerHome.viewDetails")}
      >
        <Text style={styles.detailsButtonText}>
          {t("customerHome.viewDetails")}
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const DropdownSelect = ({
    label,
    value,
    options,
    onSelect,
    type,
    isMultiSelect,
    selectedValues,
    onToggle,
  }) => (
    <View style={styles.filterSection}>
      <Text style={styles.filterLabel}>{label}</Text>
      <TouchableOpacity
        style={styles.dropdownButton}
        onPress={() => toggleDropdown(type)}
        accessibilityLabel={`${label} ${t("customerHome.selection")}`}
        disabled={
          isLoadingCities &&
          (type === FILTER_TYPES.CITY || type === FILTER_TYPES.DISTRICT)
        }
      >
        <Text style={styles.dropdownText}>
          {isLoadingCities &&
          (type === FILTER_TYPES.CITY || type === FILTER_TYPES.DISTRICT)
            ? t("customerHome.loading")
            : isMultiSelect
            ? selectedValues.length > 0
              ? `${selectedValues.length} ${t("customerHome.optionsSelected")}`
              : t("customerHome.select")
            : value || t("customerHome.select")}
        </Text>
        {isLoadingCities &&
        (type === FILTER_TYPES.CITY || type === FILTER_TYPES.DISTRICT) ? (
          <ActivityIndicator
            size="small"
            color={COLORS.accentMechanic}
            style={styles.loadingIndicator}
          />
        ) : (
          <Ionicons
            name={dropdownVisible === type ? "chevron-up" : "chevron-down"}
            size={20}
            color={COLORS.textPrimary}
          />
        )}
      </TouchableOpacity>
      {dropdownVisible === type && !isLoadingCities && (
        <View style={styles.dropdownContainer}>
          <ScrollView style={styles.dropdownScroll} nestedScrollEnabled>
            {!isMultiSelect && (
              <TouchableOpacity
                style={styles.dropdownItem}
                onPress={() => {
                  onSelect("");
                  toggleDropdown(null);
                }}
              >
                <Text style={styles.dropdownItemText}>
                  {t("customerHome.select")}
                </Text>
              </TouchableOpacity>
            )}
            {options.map((option) => (
              <TouchableOpacity
                key={option}
                style={styles.dropdownItem}
                onPress={() => {
                  if (isMultiSelect) {
                    onToggle(option);
                  } else {
                    onSelect(option);
                    toggleDropdown(null);
                  }
                }}
              >
                {isMultiSelect && (
                  <View
                    style={[
                      styles.checkbox,
                      selectedValues.includes(option) &&
                        styles.checkboxSelected,
                    ]}
                  >
                    {selectedValues.includes(option) && (
                      <Ionicons
                        name="checkmark"
                        size={16}
                        color={COLORS.white}
                      />
                    )}
                  </View>
                )}
                <Text style={styles.dropdownItemText}>{t(option)}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          {isMultiSelect && (
            <TouchableOpacity
              style={styles.dropdownCloseButton}
              onPress={() => toggleDropdown(null)}
            >
              <Text style={styles.dropdownCloseText}>
                {t("customerHome.close")}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );

  const MultiSelectChips = ({ label, options, selected, onToggle }) => (
    <View style={styles.filterSection}>
      <Text style={styles.filterLabel}>{label}</Text>
      <View style={styles.chipsContainer}>
        {options.map((option) => (
          <TouchableOpacity
            key={option}
            style={[
              styles.chip,
              selected.includes(t(option)) && styles.chipSelected,
            ]}
            onPress={() => onToggle(t(option))}
            accessibilityLabel={`${t(option)} ${
              selected.includes(t(option))
                ? t("customerHome.selected")
                : t("customerHome.notSelected")
            }`}
          >
            <Text
              style={[
                styles.chipText,
                selected.includes(t(option)) && styles.chipTextSelected,
              ]}
            >
              {t(option)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const RatingSelect = ({ label, selected, onSelect }) => (
    <View style={styles.filterSection}>
      <Text style={styles.filterLabel}>{label}</Text>
      <View style={styles.ratingContainer}>
        {ratingOptions.map((rating) => (
          <TouchableOpacity
            key={rating}
            style={[
              styles.ratingButton,
              selected === rating && styles.ratingButtonSelected,
            ]}
            onPress={() => onSelect(rating)}
            accessibilityLabel={`${rating} ${t("customerHome.ratingSelect")}`}
          >
            <Text
              style={[
                styles.ratingButtonText,
                selected === rating && styles.ratingButtonTextSelected,
              ]}
            >
              {rating}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderFilterItem = ({ item }) => {
    switch (item.type) {
      case FILTER_TYPES.CITY:
        return (
          <DropdownSelect
            label={t("customerHome.city")}
            value={filters.city}
            options={cities}
            onSelect={(value) =>
              setFilters((prev) => ({
                ...prev,
                city: value,
                district: "",
              }))
            }
            type={FILTER_TYPES.CITY}
            isMultiSelect={false}
          />
        );
      case FILTER_TYPES.DISTRICT:
        return filters.city ? (
          <DropdownSelect
            label={t("customerHome.district")}
            value={filters.district}
            options={districts[filters.city] || []}
            onSelect={(value) =>
              setFilters((prev) => ({ ...prev, district: value }))
            }
            type={FILTER_TYPES.DISTRICT}
            isMultiSelect={false}
          />
        ) : null;
      case FILTER_TYPES.EXPERTISE_AREAS:
        return (
          <MultiSelectChips
            label={t("customerHome.expertiseAreas")}
            options={expertiseAreasOptions.map((opt) => t(opt))}
            selected={filters.expertiseAreas}
            onToggle={(value) => toggleSelection("expertiseAreas", value)}
          />
        );
      case FILTER_TYPES.VEHICLE_BRANDS:
        return (
          <DropdownSelect
            label={t("customerHome.vehicleBrands")}
            options={vehicleBrandsOptions}
            selectedValues={filters.vehicleBrands}
            onToggle={(value) => toggleSelection("vehicleBrands", value)}
            type={FILTER_TYPES.VEHICLE_BRANDS}
            isMultiSelect={true}
          />
        );
      case FILTER_TYPES.MIN_RATING:
        return (
          <RatingSelect
            label={t("customerHome.minRating")}
            selected={filters.minRating}
            onSelect={(value) =>
              setFilters((prev) => ({ ...prev, minRating: value }))
            }
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
          {t("customerHome.title")}
        </Text>
        <View style={styles.searchContainer} accessibilityRole="search">
          <Ionicons
            name="search"
            size={20}
            style={styles.searchIcon}
            color={COLORS.placeholderText}
          />
          <TextInput
            placeholder={t("customerHome.searchPlaceholder")}
            placeholderTextColor={COLORS.placeholderText}
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchInput}
            accessibilityLabel={t("customerHome.searchAccessibility")}
          />
          <TouchableOpacity
            onPress={() => setFilterModalVisible(true)}
            style={styles.filterButton}
            accessibilityLabel={t("customerHome.filterAccessibility")}
          >
            <Ionicons name="filter" size={24} color={COLORS.accentMechanic} />
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
            {t("customerHome.emptyText")}
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
        onEndReached={() => {
          if (hasMore && !loading) {
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
              {t("customerHome.modalTitle")}
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
                title={t("customerHome.cancel")}
                onPress={() => setFilterModalVisible(false)}
                style={styles.modalButtonCancel}
                accessibilityLabel={t("customerHome.cancelAccessibility")}
              />
              <ModalButton
                title={t("customerHome.resetFilters")}
                onPress={resetFilters}
                style={styles.modalButtonReset}
                accessibilityLabel={t("customerHome.resetAccessibility")}
              />
              <ModalButton
                title={t("customerHome.applyFilters")}
                onPress={applyFilters}
                style={styles.modalButtonApply}
                accessibilityLabel={t("customerHome.applyAccessibility")}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const ModalButton = ({ title, onPress, style, accessibilityLabel }) => (
  <TouchableOpacity
    onPress={onPress}
    style={[styles.modalButton, style]}
    accessibilityLabel={accessibilityLabel}
  >
    <Text style={styles.modalButtonText}>{title}</Text>
  </TouchableOpacity>
);
