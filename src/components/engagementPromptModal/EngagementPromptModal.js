import React from 'react';
import { Modal, StyleSheet, TouchableOpacity, View } from 'react-native';
import Label from '../../common';
import { COLORS, FONT, HEX_OPACITY, hp, wp } from '../../enums/StyleGuide';

const PROMPT_COPY = {
  rate: {
    title: 'Enjoying the app?',
    message:
      'Please rate us on the App Store. Your support helps us keep improving.',
    primaryLabel: 'Rate App',
    secondaryLabel: 'Maybe Later',
  },
  share: {
    title: 'Invite friends',
    message:
      'Invite 2 friends and help us grow. Share the app link with your friends and keep earning.',
    primaryLabel: 'Share App',
    secondaryLabel: 'Later',
  },
};

const EngagementPromptModal = ({
  visible,
  type,
  onPrimaryPress,
  onSecondaryPress,
}) => {
  const copy = PROMPT_COPY[type] || PROMPT_COPY.rate;

  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Label style={styles.title}>{copy.title}</Label>
          <Label style={styles.message}>{copy.message}</Label>

          <TouchableOpacity
            style={styles.primaryButton}
            activeOpacity={0.85}
            onPress={onPrimaryPress}
          >
            <Label style={styles.primaryText}>{copy.primaryLabel}</Label>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            activeOpacity={0.85}
            onPress={onSecondaryPress}
          >
            <Label style={styles.secondaryText}>{copy.secondaryLabel}</Label>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default EngagementPromptModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: COLORS.black + HEX_OPACITY[70],
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: wp(6),
  },
  card: {
    width: '100%',
    borderRadius: hp(2),
    backgroundColor: COLORS.surfaceElevated,
    borderWidth: 1,
    borderColor: COLORS.lightYellow + HEX_OPACITY[30],
    paddingHorizontal: wp(5),
    paddingVertical: hp(3),
  },
  title: {
    color: COLORS.lightYellow,
    fontSize: hp(2.4),
    fontFamily: FONT.bold,
    textAlign: 'center',
  },
  message: {
    color: COLORS.newwhite,
    fontSize: hp(1.7),
    fontFamily: FONT.regular,
    textAlign: 'center',
    marginTop: hp(1.5),
    lineHeight: hp(2.4),
  },
  primaryButton: {
    marginTop: hp(3),
    backgroundColor: COLORS.accent,
    borderRadius: hp(1.4),
    paddingVertical: hp(1.5),
    alignItems: 'center',
  },
  primaryText: {
    color: COLORS.black,
    fontSize: hp(1.8),
    fontFamily: FONT.semiBold,
  },
  secondaryButton: {
    marginTop: hp(1.2),
    borderRadius: hp(1.4),
    paddingVertical: hp(1.4),
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.whiteBorderLight,
  },
  secondaryText: {
    color: COLORS.lightestWhite,
    fontSize: hp(1.7),
    fontFamily: FONT.medium,
  },
});
