import React, { useState } from 'react';
import {
  Image,
  Modal,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SVG } from '../../assets';
import Label from '../../common';
import SvgIcon from '../../common/SvgIcon';
import { COLORS, FONT, hp, wp } from '../../enums/StyleGuide';
import { handleImageDownload } from '../../helpers';
import { en } from '../../languages';

const FreeEmotesCards = ({ item }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState('success');
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');

  const triggerDownload = () => {
    handleImageDownload(
      item.image,
      (title, msg) => {
        setModalType('success');
        setModalTitle(title);
        setModalMessage(msg);
        setModalVisible(true);
      },
      (title, msg) => {
        setModalType('error');
        setModalTitle(title);
        setModalMessage(msg);
        setModalVisible(true);
      },
    );
  };

  const isSuccess = modalType === 'success';

  return (
    <View style={styles.card}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: item.image }}
          style={styles.cardImage}
          resizeMode="contain"
         
        />
      </View>
      <Label style={styles.cardTitle} numberOfLines={2}>
        {item.title}
      </Label>

      <View style={styles.priceContainer}>
        <Label style={styles.priceText}>{item.price}</Label>
        <View style={styles.dot} />
      </View>
      <TouchableOpacity
        style={styles.downloadButton}
        activeOpacity={0.8}
        onPress={triggerDownload}
      >
        <SvgIcon icon={SVG.download} height={hp(2)} width={hp(2)} />
        <Label style={styles.downloadButtonText}>{en.save}</Label>
      </TouchableOpacity>

      <Modal
        transparent
        visible={modalVisible}
        animationType="fade"
        presentationStyle="overFullScreen"
        statusBarTranslucent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <StatusBar
            backgroundColor="rgba(0, 0, 0, 0.75)"
            barStyle="light-content"
            translucent
          />

          <SafeAreaView style={styles.modalSafeArea}>
            <View style={styles.modalContainer}>
              <View
                style={[
                  styles.modalIconContainer,
                  { backgroundColor: isSuccess ? COLORS.darkGreen : COLORS.darkRed },
                ]}
              >
                <SvgIcon
                  icon={isSuccess ? SVG.tick : SVG.cross}
                  height={hp(3.5)}
                  width={hp(3.5)}
                />
              </View>

              <Label style={styles.modalTitleText}>{modalTitle}</Label>
              <Label style={styles.modalMessageText}>{modalMessage}</Label>

              <TouchableOpacity
                style={[
                  styles.modalActionButton,
                  { backgroundColor: isSuccess ? COLORS.blue : COLORS.darkRed },
                ]}
                activeOpacity={0.8}
                onPress={() => setModalVisible(false)}
              >
                <Label style={styles.modalButtonText}>{en.ok}</Label>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </View>
      </Modal>
    </View>
  );
};

export default FreeEmotesCards;

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surfaceElevated,
    width: wp(42),
    borderRadius: wp(5),
    padding: wp(3),
    alignItems: 'center',
    borderWidth: 1,
  },
  imageContainer: {
    width: wp(25),
    height: hp(10),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp(1.5),
    borderRadius: wp(3),
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  cardTitle: {
    color: COLORS.white,
    fontSize: hp(1.5),
    fontFamily: FONT.medium,
    textAlign: 'center',
    minHeight: hp(4),
    marginTop: hp(1.5),
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: hp(0.8),
  },
  priceText: {
    color: COLORS.newlightWhite,
    fontSize: hp(1.4),
    fontFamily: FONT.regular,
    marginRight: wp(1),
  },
  dot: {
    width: wp(1.5),
    height: wp(1.5),
    borderRadius: wp(1),
    backgroundColor: COLORS.newlightWhite,
  },
  downloadButton: {
    backgroundColor: COLORS.pink,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingVertical: hp(1.4),
    borderRadius: wp(4),
    marginTop: hp(0.5),
  },
  downloadButtonText: {
    color: COLORS.white,
    fontSize: hp(1.6),
    fontFamily: FONT.semiBold,
    marginLeft: wp(1.5),
  },

  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
  },
  modalSafeArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: COLORS.surfaceElevated,
    width: wp(78),
    borderRadius: wp(5),
    padding: wp(5),
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2D2D2D',
  },
  modalIconContainer: {
    width: wp(14),
    height: wp(14),
    borderRadius: wp(7),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp(2),
  },
  modalTitleText: {
    color: COLORS.white,
    fontSize: hp(2.1),
    fontFamily: FONT.bold,
    marginBottom: hp(1),
    textAlign: 'center',
  },
  modalMessageText: {
    color: COLORS.newlightWhite,
    fontSize: hp(1.6),
    fontFamily: FONT.regular,
    textAlign: 'center',
    marginBottom: hp(2.5),
    paddingHorizontal: wp(1),
  },
  modalActionButton: {
    width: '100%',
    paddingVertical: hp(1.4),
    borderRadius: wp(3.5),
    alignItems: 'center',
  },
  modalButtonText: {
    color: COLORS.white,
    fontSize: hp(1.7),
    fontFamily: FONT.semiBold,
  },
});
