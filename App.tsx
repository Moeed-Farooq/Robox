import { AppState, StatusBar } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { COLORS } from './src/enums/StyleGuide';
import RootNavigator from './src/navigation/RootNavigator';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {
  anonymousLogin,
  ensureFirestoreUserDocument,
  getCurrentUser,
  initAppsFlyer,
} from './src/services';
import { initializeAds, showAppOpenIfAvailable } from './src/services/ads';
import { initPerkoxSdk } from './src/services/perkox/perkoxSdk';
import EngagementPromptsHost from './src/components/engagementPromptsHost';


const App = () => {
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState('');
  const appStateRef = useRef(AppState.currentState);

  useEffect(() => {
    initializeAds();
    initAppsFlyer();
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (appStateRef.current === 'background' && nextAppState === 'active') {
        showAppOpenIfAvailable();
      }

      appStateRef.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    const initializeAnonymousAuth = async () => {
      try {
        const existingUser = getCurrentUser();

        if (existingUser) {
          await ensureFirestoreUserDocument(existingUser);
        } else {
          await anonymousLogin();
        }

        try {
          await initPerkoxSdk();
        } catch (perkoxError) {
          if (__DEV__) {
            console.warn(
              'Perkox SDK initialization failed:',
              perkoxError instanceof Error
                ? perkoxError.message
                : perkoxError,
            );
          }
        }
      } catch (error) {
        if (isMounted) {
          setAuthError(
            error instanceof Error
              ? error.message
              : 'Anonymous authentication failed.',
          );
        }
      } finally {
        if (isMounted) {
          setAuthLoading(false);
        }
      }
    };

    initializeAnonymousAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (__DEV__ && authError) {
      console.warn('Anonymous auth initialization failed:', authError);
    }
  }, [authError]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }} pointerEvents={authLoading ? 'none' : 'auto'}>
      <StatusBar backgroundColor={COLORS.splashBg} barStyle={'light-content'} />
        <RootNavigator />
        <EngagementPromptsHost />
    </GestureHandlerRootView>
  );
};

export default App;
