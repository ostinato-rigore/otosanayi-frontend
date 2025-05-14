import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
  FlatList,
  Image,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import COLORS from "../../constants/colors";
import styles from "../../constants/styles/customer-home-styles";

/* --- Sabit Filtre Seçenekleri ve Örnek Veri --- */
const cities = ["İstanbul", "Ankara", "İzmir"];

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

const mockMechanics = [
  {
    id: "1",
    name: "Ahmet Usta",
    city: "İstanbul",
    district: "Kadıköy",
    expertiseAreas: ["Motor Tamiri", "Elektrik"],
    vehicleBrands: ["BMW", "Mercedes"],
    rating: 4.8,
    avatarUrl: "https://randomuser.me/api/portraits/men/1.jpg",
  },
  {
    id: "2",
    name: "Mehmet Usta",
    city: "Ankara",
    district: "Çankaya",
    expertiseAreas: ["Kaporta", "Boya"],
    vehicleBrands: ["Toyota", "Honda"],
    rating: 4.2,
    avatarUrl: null,
  },
  {
    id: "3",
    name: "Ayşe Usta",
    city: "İzmir",
    district: "Bornova",
    expertiseAreas: ["Fren Sistemleri", "Lastik"],
    vehicleBrands: ["Ford", "Volkswagen"],
    rating: 4.5,
    avatarUrl: "https://randomuser.me/api/portraits/women/3.jpg",
  },
];

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

  /* --- Filtreleme Fonksiyonu (optimize edilmiş useMemo ile) --- */
  const filteredMechanics = useMemo(() => {
    return mockMechanics.filter((m) => {
      const matchesSearch = m.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesCity = !filters.city || m.city === filters.city;
      const matchesDistrict =
        !filters.district || m.district === filters.district;
      const matchesExpertise =
        filters.expertiseAreas.length === 0 ||
        filters.expertiseAreas.every((area) => m.expertiseAreas.includes(area));
      const matchesBrands =
        filters.vehicleBrands.length === 0 ||
        filters.vehicleBrands.every((brand) => m.vehicleBrands.includes(brand));
      const matchesRating = m.rating >= filters.minRating;

      return (
        matchesSearch &&
        matchesCity &&
        matchesDistrict &&
        matchesExpertise &&
        matchesBrands &&
        matchesRating
      );
    });
  }, [filters, searchQuery]);

  /* --- Seçim Toggle Fonksiyonları --- */
  const toggleSelection = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter((v) => v !== value)
        : [...prev[key], value],
    }));
  };

  const resetFilters = () =>
    setFilters({
      city: "",
      district: "",
      expertiseAreas: [],
      vehicleBrands: [],
      minRating: 0,
    });

  /* --- Kart Bileşeni --- */
  const MechanicCard = ({ mechanic }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/customer/mechanic/${mechanic.id}`)}
    >
      <View style={styles.cardHeader}>
        <View style={styles.avatarContainer}>
          {mechanic.avatarUrl ? (
            <Image
              source={{ uri: mechanic.avatarUrl }}
              style={styles.avatarImage}
            />
          ) : (
            <Ionicons
              name="person-circle-outline"
              size={40}
              color={COLORS.accentCustomer}
            />
          )}
        </View>
        <Text style={styles.cardTitle}>{mechanic.name}</Text>
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
        onPress={() => router.push(`/customer/mechanic/${mechanic.id}`)}
      >
        <Text style={styles.detailsButtonText}>Detayları Gör</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  /* --- JSX --- */
  return (
    <View style={styles.container}>
      {/* Başlık ve Arama */}
      <View style={styles.header}>
        <Text style={styles.title}>Sanayiciler</Text>
        <View style={styles.searchContainer}>
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
          />
          <TouchableOpacity
            onPress={() => setFilterModalVisible(true)}
            style={styles.filterButton}
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
          <Text style={styles.emptyText}>Sanayici bulunamadı.</Text>
        }
      />

      {/* Modal */}
      <Modal
        visible={filterModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setFilterModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Filtreleme Seçenekleri</Text>
            <ScrollView style={styles.modalContent}>
              <FilterPicker
                label="Şehir"
                selectedValue={filters.city}
                onValueChange={(value) => {
                  setFilters((prev) => ({
                    ...prev,
                    city: value,
                    district: "",
                  }));
                }}
                options={cities}
              />

              {filters.city && (
                <FilterPicker
                  label="İlçe"
                  selectedValue={filters.district}
                  onValueChange={(value) =>
                    setFilters((prev) => ({ ...prev, district: value }))
                  }
                  options={districts[filters.city] || []}
                />
              )}

              <FilterPicker
                label="Uzmanlık Alanları"
                selectedValue=""
                onValueChange={(val) => toggleSelection("expertiseAreas", val)}
                options={expertiseAreasOptions}
              />

              <FilterPicker
                label="Araç Markaları"
                selectedValue=""
                onValueChange={(val) => toggleSelection("vehicleBrands", val)}
                options={vehicleBrandsOptions}
              />

              <FilterPicker
                label="Minimum Puan"
                selectedValue={filters.minRating}
                onValueChange={(val) =>
                  setFilters((prev) => ({ ...prev, minRating: val }))
                }
                options={ratingOptions}
              />
            </ScrollView>

            <View style={styles.modalButtons}>
              <ModalButton
                title="İptal"
                onPress={() => setFilterModalVisible(false)}
                style={styles.modalButtonCancel}
              />
              <ModalButton
                title="Sıfırla"
                onPress={resetFilters}
                style={styles.modalButtonReset}
              />
              <ModalButton
                title="Uygula"
                onPress={() => setFilterModalVisible(false)}
                style={styles.modalButtonApply}
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
  <>
    <Text style={styles.filterLabel}>{label}</Text>
    <View style={styles.pickerContainer}>
      <Picker
        selectedValue={selectedValue}
        onValueChange={onValueChange}
        style={styles.picker}
      >
        <Picker.Item label="Seçiniz" value="" />
        {options.map((item) => (
          <Picker.Item key={item} label={item} value={item} />
        ))}
      </Picker>
    </View>
  </>
);

/* --- Reusable Modal Button --- */
const ModalButton = ({ title, onPress, style }) => (
  <TouchableOpacity onPress={onPress} style={[styles.modalButton, style]}>
    <Text style={styles.modalButtonText}>{title}</Text>
  </TouchableOpacity>
);
