import React, { useEffect } from 'react';
import { View, StyleSheet,Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolate,
  Easing,
} from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';

export function AnimatedSwipeRightHint() {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withRepeat(
      withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    const translateX = interpolate(progress.value, [0, 1], [0, 20]);
    const opacity = interpolate(progress.value, [0, 0.5, 1], [0.2, 1, 0.2]);

    return {
      transform: [{ translateX }],
      opacity,
    };
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.iconWrapper, animatedStyle]}>
        <Feather name="arrow-right" size={32} color="#333" />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 20,
    top: '50%',
    transform: [{ translateY: -16 }],
  },
  iconWrapper: {
    padding: 6,
  },
});
