import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SVG } from '../../assets';
import Label from '../../common';
import SvgIcon from '../../common/SvgIcon';
import PerkoxOfferCard from '../../components/perkoxOfferCard';
import { COLORS, FONT, HEX_OPACITY, hp, wp } from '../../enums/StyleGuide';
import useTotalPoints from '../../hooks/useTotalPoints';
import {
  fetchPerkoxOffers,
  getPerkoxPlayerId,
  mergePerkoxOffers,
} from '../../services/perkox/perkoxApi';
import { syncPerkoxEarningsToPoints } from '../../services/perkox/perkoxRewards';

const TABS = [
  { id: 'hot', title: 'Hot Offers' },
  { id: 'all', title: 'All Offers' },
];

const PerkoxOfferwallScreen = () => {
  const navigation = useNavigation();
  const { totalPoints } = useTotalPoints();
  const [selectedTab, setSelectedTab] = useState('hot');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState('');
  const [totalEarned, setTotalEarned] = useState(0);
  const [hotOffers, setHotOffers] = useState([]);
  const [offers, setOffers] = useState([]);
  const [hotPage, setHotPage] = useState(1);
  const [offersPage, setOffersPage] = useState(1);
  const [hotLastPage, setHotLastPage] = useState(1);
  const [offersLastPage, setOffersLastPage] = useState(1);
  const loadingMoreLockRef = useRef(false);

  const applyPageResult = useCallback((result, { replace = false } = {}) => {
    const nextHot = result.hotOffers || {};
    const nextOffers = result.offers || {};

    setTotalEarned(result.totalEarned || 0);

    setHotOffers(prev =>
      replace ? nextHot.data || [] : mergePerkoxOffers(prev, nextHot.data || []),
    );
    setOffers(prev =>
      replace
        ? nextOffers.data || []
        : mergePerkoxOffers(prev, nextOffers.data || []),
    );

    if (nextHot.currentPage) {
      setHotPage(nextHot.currentPage);
    }
    if (nextOffers.currentPage) {
      setOffersPage(nextOffers.currentPage);
    }

    setHotLastPage(nextHot.lastPage || 1);
    setOffersLastPage(nextOffers.lastPage || 1);
  }, []);

  const syncEarnings = useCallback(async ({ notifyGrant = false } = {}) => {
    const syncResult = await syncPerkoxEarningsToPoints();
    setTotalEarned(syncResult.totalEarned || 0);

    if (notifyGrant && syncResult.granted > 0) {
      Alert.alert(
        'Points Added',
        `${syncResult.granted} points were added to your total balance.`,
      );
    }

    return syncResult;
  }, []);

  const loadInitial = useCallback(
    async ({ isRefresh = false, notifyGrant = false } = {}) => {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError('');

      try {
        // Ensure player_id is Firebase uid before any request.
        getPerkoxPlayerId();

        await syncEarnings({ notifyGrant });

        const result = await fetchPerkoxOffers({
          offersPage: 1,
          hotOffersPage: 1,
        });

        applyPageResult(result, { replace: true });
        setHotPage(1);
        setOffersPage(1);
      } catch (err) {
        setError(err?.message || 'Unable to load offers right now.');
        if (isRefresh) {
          // Keep existing list on refresh failure.
        } else {
          setHotOffers([]);
          setOffers([]);
        }
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [applyPageResult, syncEarnings],
  );

  const loadMore = useCallback(async () => {
    if (loading || refreshing || loadingMore || loadingMoreLockRef.current) {
      return;
    }

    const isHot = selectedTab === 'hot';
    const currentPage = isHot ? hotPage : offersPage;
    const lastPage = isHot ? hotLastPage : offersLastPage;

    if (currentPage >= lastPage) {
      return;
    }

    const nextPage = currentPage + 1;
    loadingMoreLockRef.current = true;
    setLoadingMore(true);
    setError('');

    try {
      getPerkoxPlayerId();

      const result = await fetchPerkoxOffers({
        offersPage: isHot ? offersPage : nextPage,
        hotOffersPage: isHot ? nextPage : hotPage,
      });

      applyPageResult(result, { replace: false });

      if (isHot) {
        setHotPage(nextPage);
      } else {
        setOffersPage(nextPage);
      }
    } catch (err) {
      setError(err?.message || 'Unable to load more offers.');
    } finally {
      setLoadingMore(false);
      loadingMoreLockRef.current = false;
    }
  }, [
    applyPageResult,
    hotLastPage,
    hotPage,
    loading,
    loadingMore,
    offersLastPage,
    offersPage,
    refreshing,
    selectedTab,
  ]);

  useFocusEffect(
    useCallback(() => {
      loadInitial({ notifyGrant: true });
    }, [loadInitial]),
  );

  const listData = useMemo(
    () => (selectedTab === 'hot' ? hotOffers : offers),
    [hotOffers, offers, selectedTab],
  );

  const canLoadMore =
    selectedTab === 'hot' ? hotPage < hotLastPage : offersPage < offersLastPage;

  const renderHeader = () => (
    <View>
      <View style={styles.headerRow}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <SvgIcon icon={SVG.goBack} height={hp(2.8)} width={hp(2.8)} />
        </TouchableOpacity>
        <View style={styles.titleWrap}>
          <Label style={styles.title}>Perkox Offerwall Rewards</Label>
          <Label style={styles.subtitle}>Earn coins by completing offers</Label>
        </View>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.earnedCard}>
        <Label style={styles.earnedLabel}>Perkox earned</Label>
        <Label style={styles.earnedValue}>
          {Number(totalEarned).toLocaleString()} coins
        </Label>
        <Label style={styles.appPointsLabel}>
          App total points: {Number(totalPoints).toLocaleString()}
        </Label>
      </View>

      <View style={styles.tabsRow}>
        {TABS.map(tab => {
          const isActive = tab.id === selectedTab;
          return (
            <TouchableOpacity
              key={tab.id}
              style={[styles.tab, isActive && styles.tabActive]}
              onPress={() => setSelectedTab(tab.id)}
            >
              <Label style={[styles.tabText, isActive && styles.tabTextActive]}>
                {tab.title}
              </Label>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );

  const renderFooter = () => {
    if (!loadingMore) {
      return null;
    }

    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={COLORS.accent} />
      </View>
    );
  };

  const renderEmpty = () => {
    if (loading) {
      return null;
    }

    return (
      <View style={styles.emptyWrap}>
        <Label style={styles.emptyTitle}>
          {error ? 'Could not load offers' : 'No offers available'}
        </Label>
        <Label style={styles.emptyMessage}>
          {error || 'Pull to refresh or try again later.'}
        </Label>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => loadInitial({ notifyGrant: true })}
        >
          <Label style={styles.retryText}>Try Again</Label>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {loading && !refreshing ? (
        <View style={styles.loaderWrap}>
          {renderHeader()}
          <ActivityIndicator size="large" color={COLORS.accent} style={styles.loader} />
        </View>
      ) : (
        <FlatList
          data={listData}
          keyExtractor={item => `${item.section}-${item.id}`}
          renderItem={({ item }) => <PerkoxOfferCard item={item} />}
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={renderEmpty}
          ListFooterComponent={renderFooter}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          onEndReachedThreshold={0.4}
          onEndReached={() => {
            if (canLoadMore) {
              loadMore();
            }
          }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => loadInitial({ isRefresh: true, notifyGrant: true })}
              tintColor={COLORS.accent}
            />
          }
        />
      )}
    </SafeAreaView>
  );
};

export default PerkoxOfferwallScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.splashBg,
  },
  listContent: {
    paddingHorizontal: wp(5),
    paddingBottom: hp(4),
    flexGrow: 1,
  },
  loaderWrap: {
    flex: 1,
    paddingHorizontal: wp(5),
  },
  loader: {
    marginTop: hp(8),
  },
  footerLoader: {
    paddingVertical: hp(2),
    alignItems: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp(1),
    marginBottom: hp(1.5),
  },
  backButton: {
    width: hp(5),
    height: hp(5),
    borderRadius: hp(2.5),
    backgroundColor: COLORS.yellow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleWrap: {
    flex: 1,
    marginHorizontal: wp(3),
  },
  title: {
    color: COLORS.lightYellow,
    fontSize: hp(2.4),
    fontFamily: FONT.bold,
  },
  subtitle: {
    color: COLORS.lightestWhite,
    fontSize: hp(1.35),
    fontFamily: FONT.regular,
    marginTop: hp(0.2),
  },
  headerSpacer: {
    width: hp(5),
  },
  earnedCard: {
    backgroundColor: COLORS.surfaceElevated + HEX_OPACITY[70],
    borderRadius: hp(1.6),
    borderWidth: 1,
    borderColor: COLORS.blue,
    paddingHorizontal: wp(4),
    paddingVertical: hp(1.4),
    marginBottom: hp(1.5),
  },
  earnedLabel: {
    color: COLORS.lightestWhite,
    fontSize: hp(1.3),
    fontFamily: FONT.regular,
  },
  earnedValue: {
    color: COLORS.accent,
    fontSize: hp(2.2),
    fontFamily: FONT.bold,
    marginTop: hp(0.3),
  },
  appPointsLabel: {
    color: COLORS.newwhite,
    fontSize: hp(1.35),
    fontFamily: FONT.medium,
    marginTop: hp(0.6),
  },
  tabsRow: {
    flexDirection: 'row',
    marginBottom: hp(1.5),
    gap: wp(2),
  },
  tab: {
    flex: 1,
    borderRadius: hp(1.2),
    borderWidth: 1,
    borderColor: COLORS.whiteBorderLight,
    paddingVertical: hp(1.1),
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabActive: {
    backgroundColor: COLORS.accent,
    borderColor: COLORS.accent,
  },
  tabText: {
    color: COLORS.lightestWhite,
    fontSize: hp(1.45),
    fontFamily: FONT.medium,
    textAlign: 'center',
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  tabTextActive: {
    color: COLORS.black,
    fontFamily: FONT.semiBold,
  },
  emptyWrap: {
    alignItems: 'center',
    marginTop: hp(6),
    paddingHorizontal: wp(4),
  },
  emptyTitle: {
    color: COLORS.newwhite,
    fontSize: hp(1.9),
    fontFamily: FONT.semiBold,
    textAlign: 'center',
  },
  emptyMessage: {
    color: COLORS.lightestWhite,
    fontSize: hp(1.4),
    fontFamily: FONT.regular,
    textAlign: 'center',
    marginTop: hp(1),
  },
  retryButton: {
    marginTop: hp(2),
    backgroundColor: COLORS.accent,
    borderRadius: hp(1.2),
    paddingHorizontal: wp(5),
    paddingVertical: hp(1.2),
  },
  retryText: {
    color: COLORS.black,
    fontSize: hp(1.5),
    fontFamily: FONT.semiBold,
  },
});
