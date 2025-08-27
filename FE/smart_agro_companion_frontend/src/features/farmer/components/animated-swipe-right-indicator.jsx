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
      <Text style={{ 
        color: '#333', 
        fontSize: 16, 
        marginBottom: 8, 
        textAlign: 'center' ,
        fontFamily: 'Roboto-Medium',
        fontWeight: 'bold',
      }}>
        Swipe right to open drawer
      </Text>
      <Animated.View style={[styles.iconWrapper, animatedStyle]}>
        <Feather name="arrow-right" size={32} color="blue" />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    backgroundColor:'wheat',
    padding: 16,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  iconWrapper: {
    padding: 6,
  },
});
