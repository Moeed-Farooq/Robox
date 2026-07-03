import { StatusBar, View } from 'react-native';
import React from 'react';
import { COLORS } from './src/enums/StyleGuide';
import RootNavigator from './src/navigation/RootNavigator';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar backgroundColor={COLORS.splashBg} barStyle={'light-content'} />
      <RootNavigator />
    </GestureHandlerRootView>
  );
};

export default App;
