import { StatusBar } from 'react-native';
import React, { useEffect, useState } from 'react';
import { COLORS } from './src/enums/StyleGuide';
import RootNavigator from './src/navigation/RootNavigator';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { anonymousLogin, ensureFirestoreUserDocument, getCurrentUser } from './src/services';
import { initializeAds } from './src/services/ads';


const App = () => {
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    initializeAds();
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
    </GestureHandlerRootView>
  );
};

export default App;
