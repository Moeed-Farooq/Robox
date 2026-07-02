import React, { useState } from 'react';
import {
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
import { FREE_EMOTES_TABS, ITEMS_DATA } from '../../dummies';
import { FreeEmotesCards } from '../../components';
import { en } from '../../languages';
import Label from '../../common';

const ListHeader = ({ navigation, selectedTab, setSelectedTab, searchQuery, setSearchQuery }) => (
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
            onPress={() => setSelectedTab(item.value)}
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

  const filteredData = ITEMS_DATA.filter(item => {
    const matchesTab = item.category === selectedTab;
    const matchesSearch = item.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

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
              setSelectedTab={setSelectedTab}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
          }
          renderItem={({ item }) => <FreeEmotesCards item={item} />}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
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
});