import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";
import COLORS from "../constants/colors";

const SkeletonLoader = ({
  width = "100%",
  height = 20,
  borderRadius = 4,
  style,
  animated = true,
}) => {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    if (animated) {
      const startAnimation = () => {
        Animated.sequence([
          Animated.timing(opacity, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0.3,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]).start(() => startAnimation());
      };
      startAnimation();
    }
  }, [animated, opacity]);

  return (
    <Animated.View
      style={[
        styles.skeleton,
        {
          width,
          height,
          borderRadius,
          opacity: animated ? opacity : 0.3,
        },
        style,
      ]}
    />
  );
};

export const ReviewCardSkeleton = () => (
  <View style={styles.reviewCardSkeleton}>
    <View style={styles.reviewHeaderSkeleton}>
      <SkeletonLoader width={40} height={40} borderRadius={20} />
      <View style={styles.reviewAuthorSkeleton}>
        <SkeletonLoader width={120} height={16} style={{ marginBottom: 8 }} />
        <SkeletonLoader width={80} height={14} />
      </View>
    </View>
    <SkeletonLoader width="100%" height={16} style={{ marginBottom: 8 }} />
    <SkeletonLoader width="80%" height={16} style={{ marginBottom: 8 }} />
    <SkeletonLoader width="60%" height={16} style={{ marginBottom: 16 }} />
    <View style={styles.reviewFooterSkeleton}>
      <SkeletonLoader width={100} height={12} />
      <SkeletonLoader width={40} height={12} />
    </View>
  </View>
);

export const MechanicDetailSkeleton = () => (
  <View style={styles.mechanicDetailSkeleton}>
    {/* Header Skeleton */}
    <View style={styles.headerSkeleton}>
      <SkeletonLoader
        width={80}
        height={80}
        borderRadius={40}
        style={{ marginBottom: 16 }}
      />
      <SkeletonLoader width={200} height={24} style={{ marginBottom: 8 }} />
      <SkeletonLoader width={150} height={16} />
    </View>

    {/* Section Skeletons */}
    <View style={styles.sectionSkeleton}>
      <SkeletonLoader width={120} height={20} style={{ marginBottom: 16 }} />
      <SkeletonLoader width="100%" height={16} style={{ marginBottom: 8 }} />
      <SkeletonLoader width="100%" height={16} style={{ marginBottom: 8 }} />
      <SkeletonLoader width="80%" height={16} />
    </View>

    <View style={styles.sectionSkeleton}>
      <SkeletonLoader width={100} height={20} style={{ marginBottom: 16 }} />
      <SkeletonLoader width="100%" height={16} style={{ marginBottom: 8 }} />
      <SkeletonLoader width="90%" height={16} />
    </View>
  </View>
);

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: COLORS.border,
  },
  reviewCardSkeleton: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  reviewHeaderSkeleton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  reviewAuthorSkeleton: {
    marginLeft: 12,
    flex: 1,
  },
  reviewFooterSkeleton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  mechanicDetailSkeleton: {
    padding: 16,
  },
  headerSkeleton: {
    alignItems: "center",
    marginBottom: 32,
  },
  sectionSkeleton: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
});

export default SkeletonLoader;
