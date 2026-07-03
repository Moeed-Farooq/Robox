import React from 'react';
import { StyleSheet, View, StatusBar } from 'react-native';
import { COLORS, FONT, hp, wp } from '../../enums/StyleGuide';
import Label from '../../common'; 
import { en } from '../../languages';
import { useNavigation } from '@react-navigation/native';
import Button from '../../common/Button';

const ArsenalGame = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.mainContainer}>
      <StatusBar backgroundColor={COLORS.darkgrey} barStyle={'light-content'} />
      <Label style={styles.arsenalTitle}>{en.arsenal}</Label>
      <Button
        text={en.close}
        textStyle={styles.closeBtnText}
        style={styles.closeButton}
        onPress={()=>navigation.goBack()}
      />
    </View>
  );
};

export default ArsenalGame;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.darkgrey,
  },
  closeButton: {
    backgroundColor: COLORS.Purple,
    paddingHorizontal: wp(8),
    paddingVertical: hp(0.8),
    borderRadius: wp(6.5),
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp(2),
  },
  arsenalTitle: {
    color: COLORS.white,
    fontSize: hp(2.8),
    fontFamily: FONT.semiBold,
    textShadowColor: 'rgba(0, 0, 0, 0.15)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  closeBtnText: {
    color: COLORS.white,
    fontSize: hp(1.9),
    fontFamily: FONT.regular,
  },
});
