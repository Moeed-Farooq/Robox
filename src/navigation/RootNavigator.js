import React, { useRef } from 'react';
import { NavigationContainer, createNavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'react-native';
import * as ui from '../screens';
import { COLORS } from '../enums/StyleGuide';
import { INTERSTITIAL_ADS_SCREENS, SCREEN, TAB } from '../enums';
import BottomNavigator from './BottomNavigator';
import { preloadInterstitialAd, showInterstitialIfAvailable } from '../services/ads';

const Stack = createNativeStackNavigator();
const navigationRef = createNavigationContainerRef();
const NAVIGATION_INTERSTITIAL_SCREENS = new Set(INTERSTITIAL_ADS_SCREENS);

const getActiveRouteName = state => {
  if (!state || typeof state.index !== 'number') {
    return null;
  }

  const route = state.routes?.[state.index];

  if (!route) {
    return null;
  }

  if (route.state) {
    return getActiveRouteName(route.state) || route.name;
  }

  return route.name;
};

const getRootStackSize = state => state?.routes?.length ?? 0;

const shouldShowNavigationInterstitial = (previousRouteName, currentRouteName) => {
  if (!previousRouteName || previousRouteName === currentRouteName) {
    return false;
  }

  return (
    NAVIGATION_INTERSTITIAL_SCREENS.has(previousRouteName) ||
    NAVIGATION_INTERSTITIAL_SCREENS.has(currentRouteName)
  );
};

const RootNavigator = () => {
  const previousRouteNameRef = useRef(null);
  const previousStackSizeRef = useRef(null);
  const hasSkippedInitialNavigationAdRef = useRef(false);

  const handleNavigationStateChange = () => {
    if (!navigationRef.isReady()) {
      return;
    }

    const rootState = navigationRef.getRootState();
    const currentRouteName = getActiveRouteName(rootState);
    const currentStackSize = getRootStackSize(rootState);

    if (!currentRouteName) {
      return;
    }

    const previousRouteName = previousRouteNameRef.current;
    const previousStackSize = previousStackSizeRef.current;
    const isBackNavigation =
      previousStackSize !== null && currentStackSize < previousStackSize;

    if (
      !isBackNavigation &&
      shouldShowNavigationInterstitial(previousRouteName, currentRouteName)
    ) {
      if (!hasSkippedInitialNavigationAdRef.current) {
        hasSkippedInitialNavigationAdRef.current = true;
        previousRouteNameRef.current = currentRouteName;
        previousStackSizeRef.current = currentStackSize;
        return;
      }

      const shown = showInterstitialIfAvailable();

      if (!shown) {
        preloadInterstitialAd();
      }
    }

    previousRouteNameRef.current = currentRouteName;
    previousStackSizeRef.current = currentStackSize;
  };

  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={handleNavigationStateChange}
      onStateChange={handleNavigationStateChange}
    >
      <StatusBar backgroundColor={COLORS.splashBg} barStyle="light-content" />

      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name={SCREEN.SPLASH_SCREEN} component={ui.SplashScreen} />
        <Stack.Screen name={TAB.BOTTOM} component={BottomNavigator} />
        <Stack.Screen name={SCREEN.FREE_DAILY_ROBUX_SCREEN} component={ui.FreeDailyRobuxScreen} />
        <Stack.Screen name={SCREEN.DAILY_ROBUX_QUIZ} component={ui.DailyRobuxQuiz} />
        <Stack.Screen name={SCREEN.ROBUX_CODES_SCREEN} component={ui.RobuxCodesScreen} />
        <Stack.Screen name={SCREEN.TERMS_AND_CONDITIONS_SCREEN} component={ui.TermsAndConditionsScreen} />
        <Stack.Screen name={SCREEN.PRIVACY_SCREEN} component={ui.PrivacyScreen} />
        <Stack.Screen name={SCREEN.WORD_QUIZ_SCREEN} component={ui.WordQuizScreen} />
        <Stack.Screen name={SCREEN.RBX_CALCULATOR_SCREEN} component={ui.RbxCalculatorScreen} />
        <Stack.Screen name={SCREEN.BLOCK_PUZZLE_SCREEN} component={ui.BlockPuzzleScreen} />
        <Stack.Screen name={SCREEN.SPIN_WHEEL_SCREEN} component={ui.SpinWheelScreen} />
        <Stack.Screen name={SCREEN.BLOX_FRUITS_GAME} component={ui.BloxFruitsGame} />
        <Stack.Screen name={SCREEN.JAIL_BREAK_GAME} component={ui.JailBreakGame} />
        <Stack.Screen name={SCREEN.FREE_EMOTES_SCREEN} component={ui.FreeEmotesScreen} />
        <Stack.Screen name={SCREEN.ROBUX_SKINS_SCREEN} component={ui.RobuxSkinsScreen} />
        <Stack.Screen name={SCREEN.ADOPT_ME_GAME} component={ui.AdoptMeGame} />
        <Stack.Screen name={SCREEN.TOWER_HELL_GAME} component={ui.TowerHellGame} />
        <Stack.Screen name={SCREEN.MURDER_MYSTERY_GAME} component={ui.MurderMysteryGame} />
        <Stack.Screen name={SCREEN.ARSENAL_GAME} component={ui.ArsenalGame} />
        <Stack.Screen name={SCREEN.PHANTOM_FORCES_GAME} component={ui.PhantomForcesGame} />
        <Stack.Screen name={SCREEN.ROYALE_HIGH_GAME} component={ui.RoyaleHighGame} />
        <Stack.Screen name={SCREEN.FLEE_THE_FACILITY_GAME} component={ui.FleeTheFacilityGame} />
        <Stack.Screen name={SCREEN.PERKOX_OFFERWALL_SCREEN} component={ui.PerkoxOfferwallScreen} />
        <Stack.Screen name={SCREEN.PERKOX_WEBVIEW_SCREEN} component={ui.PerkoxWebViewScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;