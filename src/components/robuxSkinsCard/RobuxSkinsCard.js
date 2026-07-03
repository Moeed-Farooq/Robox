import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Modal,
  Text,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONT, hp, wp } from '../../enums/StyleGuide';
import SvgIcon from '../../common/SvgIcon';
import { SVG } from '../../assets';
import { handleImageDownload } from '../../helpers';
import Label from '../../common';
import { en } from '../../languages';

const RobuxSkinsCard = ({ item }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState('success');
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);

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

        <View style={styles.crownBadge}>
          <SvgIcon icon={SVG.premium} height={hp(3)} width={hp(3)} />
        </View>

        <TouchableOpacity
          style={styles.favoriteBadge}
          activeOpacity={0.7}
          onPress={() => setIsFavorite(prev => !prev)}
        >
          <SvgIcon
            icon={isFavorite ? SVG.heartFilled : SVG.heartOutline}
            height={hp(2.5)}
            width={hp(2.5)}
          />
        </TouchableOpacity>
      </View>

      {/* Label Title Meta */}
      <Label style={styles.cardTitle} numberOfLines={1}>
        {item.title}
      </Label>

      <TouchableOpacity
        style={styles.downloadButton}
        activeOpacity={0.85}
        onPress={triggerDownload}
      >
        <SvgIcon icon={SVG.download} height={hp(1.8)} width={hp(1.8)} />
        <Label style={styles.downloadButtonText}>{en.save}</Label>
      </TouchableOpacity>

      {/* Alert View Modal */}
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
            backgroundColor="rgba(0, 0, 0, 0.8)"
            barStyle="light-content"
            translucent
          />

          <SafeAreaView style={styles.modalSafeArea}>
            <View style={styles.modalContainer}>
              <View
                style={[
                  styles.modalIconContainer,
                  {
                    backgroundColor: isSuccess
                      ? COLORS.darkGreen
                      : COLORS.darkRed,
                  },
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
                  { backgroundColor: isSuccess ? COLORS.darkGreen : COLORS.red },
                ]}
                activeOpacity={0.8}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>{en.ok}</Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </View>
      </Modal>
    </View>
  );
};

export default RobuxSkinsCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surfaceElevated,
    width: wp(44),
    borderRadius: wp(5),
    alignItems: 'flex-start',
    marginBottom: hp(2),
    paddingVertical: hp(2),
    paddingHorizontal: wp(1),
  },
  imageContainer: {
    width: '100%',
    height: hp(22),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: wp(5),
    position: 'relative',
    overflow: 'hidden',
  },
  cardImage: {
    width: '55%',
    height: '55%',
  },
  crownBadge: {
    position: 'absolute',
    top: hp(0.8),
    left: wp(3),
  },
  favoriteBadge: {
    position: 'absolute',
    top: hp(-0.1),
    right: wp(3),
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: wp(1.8),
    borderRadius: wp(10),
  },
  cardTitle: {
    color: COLORS.white,
    fontSize: hp(1.5),
    fontFamily: FONT.medium,
    textAlign: 'center',
    marginTop: hp(-1.2),
    alignSelf: 'center',
  },
  downloadButton: {
    backgroundColor: COLORS.pink,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '80%',
    paddingVertical: hp(0.5),
    borderRadius: wp(4),
    marginTop: hp(1.2),
    alignSelf: 'center',
  },
  downloadButtonText: {
    color: COLORS.white,
    fontSize: hp(1.5),
    fontFamily: FONT.bold,
    marginLeft: wp(2),
  },
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
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
  },
  modalMessageText: {
    color: COLORS.lightestGrey,
    fontSize: hp(1.6),
    fontFamily: FONT.regular,
    textAlign: 'center',
    marginBottom: hp(2.5),
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
