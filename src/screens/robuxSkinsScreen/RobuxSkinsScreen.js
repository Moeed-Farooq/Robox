import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SVG } from '../../assets';
import Label from '../../common';
import SvgIcon from '../../common/SvgIcon';
import { RobuxSkinsCard } from '../../components';
import { ROBUX_SKINS_SCREEN_TABS } from '../../dummies';
import { ENGAGEMENT_THRESHOLDS } from '../../enums';
import { COLORS, FONT, hp, wp } from '../../enums/StyleGuide';
import { en } from '../../languages';
import useTotalPoints from '../../hooks/useTotalPoints';
import { fetchRobuxSkinsPageByTab } from '../../services';
import { AppBannerAd } from '../../services/ads';

const UNLOCK_POINTS = ENGAGEMENT_THRESHOLDS.FEATURE_UNLOCK;

const ListHeader = ({ navigation, selectedTab, onSelectTab, tabsDisabled }) => (
  <View>
    <View style={styles.headerRow}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation?.goBack()}
      >
        <SvgIcon icon={SVG.goBack} height={hp(2.5)} width={hp(2.5)} />
      </TouchableOpacity>
        <Label style={styles.headerTitle}>
          {en.robuxSkins || 'Robux Skins'}
        </Label>
      <View style={{ width: wp(10) }} />
    </View>

    <FlatList
      data={ROBUX_SKINS_SCREEN_TABS}
      horizontal
      showsHorizontalScrollIndicator={false}
      keyExtractor={item => item.id}
      contentContainerStyle={styles.tabsContainer}
      renderItem={({ item }) => {
        const isActive =
          String(item.value).toLowerCase() ===
          String(selectedTab).toLowerCase();

        return (
          <TouchableOpacity
            style={[styles.tabItem, isActive && styles.activeTabItem]}
            onPress={() => onSelectTab(item.value)}
            disabled={tabsDisabled}
            activeOpacity={tabsDisabled ? 1 : 0.7}
          >
            <Label style={[styles.tabText, isActive && styles.activeTabText]}>
              {item.title}
            </Label>
          </TouchableOpacity>
        );
      }}
    />
  </View>
);

