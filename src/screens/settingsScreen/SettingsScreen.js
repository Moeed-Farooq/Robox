import { StyleSheet, View } from 'react-native';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { COLORS, FONT, hp, wp } from '../../enums/StyleGuide';
import Label from '../../common';

const SettingsScreen = () => {
  return (
    <View style={styles.mainContainer}>
      <LinearGradient
        colors={[COLORS.surfaceElevated, COLORS.surfaceAlt]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.panel}>
        <Label style={styles.title}>Settings</Label>
        <Label style={styles.subtitle}>Personalize your experience with the refreshed premium theme.</Label>
      </LinearGradient>
    </View>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: COLORS.splashBg,
    justifyContent: 'center',
    padding: wp(6),
  },
  panel: {
    borderColor: COLORS.borderSoft,
    borderWidth: 1,
    borderRadius: wp(4.8),
    padding: wp(5),
  },
  title: {
    color: COLORS.white,
    fontSize: hp(2.6),
    fontFamily: FONT.semiBold,
    marginBottom: hp(1),
  },
  subtitle: {
    color: COLORS.mutedText,
    fontSize: hp(1.7),
    fontFamily: FONT.regular,
    lineHeight: hp(2.6),
  },
});
