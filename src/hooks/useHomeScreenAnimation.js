import { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';

const useHomeScreenAnimation = () => {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: 1,
      duration: 700,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [progress]);

  const screenAnim = {
    opacity: progress,
    transform: [
      {
        translateX: progress.interpolate({
          inputRange: [0, 1],
          outputRange: [-60, 0],
        }),
      },
    ],
  };

  return { screenAnim };
};

export default useHomeScreenAnimation;
