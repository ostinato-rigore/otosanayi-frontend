import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
} from "react-native";
import { fetchMechanicById } from "../../../api/apiClient";

export default function MechanicsDetail() {
  const { id } = useLocalSearchParams();
  const [mechanic, setMechanic] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("MechanicDetail ID:", id); // ID’yi kontrol et
    const getMechanic = async () => {
      try {
        const data = await fetchMechanicById(id);
        console.log("Mechanic Data:", data); // Veriyi kontrol et
        setMechanic(data);
      } catch (error) {
        Alert.alert("Hata", "Sanayici detayları yüklenemedi");
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    if (id) getMechanic();
  }, [id]);

  if (loading) {
    return <ActivityIndicator style={{ marginTop: 20 }} />;
  }

  if (!mechanic) {
    return <Text>Sanayici bulunamadı</Text>;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {mechanic.avatarUrl && (
        <Image source={{ uri: mechanic.avatarUrl }} style={styles.avatar} />
      )}
      <Text style={styles.name}>{mechanic.name || mechanic.mechanicName}</Text>
      <Text style={styles.info}>
        Konum: {mechanic.mechanicAddress?.city},{" "}
        {mechanic.mechanicAddress?.district}
      </Text>
      <Text style={styles.info}>
        Uzmanlık: {mechanic.expertiseAreas?.join(", ") || "Belirtilmemiş"}
      </Text>
      <Text style={styles.info}>
        Araç Markaları: {mechanic.vehicleBrands?.join(", ") || "Belirtilmemiş"}
      </Text>
      <Text style={styles.info}>Puan: {mechanic.averageRating || 0}/5</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: "center",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
  },
  info: {
    fontSize: 16,
    marginTop: 10,
  },
});
