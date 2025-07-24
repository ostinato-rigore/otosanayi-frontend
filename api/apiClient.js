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
    const response = await api.delete("customers/profile");
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to delete account"
    );
  }
};

export const updateMechanicProfile = async (mechanicData) => {
  try {
    const response = await api.put("mechanics/profile", mechanicData);
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

    const response = await api.patch("mechanics/profile-logo", formData, {
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
    const response = await api.delete("mechanics/profile");
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to delete account"
    );
  }
};

export const fetchMechanics = async (filters = {}) => {
  try {
    const {
      city,
      district,
      expertiseAreas,
      vehicleBrands,
      minRating,
      page = 1,
      limit = 10,
    } = filters;

    const params = {
      city,
      district,
      expertiseAreas: expertiseAreas ? expertiseAreas.join(",") : undefined,
      vehicleBrands: vehicleBrands ? vehicleBrands.join(",") : undefined,
      minRating,
      page,
      limit,
    };

    const response = await api.get("/mechanics/search", { params });

    return {
      success: response.data.success,
      data: response.data.data,
      totalPages: response.data.totalPages,
      currentPage: response.data.currentPage,
      totalMechanics: response.data.totalMechanics,
    };
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch mechanics"
    );
  }
};

export const fetchMechanicById = async (id) => {
  try {
    const response = await api.get(`/mechanics/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Sanayici detayı getirilemedi"
    );
  }
};

export const postReview = async (mechanicId, reviewData) => {
  try {
    const response = await api.post("/customers/reviews", {
      mechanic: mechanicId,
      ...reviewData, // rating ve comment
    });
    return response.data.data; // Backend'den dönen savedReview
  } catch (error) {
    throw new Error(error.response?.data?.message || "Yorum gönderilemedi");
  }
};

export const fetchCustomerReviews = async (retryCount = 0) => {
  try {
    const response = await api.get("/customers/reviews");
    return response.data.data; // Yorumlar dizisini döndür
  } catch (error) {
    // 401 hatası için özel handling
    if (error.response?.status === 401) {
      console.error("Unauthorized access to customer reviews");
      throw new Error("Unauthorized - Please login again");
    }

    // Network hatası için 1 kez daha deneme
    if (retryCount < 1 && (!error.response || error.response.status >= 500)) {
      console.log("Retrying fetchCustomerReviews...", retryCount + 1);
      await new Promise((resolve) => setTimeout(resolve, 1000)); // 1 saniye bekle
      return fetchCustomerReviews(retryCount + 1);
    }

    throw new Error(error.response?.data?.message || "Failed to fetch reviews");
  }
};

export const fetchMechanicReviews = async (retryCount = 0) => {
  try {
    const response = await api.get("/mechanics/reviews");
    return response.data.data; // Yorumlar dizisini döndür
  } catch (error) {
    // 401 hatası için özel handling
    if (error.response?.status === 401) {
      console.error("Unauthorized access to mechanic reviews");
      throw new Error("Unauthorized - Please login again");
    }

    // Network hatası için 1 kez daha deneme
    if (retryCount < 1 && (!error.response || error.response.status >= 500)) {
      console.log("Retrying fetchMechanicReviews...", retryCount + 1);
      await new Promise((resolve) => setTimeout(resolve, 1000)); // 1 saniye bekle
      return fetchMechanicReviews(retryCount + 1);
    }

    throw new Error(error.response?.data?.message || "Failed to fetch reviews");
  }
};

export const likeReview = async (reviewId) => {
  try {
    const response = await api.post(
      `/customers/reviews/${reviewId}/like`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data; // { success, message, likeCount, hasLiked }
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Yorum beğenme işlemi başarısız"
    );
  }
};
