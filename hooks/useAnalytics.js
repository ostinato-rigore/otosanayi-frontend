import { useCallback } from "react";

const useAnalytics = () => {
  const trackEvent = useCallback((eventName, parameters = {}) => {
    // In a real app, you would integrate with Firebase Analytics,
    // Amplitude, Mixpanel, or other analytics services

    const eventData = {
      event: eventName,
      timestamp: new Date().toISOString(),
      parameters,
      // Add user ID, session ID, etc.
    };

    // Console log for development
    console.log("📊 Analytics Event:", eventData);

    // Here you would send to your analytics service:
    // Analytics.logEvent(eventName, parameters);
    // Amplitude.logEvent(eventName, parameters);
    // Mixpanel.track(eventName, parameters);
  }, []);

  const trackScreenView = useCallback(
    (screenName, parameters = {}) => {
      trackEvent("screen_view", {
        screen_name: screenName,
        ...parameters,
      });
    },
    [trackEvent]
  );

  const trackUserAction = useCallback(
    (action, target, parameters = {}) => {
      trackEvent("user_action", {
        action,
        target,
        ...parameters,
      });
    },
    [trackEvent]
  );

  const trackError = useCallback(
    (error, context = {}) => {
      trackEvent("error_occurred", {
        error_message: error.message,
        error_stack: error.stack,
        context,
      });
    },
    [trackEvent]
  );

  const trackPerformance = useCallback(
    (metric, value, parameters = {}) => {
      trackEvent("performance_metric", {
        metric,
        value,
        ...parameters,
      });
    },
    [trackEvent]
  );

  return {
    trackEvent,
    trackScreenView,
    trackUserAction,
    trackError,
    trackPerformance,
  };
};

export default useAnalytics;
