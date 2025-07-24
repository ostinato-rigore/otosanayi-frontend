import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert } from "react-native";

const useImagePicker = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  const pickImage = async (options = {}) => {
    const {
      allowsEditing = true,
      aspect = [1, 1],
      quality = 0.5,
      onSuccess,
      onError,
    } = options;

    setLoading(true);

    try {
      // Permission check
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert(
          t("editProfile.permissionRequired"),
          t("editProfile.galleryPermission")
        );
        setLoading(false);
        return null;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "images",
        allowsEditing,
        aspect,
        quality,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const imageUri = result.assets[0].uri;
        setSelectedImage(imageUri);

        if (onSuccess) {
          onSuccess(imageUri);
        }

        Alert.alert(t("success"), t("editProfile.photoSelected"));
        setLoading(false);
        return imageUri;
      }
    } catch (error) {
      console.error("Image Picker Error:", error);
      Alert.alert(
        t("error"),
        error.message || t("editProfile.photoSelectionFailed")
      );

      if (onError) {
        onError(error);
      }
    } finally {
      setLoading(false);
    }

    return null;
  };

  const clearImage = () => {
    setSelectedImage(null);
  };

  return {
    selectedImage,
    loading,
    pickImage,
    clearImage,
    setSelectedImage,
  };
};

export default useImagePicker;
