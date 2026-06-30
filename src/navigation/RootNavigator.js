import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'react-native';
import * as ui from '../screens';
import { COLORS } from '../enums/StyleGuide';
import { SCREEN, TAB } from '../enums';
import BottomNavigator from './BottomNavigator';

const Stack = createNativeStackNavigator();

const RootNavigator = () => {
  return (
    <NavigationContainer>
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
        
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;