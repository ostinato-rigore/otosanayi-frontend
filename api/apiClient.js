import api from "../lib/axios";

export const updateCustomerProfile = async (customerData) => {
  try {
    const response = await api.put("customers/profile", customerData);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to update profile"
    );
  }
};

export const uploadProfilePhoto = async (imageUri) => {
  try {
    const formData = new FormData();
    formData.append("image", {
      uri: imageUri,
      type: "image/jpeg", // Varsayılan olarak JPEG kullanıyoruz, gerekirse dinamik olabilir
      name: "shop_logo.jpg", // Backend'de filename olarak kullanılacak
    });

    const response = await api.patch("customers/profile-photo", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to upload logo");
  }
};

export const deleteCustomerAccount = async () => {
  try {
    const response = await api.delete("customer/profile");
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to delete account"
    );
  }
};

export const updateMechanicProfile = async (mechanicData) => {
  try {
    const response = await api.put("/mechanics/profile", mechanicData);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to update profile"
    );
  }
};

export const uploadMechanicLogo = async (imageUri) => {
  try {
    const formData = new FormData();
    formData.append("image", {
      uri: imageUri,
      type: "image/jpeg", // Varsayılan olarak JPEG kullanıyoruz, gerekirse dinamik olabilir
      name: "shop_logo.jpg", // Backend'de filename olarak kullanılacak
    });

    const response = await api.patch("/mechanics/profile-logo", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to upload logo");
  }
};

export const deleteMechanicAccount = async () => {
  try {
    const response = await api.delete("/mechanics/profile");
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to delete account"
    );
  }
};
