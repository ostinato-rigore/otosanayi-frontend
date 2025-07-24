import { useEffect, useState } from "react";

const useNetworkStatus = () => {
  const [isConnected, setIsConnected] = useState(true);
  const [isInternetReachable, setIsInternetReachable] = useState(true);

  useEffect(() => {
    // Since NetInfo might not be available, we'll use a simple approach
    // In a real app, you would install @react-native-async-storage/async-storage
    // and @react-native-community/netinfo for proper network detection

    const checkConnection = async () => {
      try {
        // Simple network check - attempt to fetch from a reliable endpoint
        const response = await fetch("https://www.google.com/favicon.ico", {
          method: "HEAD",
          timeout: 5000,
        });
        setIsConnected(response.ok);
        setIsInternetReachable(response.ok);
      } catch (_error) {
        setIsConnected(false);
        setIsInternetReachable(false);
      }
    };

    // Check immediately
    checkConnection();

    // Check every 30 seconds
    const interval = setInterval(checkConnection, 30000);

    return () => clearInterval(interval);
  }, []);

  return {
    isConnected,
    isInternetReachable,
    isOffline: !isConnected || !isInternetReachable,
  };
};

export default useNetworkStatus;
