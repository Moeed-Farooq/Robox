import React, { useState } from 'react';
import { StyleSheet, View, SectionList } from 'react-native';
import { COLORS, FONT, hp, wp } from '../../enums/StyleGuide';
import Label from '../../common';
import SvgIcon from '../../common/SvgIcon';
import { SVG } from '../../assets';
import { en } from '../../languages';
import { SETTINGS_SECTIONS } from '../../dummies';
import { SettingsItem } from '../../components';

const SettingsScreen = () => {
  const [sections, setSections] = useState(SETTINGS_SECTIONS);

  const handleToggle = (sectionTitle, itemId, value) => {
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
  };

  const renderSectionHeader = ({ section }) => (
    <Label style={styles.sectionTitle}>{section.title}</Label>
  );

  const renderItem = ({ item, section }) => (
    <SettingsItem
      item={item}
      type={section.type}
      onToggle={value => handleToggle(section.title, item.id, value)}
    />
  );

  const renderListHeader = () => (
    <View style={styles.HeaderRow}>
      <Label style={styles.settingsText}>{en.settings}</Label>

      <SvgIcon
        icon={SVG.userAvatarYellow}
        width={hp(3)}
        height={hp(3)}
      />
    </View>
  );

  return (
    <View style={styles.mainContainer}>
      <SectionList
        sections={sections}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        ListHeaderComponent={renderListHeader}
        stickySectionHeadersEnabled={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      />
    </View>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: COLORS.splashBg,
  },

  contentContainer: {
    paddingTop: wp(8),
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
});