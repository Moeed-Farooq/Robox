import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import { COLORS, FONT, hp, wp } from '../../enums/StyleGuide';
import SvgIcon from '../../common/SvgIcon';
import { SVG } from '../../assets';
import { FREE_EMOTES_TABS } from '../../dummies';
import { FreeEmotesCards } from '../../components';
import { en } from '../../languages';
import { fetchRobloxEmotesPageByTab } from '../../services';
import Label from '../../common';

const ListHeader = ({
  navigation,
  selectedTab,
  onSelectTab,
  searchQuery,
  setSearchQuery,
  tabsDisabled,
}) => (
  <View>
    <View style={styles.headerRow}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation?.goBack()}
      >
        <SvgIcon icon={SVG.goBack} height={hp(3)} width={hp(3)} />
      </TouchableOpacity>
      <View style={styles.titleContainer}>
        <Label style={styles.headerTitle}>{en.newFree}</Label>
        <Label style={styles.headerSubTitle}>{en.emotesRobolx}</Label>
      </View>
      <View style={{ width: wp(10) }} />
    </View>

    <FlatList
      data={FREE_EMOTES_TABS}
      horizontal
      showsHorizontalScrollIndicator={false}
      keyExtractor={item => item.id}
      contentContainerStyle={styles.tabsContainer}
      renderItem={({ item }) => {
        const isActive = item.value === selectedTab;
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

    <View style={styles.searchBarContainer}>
      <SvgIcon
        icon={SVG.search}
        height={hp(3.2)}
        width={hp(3.2)}
        style={styles.searchIcon}
      />
      <TextInput
        style={styles.searchInput}
        placeholder="search item..."
        placeholderTextColor={COLORS.newlightWhite}
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      {searchQuery.length > 0 && (
        <TouchableOpacity onPress={() => setSearchQuery('')}>
          <SvgIcon icon={SVG.crossSmall} height={hp(3.2)} width={hp(3.2)} />
        </TouchableOpacity>
      )}
    </View>
  </View>
);

const FreeEmotesScreen = ({ navigation }) => {
  const [selectedTab, setSelectedTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [emotesData, setEmotesData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [nextCursor, setNextCursor] = useState(null);

  const activeRequestTabRef = useRef('all');
  const activeRequestIdRef = useRef(0);
  const activeAbortControllerRef = useRef(null);

  const normalizedSelectedTab = String(selectedTab || 'all').toLowerCase();

  const filteredData = emotesData.filter(item => {
    const matchesSearch = String(item?.title || '')
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    return matchesSearch;
  });

  const loadEmotes = useCallback(async (tabValue = 'all') => {
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

    setEmotesData([]);
    setNextCursor(null);
    setIsLoadingMore(false);
    setIsLoading(true);
    setErrorMessage('');

    try {
      const { items, nextCursor: initialCursor } =
        await fetchRobloxEmotesPageByTab({
          tab: normalizedTab,
          signal: controller.signal,
        });

      if (
        activeRequestIdRef.current !== requestId ||
        activeRequestTabRef.current !== normalizedTab
      ) {
        return;
      }

      setEmotesData(items);
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

      console.log('Roblox emotes fetch error:', error);
      setEmotesData([]);
      setNextCursor(null);
      setErrorMessage('Unable to load emotes right now.');
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

  const loadMoreEmotes = useCallback(async () => {
    if (!nextCursor || isLoading || isLoadingMore || errorMessage) {
      return;
    }

    setIsLoadingMore(true);

    try {
      const { items, nextCursor: cursor } = await fetchRobloxEmotesPageByTab({
        tab: normalizedSelectedTab,
        cursor: nextCursor,
      });

      setEmotesData(prevItems => {
        const existingIds = new Set(prevItems.map(item => item.id));
        const newItems = items.filter(item => !existingIds.has(item.id));

        return [...prevItems, ...newItems];
      });
      setNextCursor(cursor);
    } catch (error) {
      console.log('Roblox emotes pagination fetch error:', error);
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
    loadEmotes(normalizedSelectedTab);
  }, [loadEmotes, normalizedSelectedTab]);

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
          <ActivityIndicator size="large" color={COLORS.yellow} />
          <Label style={styles.feedbackText}>
            {en.loadingEmotes || 'Loading Emotes...'}
          </Label>
        </View>
      );
    }

    if (errorMessage) {
      return (
        <View style={styles.feedbackContainer}>
          <Label style={styles.feedbackText}>{errorMessage}</Label>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => loadEmotes(normalizedSelectedTab)}
          >
            <Label style={styles.retryButtonText}>
              {en.tryAgain || 'Try Again'}
            </Label>
          </TouchableOpacity>
        </View>
      );
    }

    if (searchQuery.trim()) {
      return (
        <View style={styles.feedbackContainer}>
          <Label style={styles.feedbackText}>No emotes match your search.</Label>
        </View>
      );
    }

    return (
      <View style={styles.feedbackContainer}>
        <Label style={styles.feedbackText}>No emotes available.</Label>
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
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.mainContainer}>
        <FlatList
          data={filteredData}
          keyExtractor={item => item.id}
          numColumns={2}
          columnWrapperStyle={styles.row}
          ListHeaderComponent={
            <ListHeader
              navigation={navigation}
              selectedTab={selectedTab}
              onSelectTab={handleTabPress}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              tabsDisabled={isLoading}
            />
          }
          renderItem={({ item }) => <FreeEmotesCards item={item} />}
          ListEmptyComponent={renderEmptyState}
          ListFooterComponent={renderFooter}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          onEndReached={loadMoreEmotes}
          onEndReachedThreshold={0.35}
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

export default FreeEmotesScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: COLORS.splashBg,
    paddingHorizontal: wp(2),
  },
  contentContainer: {
    paddingHorizontal: wp(4),
    paddingTop: hp(2),
    paddingBottom: hp(4),
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: hp(2),
    marginBottom: hp(3),
  },
  backButton: {
    backgroundColor: COLORS.yellow,
    padding: hp(1.2),
    borderRadius: wp(10),
  },
  titleContainer: {
    alignItems: 'center',
  },
  headerTitle: {
    color: COLORS.white,
    fontSize: hp(2.4),
    fontFamily: FONT.bold,
    letterSpacing: wp(0.2),
  },
  headerSubTitle: {
    color: COLORS.white,
    fontSize: hp(2.4),
    fontFamily: FONT.bold,
  },
  tabsContainer: {
    marginBottom: hp(2.5),
    paddingVertical: hp(0.5),
  },
  tabItem: {
    backgroundColor: COLORS.surfaceElevated,
    paddingHorizontal: wp(5),
    paddingVertical: hp(1.2),
    borderRadius: wp(6),
    marginRight: wp(2.5),
  },
  activeTabItem: {
    backgroundColor: COLORS.yellow,
  },
  tabText: {
    color: COLORS.newlightWhite,
    fontSize: hp(1.6),
    fontFamily: FONT.medium,
  },
  activeTabText: {
    color: COLORS.black,
    fontFamily: FONT.semiBold,
  },
  searchBarContainer: {
    backgroundColor: '#1E1E1E',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: wp(4),
    paddingHorizontal: wp(4),
    height: hp(6.5),
    marginBottom: hp(3),
  },
  searchIcon: {
    marginRight: wp(2),
  },
  searchInput: {
    flex: 1,
    color: COLORS.white,
    fontSize: hp(1.7),
    fontFamily: FONT.regular,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: hp(2),
  },
  feedbackContainer: {
    width: '100%',
    minHeight: hp(28),
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp(20),
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
});