const RobuxSkinsScreen = ({ navigation }) => {
  const { totalPoints, loading: pointsLoading } = useTotalPoints();
  const [selectedTab, setSelectedTab] = useState('all');
  const [skinsData, setSkinsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [nextCursor, setNextCursor] = useState(null);

  const activeRequestTabRef = useRef('all');
  const activeRequestIdRef = useRef(0);
  const activeAbortControllerRef = useRef(null);
  const hasRedirectedRef = useRef(false);

  const normalizedSelectedTab = String(selectedTab || 'all').toLowerCase();
  const isFeatureLocked =
    !pointsLoading && Number(totalPoints) < UNLOCK_POINTS;

  useEffect(() => {
    if (!isFeatureLocked || hasRedirectedRef.current) {
      return;
    }

    hasRedirectedRef.current = true;
    Alert.alert(
      en.featureLocked,
      en.featureLockedMessage.replace('{points}', String(UNLOCK_POINTS)),
      [{ text: en.ok, onPress: () => navigation.goBack() }],
    );
    navigation.goBack();
  }, [isFeatureLocked, navigation]);

  const loadSkins = useCallback(async (tabValue = 'all') => {
    const normalizedTab = String(tabValue || 'all').toLowerCase();
    activeRequestIdRef.current += 1;
    const requestId = activeRequestIdRef.current;

    if (activeAbortControllerRef.current) {
      activeAbortControllerRef.current.abort();
      activeAbortControllerRef.current = null;
    }

    const controller = new AbortController();
    activeAbortControllerRef.current = controller;
    activeRequestTabRef.current = normalizedTab;

    // Immediate UX reset for tab switching: remove stale list and reset cursor.
    setSkinsData([]);
    setNextCursor(null);
    setIsLoadingMore(false);
    setIsLoading(true);
    setErrorMessage('');

    try {
      const { items, nextCursor: initialCursor } =
        await fetchRobuxSkinsPageByTab({
          tab: normalizedTab,
          signal: controller.signal,
        });

      if (
        activeRequestIdRef.current !== requestId ||
        activeRequestTabRef.current !== normalizedTab
      ) {
        return;
      }

      setSkinsData(items);
      setNextCursor(initialCursor);
    } catch (error) {
      if (error?.name === 'AbortError') {
        return;
      }

      if (
        activeRequestIdRef.current !== requestId ||
        activeRequestTabRef.current !== normalizedTab
      ) {
        return;
      }

      console.log('Robux skins fetch error:', error);
      setSkinsData([]);
      setNextCursor(null);
      setErrorMessage('Unable to load skins right now.');
    } finally {
      if (
        activeRequestIdRef.current === requestId &&
        activeRequestTabRef.current === normalizedTab
      ) {
        setIsLoading(false);
      }

      if (activeAbortControllerRef.current === controller) {
        activeAbortControllerRef.current = null;
      }
    }
  }, []);

  const handleTabPress = useCallback(
    tabValue => {
      if (isLoading) {
        return;
      }

      const normalizedTab = String(tabValue || 'all').toLowerCase();

      if (normalizedTab === normalizedSelectedTab) {
        return;
      }

      setSelectedTab(normalizedTab);
    },
    [isLoading, normalizedSelectedTab],
  );

  const loadMoreSkins = useCallback(async () => {
    if (!nextCursor || isLoading || isLoadingMore || errorMessage) {
      return;
    }

    setIsLoadingMore(true);

    try {
      const { items, nextCursor: cursor } = await fetchRobuxSkinsPageByTab({
        tab: normalizedSelectedTab,
        cursor: nextCursor,
      });

      setSkinsData(prevItems => {
        const existingIds = new Set(prevItems.map(item => item.id));
        const newItems = items.filter(item => !existingIds.has(item.id));

        return [...prevItems, ...newItems];
      });
      setNextCursor(cursor);
    } catch (error) {
      console.log('Robux skins pagination fetch error:', error);
    } finally {
      setIsLoadingMore(false);
    }
  }, [
    nextCursor,
    isLoading,
    isLoadingMore,
    errorMessage,
    normalizedSelectedTab,
  ]);

  useEffect(() => {
    if (pointsLoading || isFeatureLocked) {
      return;
    }

    loadSkins(normalizedSelectedTab);
  }, [isFeatureLocked, loadSkins, normalizedSelectedTab, pointsLoading]);

  useEffect(() => {
    return () => {
      if (activeAbortControllerRef.current) {
        activeAbortControllerRef.current.abort();
      }
    };
  }, []);

  const renderEmptyState = () => {
    if (isLoading) {
      return (
        <View style={styles.feedbackContainer}>
          <ActivityIndicator color={COLORS.yellow} />
        </View>
      );
    }

    if (errorMessage) {
      return (
        <View style={styles.feedbackContainer}>
          <Label style={styles.feedbackText}>{errorMessage}</Label>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => loadSkins(normalizedSelectedTab)}
          >
            <Label style={styles.retryButtonText}>
              {en.tryAgain || 'Try Again'}
            </Label>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.feedbackContainer}>
        <Label style={styles.feedbackText}>No skins available.</Label>
      </View>
    );
  };

  const renderFooter = () => {
    if (!isLoadingMore) {
      return null;
    }

    return (
      <View style={styles.paginationLoaderContainer}>
        <ActivityIndicator size="small" color={COLORS.yellow} />
      </View>
    );
  };

  return (
    <SafeAreaView style={[{ flex: 1, backgroundColor: COLORS.splashBg }, styles.mainContainer]}>
      <View style={styles.stickyHeader}>
        <ListHeader
          navigation={navigation}
          selectedTab={selectedTab}
          onSelectTab={handleTabPress}
          tabsDisabled={isLoading}
        />
      </View>

      <FlatList
        data={skinsData}
        keyExtractor={item => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        style={styles.list}
        renderItem={({ item }) => <RobuxSkinsCard item={item} />}
        ListEmptyComponent={renderEmptyState}
        ListFooterComponent={renderFooter}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        onEndReached={loadMoreSkins}
        onEndReachedThreshold={0.35}
      />

      <View style={styles.bannerContainer}>
        <AppBannerAd />
      </View>
    </SafeAreaView>
  );
};

export default RobuxSkinsScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: COLORS.splashBg,
  },
  stickyHeader: {
    paddingHorizontal: wp(4),
    backgroundColor: COLORS.splashBg,
    zIndex: 1,
  },
  list: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: wp(4),
    paddingBottom: hp(4),
    flexGrow: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: hp(1),
    marginBottom: hp(3),
  },
  backButton: {
    backgroundColor: COLORS.yellow,
    padding: hp(1.5),
    borderRadius: wp(10),
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    marginRight: wp(-10),
  },
  headerTitle: {
    color: COLORS.white,
    fontSize: hp(3.2),
    fontFamily: FONT.bold,
  },
  tabsContainer: {
    marginBottom: hp(2.5),
    paddingVertical: hp(0.5),
  },
  tabItem: {
    backgroundColor: COLORS.surfaceElevated,
    paddingHorizontal: wp(6),
    paddingVertical: hp(1.2),
    borderRadius: wp(6),
    marginRight: wp(2.5),
  },
  activeTabItem: {
    backgroundColor: COLORS.yellow,
  },
  tabText: {
    color: COLORS.white,
    fontSize: hp(1.6),
    fontFamily: FONT.medium,
  },
  activeTabText: {
    color: COLORS.surfaceElevated,
    fontFamily: FONT.semiBold,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: hp(2.5),
  },
  feedbackContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  feedbackText: {
    color: COLORS.white,
    fontSize: hp(1.8),
    fontFamily: FONT.medium,
    marginTop: hp(1.4),
    textAlign: 'center',
  },
  retryButton: {
    marginTop: hp(1.8),
    backgroundColor: COLORS.yellow,
    paddingHorizontal: wp(5),
    paddingVertical: hp(1),
    borderRadius: wp(4),
  },
  retryButtonText: {
    color: COLORS.surfaceElevated,
    fontSize: hp(1.6),
    fontFamily: FONT.semiBold,
  },
  paginationLoaderContainer: {
    paddingVertical: hp(2),
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerContainer: {
    paddingBottom: hp(1),
    alignItems: 'center',
    justifyContent: 'center',
  },
});
