import React, { useState } from 'react';
import {
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import { COLORS, FONT, hp, wp } from '../../enums/StyleGuide';
import SvgIcon from '../../common/SvgIcon';
import { SVG } from '../../assets';
import { ROBUX_SKINS_SCREEN_TABS, ITEMS_DATA } from '../../dummies';
import { en } from '../../languages';
import { RobuxSkinsCard } from '../../components';
import Label from '../../common';

const ListHeader = ({ navigation, selectedTab, setSelectedTab }) => (
  <View>
    <View style={styles.headerRow}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation?.goBack()}
      >
        <SvgIcon icon={SVG.goBack} height={hp(2.5)} width={hp(2.5)} />
      </TouchableOpacity>
      <View style={styles.titleContainer}>
        <Label style={styles.headerTitle}>{en.robuxSkins || 'Robux Skins'}</Label>
      </View>
      <View style={{ width: wp(10) }}/>
    </View>
    <FlatList
      data={ROBUX_SKINS_SCREEN_TABS}
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
  </View>
);

const RobuxSkinsScreen = ({ navigation }) => {
  const [selectedTab, setSelectedTab] = useState('all');

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.mainContainer}>
        <FlatList
          data={ITEMS_DATA}
          keyExtractor={item => item.id}
          numColumns={2}
          columnWrapperStyle={styles.row}
          ListHeaderComponent={
            <ListHeader
              navigation={navigation}
              selectedTab={selectedTab}
              setSelectedTab={setSelectedTab}
            />
          }
          renderItem={({ item }) => <RobuxSkinsCard item={item} />}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

export default RobuxSkinsScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: COLORS.splashBg,
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
    backgroundColor:COLORS.yellow,
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
});
