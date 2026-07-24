import React, { useEffect, useState } from 'react';
import { StyleSheet, View, SectionList, TouchableOpacity } from 'react-native';
import { COLORS, FONT, hp, wp } from '../../enums/StyleGuide';
import Label from '../../common';
import SvgIcon from '../../common/SvgIcon';
import { SVG } from '../../assets';
import { en } from '../../languages';
import { SETTINGS_SECTIONS } from '../../dummies';
import { SettingsItem } from '../../components';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { preloadInterstitialAd, showInterstitialIfAvailable } from '../../services/ads';
import { SETTINGS_ACTION } from '../../enums';
import {
  getAppStoreShareUrl,
  openAppStore,
  openSupportEmail,
  requestNativeAppReview,
  shareApp,
} from '../../helpers';

const SettingsScreen = () => {
  const [sections, setSections] = useState(SETTINGS_SECTIONS);
  const [appLink, setAppLink] = useState('');
  const navigation = useNavigation();
  const visibleSections = sections.filter(section => section.title !== 'Preferences');

  useEffect(() => {
    let isMounted = true;

    getAppStoreShareUrl()
      .then(url => {
        if (isMounted && url) {
          setAppLink(url);
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, []);

  const handleToggle = (sectionTitle, itemId, itemTitle, value) => {
    setSections(prevSections =>
      prevSections.map(section => {
        if (section.title !== sectionTitle) return section;

        return {
          ...section,
          data: section.data.map(item =>
            item.id === itemId ? { ...item, value } : item,
          ),
        };
      }),
    );

    const normalizedTitle = String(itemTitle || '').toLowerCase();
    const shouldShowInterstitial =
      normalizedTitle === 'notifications' ||
      normalizedTitle === 'sound effects' ||
      normalizedTitle === 'haptics feedback';

    if (shouldShowInterstitial) {
      const shown = showInterstitialIfAvailable();

      if (!shown) {
        preloadInterstitialAd();
      }
    }
  };

  const handleRateApp = async () => {
    const launched = await requestNativeAppReview();
    if (!launched) {
      await openAppStore();
    }
  };

  const renderSectionHeader = ({ section }) => (
    <Label style={styles.sectionTitle}>{section.title}</Label>
  );

  const renderItem = ({ item, section }) => (
    <SettingsItem
      item={item}
      type={section.type}
      onToggle={value => handleToggle(section.title, item.id, item.title, value)}
      onPress={() => {
        if (item?.action === SETTINGS_ACTION.RATE_APP) {
          handleRateApp();
          return;
        }

        if (item?.action === SETTINGS_ACTION.SHARE_APP) {
          shareApp();
          return;
        }

        if (item?.action === SETTINGS_ACTION.HELP_SUPPORT) {
          openSupportEmail();
          return;
        }

        if (item?.screen) {
          navigation.navigate(item.screen);
        }
      }}
    />
  );

  const renderListHeader = () => (
    <View style={styles.HeaderRow}>
      <Label style={styles.settingsText}>{en.settings}</Label>

      <SvgIcon icon={SVG.userAvatarYellow} width={hp(3)} height={hp(3)} />
    </View>
  );

  const renderListFooter = () => {
    if (!appLink) {
      return null;
    }

    return (
      <View style={styles.appLinkCard}>
        <Label style={styles.appLinkTitle}>App link</Label>
        <Label style={styles.appLinkValue} numberOfLines={2}>
          {appLink}
        </Label>
        <View style={styles.appLinkActions}>
          <TouchableOpacity
            style={styles.appLinkButton}
            activeOpacity={0.85}
            onPress={() => shareApp()}
          >
            <Label style={styles.appLinkButtonText}>Share Link</Label>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.appLinkButton, styles.appLinkButtonSecondary]}
            activeOpacity={0.85}
            onPress={() => openAppStore()}
          >
            <Label style={styles.appLinkButtonTextSecondary}>Open Store</Label>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.splashBg }}>
      <SectionList
        sections={visibleSections}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        ListHeaderComponent={renderListHeader}
        ListFooterComponent={renderListFooter}
        stickySectionHeadersEnabled={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      />
    </SafeAreaView>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: COLORS.splashBg,
  },

  contentContainer: {
    paddingTop: wp(2),
    paddingHorizontal: wp(5),
    paddingBottom: hp(15),
  },

  HeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp(1),
  },

  settingsText: {
    color: COLORS.lightYellow,
    fontSize: hp(2.8),
    fontFamily: FONT.semiBold,
  },

  sectionTitle: {
    marginTop: hp(3),
    marginBottom: hp(1.5),
    color: COLORS.lightYellow,
    fontSize: hp(2.2),
    fontFamily: FONT.semiBold,
  },

  appLinkCard: {
    marginTop: hp(3),
    padding: wp(4),
    borderRadius: hp(1.6),
    backgroundColor: COLORS.surfaceElevated,
    borderWidth: 1,
    borderColor: COLORS.blue,
  },

  appLinkTitle: {
    color: COLORS.lightYellow,
    fontSize: hp(1.8),
    fontFamily: FONT.semiBold,
  },

  appLinkValue: {
    color: COLORS.lightestWhite,
    fontSize: hp(1.4),
    fontFamily: FONT.regular,
    marginTop: hp(1),
  },

  appLinkActions: {
    flexDirection: 'row',
    marginTop: hp(1.5),
    gap: wp(2),
  },

  appLinkButton: {
    flex: 1,
    backgroundColor: COLORS.accent,
    borderRadius: hp(1.2),
    paddingVertical: hp(1.2),
    alignItems: 'center',
  },

  appLinkButtonSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.whiteBorderLight,
  },

  appLinkButtonText: {
    color: COLORS.black,
    fontSize: hp(1.5),
    fontFamily: FONT.semiBold,
  },

  appLinkButtonTextSecondary: {
    color: COLORS.newwhite,
    fontSize: hp(1.5),
    fontFamily: FONT.medium,
  },
});
