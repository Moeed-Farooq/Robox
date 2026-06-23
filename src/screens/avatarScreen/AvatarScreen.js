import {
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useState } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { COLORS, FONT, HEX_OPACITY, hp, wp } from '../../enums/StyleGuide';
import Label from '../../common';
import { en } from '../../languages';
import SvgIcon from '../../common/SvgIcon';
import { SVG } from '../../assets';
import { AvatarStyleCard } from '../../components';
import { AVATAR_STYLES } from '../../dummies';

const AvatarScreen = () => {
  const [prompt, setPrompt] = useState('');
  const [selectedId, setSelectedId] = useState(1);

  const renderItem = ({ item }) => {
    return (
      <AvatarStyleCard
        item={item}
        isSelected={selectedId === item.id}
        onPress={() => setSelectedId(item.id)}
      />
    );
  };

  return (
    <View style={styles.mainContainer}>
      <View
        style={styles.heroPanel}>
        <View style={styles.header}>
          <View style={styles.textColumn}>
            <Label style={styles.eyebrow}>AI creator</Label>
            <Label style={styles.titleText}>{en.avatarGeneration}</Label>
            <Label style={styles.subTitleText}>{en.createAvatar}</Label>
          </View>
          <View style={styles.iconContainer}>
            <SvgIcon icon={SVG.brain} width={hp(4)} height={hp(4)} />
          </View>
        </View>
      </View>

      <Label style={styles.describeText}>{en.describeAvatar}</Label>

      <View style={styles.inputWrapper}>
        <View style={styles.iconRow}>
          <SvgIcon icon={SVG.message} width={hp(3)} height={hp(3)} />
          <Label style={styles.aiPrompText}>{en.aiPrompt}</Label>
          <View style={styles.counterPill}>
            <Label style={styles.counter}>{prompt.length}/200</Label>
          </View>
        </View>
        <TextInput
          value={prompt}
          onChangeText={setPrompt}
          placeholder={en.avatarPrompt}
          placeholderTextColor={COLORS.grey}
          maxLength={200}
          multiline
          style={styles.input}
        />
      </View>

      <View style={styles.avatarStyleRow}>
        <View>
          <Label style={styles.avatarStyleText}>{en.avatarStyle}</Label>
          <Label style={styles.sectionHint}>Choose a signature look</Label>
        </View>
        <View style={styles.availableContainer}>
          <Label style={styles.available}>6/6 Available</Label>
        </View>
      </View>

      <FlatList
        data={AVATAR_STYLES}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.carousel}
      />

      <TouchableOpacity activeOpacity={0.9} style={styles.btn}>
        <LinearGradient
          colors={[COLORS.gradientStart, COLORS.gradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        <SvgIcon icon={SVG.starsWhite} width={hp(2)} height={hp(2)} />
        <Label style={styles.btnText}>{en.generateAvatar}</Label>
      </TouchableOpacity>
    </View>
  );
};

export default AvatarScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: COLORS.splashBg,
    paddingHorizontal: wp(5),
    paddingTop: hp(2),
    paddingBottom: hp(18),
  },
  heroPanel: {
    borderRadius: hp(2),
    padding: wp(5),
    marginBottom: hp(2),
    backgroundColor: COLORS.white + HEX_OPACITY[22],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textColumn: {
    flex: 1,
    marginRight: wp(3),
  },
  avatarStyleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: hp(3),
    marginBottom: hp(1),
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: hp(1.3),
  },
  btnText: {
    fontFamily: FONT.semiBold,
    fontSize: hp(1.8),
    color: COLORS.white,
    marginLeft: wp(2),
  },
  btn: {
    marginTop: hp(3),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: hp(1.5),
    borderRadius: hp(2.2),
    overflow: 'hidden',
  },
  availableContainer: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.4),
    borderRadius: wp(3),
    alignSelf: 'flex-start',
  },
  iconContainer: {
    width: wp(14),
    height: wp(14),
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: wp(7),
    justifyContent: 'center',
    alignItems: 'center',
  },
  eyebrow: {
    color: COLORS.lightYellow,
    fontSize: hp(1.4),
    fontFamily: FONT.medium,
    textTransform: 'uppercase',
    letterSpacing: wp(0.8),
    marginBottom: hp(0.3),
  },
  titleText: {
    color: COLORS.white,
    fontSize: hp(2.7),
    fontFamily: FONT.semiBold,
    letterSpacing: wp(0.2),
  },
  available: {
    color: COLORS.newlightWhite,
    fontSize: hp(1.25),
    fontFamily: FONT.regular,
  },
  subTitleText: {
    color: COLORS.mutedText,
    fontSize: hp(1.5),
    fontFamily: FONT.regular,
    marginTop: hp(0.4),
  },
  aiPrompText: {
    color: COLORS.white,
    fontSize: hp(1.5),
    fontFamily: FONT.regular,
    marginLeft: wp(2),
  },
  describeText: {
    color: COLORS.white,
    fontSize: hp(2),
    fontFamily: FONT.semiBold,
    marginTop: hp(1),
    marginBottom: hp(1.2),
  },
  avatarStyleText: {
    color: COLORS.white,
    fontSize: hp(2),
    fontFamily: FONT.semiBold,
  },
  sectionHint: {
    color: COLORS.white,
    fontSize: hp(1.25),
    fontFamily: FONT.regular,
    marginTop: hp(0.2),
  },
  inputWrapper: {
    backgroundColor: COLORS.surfaceAlt +HEX_OPACITY[22],
    borderRadius: wp(4),
    paddingHorizontal: wp(3.5),
    paddingTop: hp(1.8),
    paddingBottom: hp(2.2),
    minHeight: hp(19),
    justifyContent: 'flex-start',
  },
  input: {
    color: COLORS.white,
    fontSize: hp(1.8),
    fontFamily: FONT.regular,
    paddingTop: hp(0.4),
    paddingRight: wp(4),
    minHeight: hp(9),
  },
  counterPill: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: hp(1.5),
    paddingHorizontal: wp(2.5),
    paddingVertical: hp(0.3),
  },
  counter: {
    color: COLORS.mutedText,
    fontSize: hp(1.35),
    fontFamily: FONT.regular,
  },
  carousel: {
    marginTop: hp(1),
    paddingVertical: hp(0.6),
    paddingRight: wp(2),
    paddingLeft: wp(1),
  },
});
