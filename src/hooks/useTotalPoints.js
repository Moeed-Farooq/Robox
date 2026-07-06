import { useCallback, useEffect, useRef, useState } from 'react';
import auth from '@react-native-firebase/auth';
import {
  addPointsToUserTotal,
  getCurrentUser,
  refreshUserTotalPoints,
  subscribeToUserTotalPoints,
} from '../services';

const useTotalPoints = () => {
  const [totalPoints, setTotalPoints] = useState(0);
  const [loading, setLoading] = useState(true);
  const isMountedRef = useRef(true);

  const refreshTotalPoints = useCallback(async () => {
    try {
      const user = getCurrentUser();

      if (!user) {
        if (isMountedRef.current) {
          setTotalPoints(0);
        }
        return 0;
      }

      const points = await refreshUserTotalPoints();

      if (isMountedRef.current) {
        setTotalPoints(points);
      }

      return points;
    } catch (error) {
      console.warn('Failed to refresh total points:', error?.message || error);
      throw error;
    }
  }, []);

  const addPoints = useCallback(async points => {
    try {
      const updatedPoints = await addPointsToUserTotal(points);

      if (isMountedRef.current) {
        setTotalPoints(updatedPoints);
      }

      return updatedPoints;
    } catch (error) {
      console.warn('Failed to add points:', error?.message || error);
      throw error;
    }
  }, []);

  useEffect(() => {
    isMountedRef.current = true;

    let unsubscribePoints = () => {};

    const unsubscribeAuth = auth().onAuthStateChanged(user => {
      unsubscribePoints();

      if (!user) {
        if (isMountedRef.current) {
          setTotalPoints(0);
          setLoading(false);
        }
        return;
      }

      if (isMountedRef.current) {
        setLoading(true);
      }

      unsubscribePoints = subscribeToUserTotalPoints(
        points => {
          if (isMountedRef.current) {
            setTotalPoints(points);
            setLoading(false);
          }
        },
        error => {
          console.warn('Failed to subscribe to total points:', error?.message || error);
          if (isMountedRef.current) {
            setLoading(false);
          }
        },
      );

      refreshTotalPoints().finally(() => {
        if (isMountedRef.current) {
          setLoading(false);
        }
      });
    });

    return () => {
      isMountedRef.current = false;
      unsubscribePoints();
      unsubscribeAuth();
    };
  }, [refreshTotalPoints]);

  return {
    totalPoints,
    loading,
    addPoints,
    refreshTotalPoints,
  };
};

export default useTotalPoints;
