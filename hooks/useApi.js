import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert } from "react-native";

const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { t } = useTranslation();

  const callApi = useCallback(
    async (apiFunction, options = {}) => {
      const {
        showLoading = true,
        showErrorAlert = true,
        errorTitle = t("error"),
        onSuccess,
        onError,
      } = options;

      if (showLoading) setLoading(true);
      setError(null);

      try {
        const result = await apiFunction();

        if (onSuccess) {
          onSuccess(result);
        }

        return result;
      } catch (err) {
        console.error("API Error:", err);
        setError(err);

        if (showErrorAlert) {
          Alert.alert(errorTitle, err.message || t("common.unknownError"));
        }

        if (onError) {
          onError(err);
        }

        throw err;
      } finally {
        if (showLoading) setLoading(false);
      }
    },
    [t]
  );

  return {
    loading,
    error,
    callApi,
    setLoading,
    setError,
  };
};

export default useApi;
