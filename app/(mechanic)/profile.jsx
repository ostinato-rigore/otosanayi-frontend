import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import COLORS from "../../constants/colors";

export default function MechanicProfile() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "Ahmet Usta",
    email: "ahmet@usta.com",
    phone: "05555555555",
    mechanicName: "Ahmet Oto",
    mechanicLogo: "",
    mechanicAddress: {
      fullAddress: "42 Istanbul Street",
      city: "Istanbul",
      district: "Kadikoy",
    },
    website: "https://ahmetoto.com",
    socialMedia: {
      facebook: "facebook.com/ahmetoto",
      instagram: "instagram.com/ahmetoto",
      twitter: "twitter.com/ahmetoto",
    },
    reviews: new Array(12),
    averageRating: 4.7,
    isVerified: true,
  });

  const [isEditable, setIsEditable] = useState(false);

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleNestedChange = (key, subkey, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        [subkey]: value,
      },
    }));
  };

  const pickImage = async () => {
    if (!isEditable) return;
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 0.7,
      aspect: [1, 1],
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });

    if (!result.canceled) {
      setForm((prev) => ({
        ...prev,
        mechanicLogo: result.assets[0].uri,
      }));
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      {/* Logo */}
      <TouchableOpacity onPress={pickImage} style={styles.logoContainer}>
        {form.mechanicLogo ? (
          <Image source={{ uri: form.mechanicLogo }} style={styles.logo} />
        ) : (
          <Text style={styles.uploadText}>Upload Logo</Text>
        )}
      </TouchableOpacity>

      {/* Verified + Rating */}
      <View style={styles.statusRow}>
        {form.isVerified && (
          <View style={styles.verifiedBadge}>
            <Ionicons name="checkmark-circle" size={18} color="#4CAF50" />
            <Text style={styles.verifiedText}>Verified</Text>
          </View>
        )}
        <View style={styles.ratingBox}>
          <Ionicons name="star" size={18} color="#FFD700" />
          <Text style={styles.ratingText}>{form.averageRating} / 5</Text>
        </View>
      </View>

      {/* Review Count */}
      <TouchableOpacity
        style={styles.reviewRow}
        onPress={() => router.push("/mechanic/reviews")}
      >
        <Ionicons
          name="chatbubble-ellipses-outline"
          size={20}
          color={COLORS.accentMechanic}
        />
        <Text style={styles.reviewText}>
          {form.reviews?.length || 0} Reviews
        </Text>
        <Ionicons name="chevron-forward" size={20} color={COLORS.border} />
      </TouchableOpacity>

      {/* Inputs */}
      <Section>
        <Input
          label="Full Name"
          icon="person"
          value={form.name}
          editable={isEditable}
          onChangeText={(val) => handleChange("name", val)}
        />
        <Input label="Email" icon="mail" value={form.email} editable={false} />
        <Input
          label="Phone Number"
          icon="call"
          value={form.phone}
          editable={isEditable}
          onChangeText={(val) => handleChange("phone", val)}
        />
        <Input
          label="Garage Name"
          icon="business"
          value={form.mechanicName}
          editable={isEditable}
          onChangeText={(val) => handleChange("mechanicName", val)}
        />
      </Section>

      <Section>
        <Input
          label="Full Address"
          icon="location"
          multiline
          numberOfLines={3}
          value={form.mechanicAddress.fullAddress}
          editable={isEditable}
          onChangeText={(val) =>
            handleNestedChange("mechanicAddress", "fullAddress", val)
          }
        />
        <Input
          label="City"
          icon="map"
          value={form.mechanicAddress.city}
          editable={isEditable}
          onChangeText={(val) =>
            handleNestedChange("mechanicAddress", "city", val)
          }
        />
        <Input
          label="District"
          icon="navigate"
          value={form.mechanicAddress.district}
          editable={isEditable}
          onChangeText={(val) =>
            handleNestedChange("mechanicAddress", "district", val)
          }
        />
      </Section>

      <Section>
        <Input
          label="Website"
          icon="globe"
          value={form.website}
          editable={isEditable}
          onChangeText={(val) => handleChange("website", val)}
        />
        <Input
          label="Facebook"
          icon="logo-facebook"
          value={form.socialMedia.facebook}
          editable={isEditable}
          onChangeText={(val) =>
            handleNestedChange("socialMedia", "facebook", val)
          }
        />
        <Input
          label="Instagram"
          icon="logo-instagram"
          value={form.socialMedia.instagram}
          editable={isEditable}
          onChangeText={(val) =>
            handleNestedChange("socialMedia", "instagram", val)
          }
        />
        <Input
          label="Twitter"
          icon="logo-twitter"
          value={form.socialMedia.twitter}
          editable={isEditable}
          onChangeText={(val) =>
            handleNestedChange("socialMedia", "twitter", val)
          }
        />
      </Section>

      {/* Buttons */}
      <TouchableOpacity
        style={[
          styles.button,
          {
            backgroundColor: isEditable
              ? COLORS.accentMechanic
              : COLORS.primary,
          },
        ]}
        onPress={() => setIsEditable((prev) => !prev)}
      >
        <Text style={styles.buttonText}>
          {isEditable ? "Save" : "Edit Profile"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: COLORS.error }]}
      >
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function Input({ label, icon, ...props }) {
  return (
    <View style={{ marginBottom: 15 }}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputWrapper}>
        {icon && (
          <Ionicons
            name={icon}
            size={20}
            color={COLORS.placeholderText}
            style={{ marginRight: 10 }}
          />
        )}
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor:
                props.editable === false ? COLORS.background : COLORS.white,
              height: props.multiline ? 80 : 45,
              textAlignVertical: props.multiline ? "top" : "center",
            },
          ]}
          placeholder={label}
          placeholderTextColor={COLORS.placeholderText}
          {...props}
        />
      </View>
    </View>
  );
}

function Section({ children }) {
  return <View style={styles.section}>{children}</View>;
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: COLORS.background,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 10,
  },
  uploadText: {
    color: COLORS.accentMechanic,
    fontSize: 16,
    paddingVertical: 10,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  statusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    alignItems: "center",
  },
  verifiedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  verifiedText: {
    color: "#4CAF50",
    fontWeight: "600",
  },
  ratingBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  ratingText: {
    color: COLORS.textPrimary,
    fontWeight: "600",
  },
  reviewRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.cardBackground,
    padding: 10,
    marginBottom: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  reviewText: {
    marginLeft: 8,
    flex: 1,
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: "500",
  },
  section: {
    marginVertical: 10,
  },
  label: {
    marginBottom: 5,
    color: COLORS.textPrimary,
    fontWeight: "600",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 10,
  },
  button: {
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    alignItems: "center",
  },
  buttonText: {
    color: COLORS.white,
    fontWeight: "600",
    fontSize: 16,
  },
});
