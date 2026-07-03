import {
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Modal,
} from 'react-native';
import React, { useState, useCallback, useMemo } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { COLORS, FONT, HEX_OPACITY, hp, wp } from '../../enums/StyleGuide';
import Label from '../../common';
import { en } from '../../languages';
import SvgIcon from '../../common/SvgIcon';
import { SVG } from '../../assets';
import { AvatarStyleCard, GeneratedAvatarCard } from '../../components';
import { AVATAR_STYLES } from '../../dummies';
import { getAvatarStyleName, generateUniqueId } from '../../helpers';

const AvatarScreen = () => {
  const [prompt, setPrompt] = useState('');
  const [selectedId, setSelectedId] = useState(1);
  const [generatedAvatars, setGeneratedAvatars] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const isPromptEmpty = !prompt.trim();

  const handleGenerateAvatar = () => {
    if (isPromptEmpty) {
      setModalVisible(true);
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const styleName = getAvatarStyleName(AVATAR_STYLES, selectedId);

      const newAvatar = {
        id: generateUniqueId(),
        styleName,
        promptText: prompt,
        isFavorite: false,
      };

      setGeneratedAvatars(prev => [newAvatar, ...prev]);
      setPrompt('');
      setIsLoading(false);
    }, 2500);
  };

  const toggleFavorite = useCallback(id => {
    setGeneratedAvatars(prevAvatars =>
      prevAvatars.map(avatar =>
        avatar.id === id
          ? { ...avatar, isFavorite: !avatar.isFavorite }
          : avatar,
      ),
    );
  }, []);

  const renderStyleItem = useCallback(
    ({ item }) => (
      <AvatarStyleCard
        item={item}
        isSelected={selectedId === item.id}
        onPress={() => setSelectedId(item.id)}
      />
    ),
    [selectedId],
  );

  const renderGeneratedAvatar = useCallback(
    ({ item }) => (
      <GeneratedAvatarCard item={item} onToggleFavorite={toggleFavorite} />
    ),
    [toggleFavorite],
  );

  const renderHeader = useMemo(() => {
    return (
      <View>
        <View style={styles.heroPanel}>
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
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <SvgIcon icon={SVG.message} width={hp(3)} height={hp(3)} />
              <Label style={styles.aiPrompText}>{en.aiPrompt}</Label>
            </View>
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
            editable={!isLoading}
          />
        </View>

        <View style={styles.avatarStyleRow}>
          <View>
            <Label style={styles.avatarStyleText}>{en.avatarStyle}</Label>
            <Label style={styles.sectionHint}>{en.chooseASignatureLook}</Label>
          </View>
          <View style={styles.availableContainer}>
            <Label style={styles.available}>6/6 Available</Label>
          </View>
        </View>

        <View>
          <FlatList
            data={AVATAR_STYLES}
            keyExtractor={item => item.id.toString()}
            renderItem={renderStyleItem}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.carousel}
          />
        </View>

        <TouchableOpacity
          activeOpacity={0.9}
          style={styles.btn}
          onPress={handleGenerateAvatar}
          disabled={isLoading}
        >
          <LinearGradient
            colors={[COLORS.gradientStart, COLORS.gradientEnd]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
          {isLoading ? (
            <ActivityIndicator size="small" color={COLORS.yellow} />
          ) : (
            <>
              <SvgIcon icon={SVG.starsWhite} width={hp(2)} height={hp(2)} />
              <Label style={styles.btnText}>{en.generateAvatar}</Label>
            </>
          )}
        </TouchableOpacity>

        {generatedAvatars.length > 0 && (
          <View style={styles.generatedHeaderRow}>
            <Label style={styles.avatarStyleText}>Generated Avatars</Label>
            <View style={styles.countBadge}>
              <Label style={styles.countText}>{generatedAvatars.length}</Label>
            </View>
          </View>
        )}
      </View>
    );
  }, [prompt, isLoading, selectedId, generatedAvatars.length, renderStyleItem]);

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={generatedAvatars}
        keyExtractor={item => item.id}
        renderItem={renderGeneratedAvatar}
        numColumns={2}
        ListHeaderComponent={renderHeader}
        columnWrapperStyle={generatedAvatars.length > 0 ? styles.rowGrid : null}
        contentContainerStyle={styles.mainContainer}
        showsVerticalScrollIndicator={false}
      />

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.warningIconCircle}>
              <SvgIcon
                icon={SVG.message || SVG.brain}
                width={hp(3)}
                height={hp(3)}
              />
            </View>

            <Label style={styles.modalTitle}>{en.emptyPrompt}</Label>
            <Label style={styles.modalDescription}>
              {en.emptyPromptDescription}
            </Label>

            <TouchableOpacity
              style={styles.modalCloseBtn}
              onPress={() => setModalVisible(false)}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={[COLORS.gradientStart, COLORS.gradientEnd]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFill}
              />
              <Label style={styles.modalCloseBtnText}>{en.gotIt}</Label>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default AvatarScreen;

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: COLORS.splashBg,
    paddingHorizontal: wp(5),
    paddingTop: hp(2),
    paddingBottom: hp(20),
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
    minHeight: hp(5.5),
    marginBottom: hp(3),
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
    backgroundColor: COLORS.surfaceAlt + HEX_OPACITY[22],
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
    textAlignVertical: 'top',
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
  },
  generatedHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(1.5),
    marginTop: hp(1),
  },
  countBadge: {
    backgroundColor: '#1D3557',
    width: wp(6),
    height: wp(6),
    borderRadius: wp(3),
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: wp(2),
  },
  countText: {
    color: '#4EA8DE',
    fontSize: hp(1.4),
    fontFamily: FONT.semiBold,
  },
  rowGrid: {
    justifyContent: 'space-between',
    marginBottom: hp(2.5),
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // Dark backdrop blur effect dene k liye
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: wp(8),
  },
  modalContent: {
    width: '100%',
    backgroundColor: COLORS.splashBg, // Jo aapka app ka dark background hai
    borderRadius: wp(5),
    padding: wp(6),
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)', // Subtle border line
  },
  warningIconCircle: {
    width: wp(14),
    height: wp(14),
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: wp(7),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp(2),
  },
  modalTitle: {
    color: COLORS.white,
    fontSize: hp(2.2),
    fontFamily: FONT.semiBold,
    marginBottom: hp(1),
  },
  modalDescription: {
    color: COLORS.mutedText,
    fontSize: hp(1.6),
    fontFamily: FONT.regular,
    textAlign: 'center',
    lineHeight: hp(2.2),
    marginBottom: hp(3),
  },
  modalCloseBtn: {
    width: '100%',
    paddingVertical: hp(1.4),
    borderRadius: hp(1.8),
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCloseBtnText: {
    color: COLORS.white,
    fontSize: hp(1.8),
    fontFamily: FONT.semiBold,
  },
});
