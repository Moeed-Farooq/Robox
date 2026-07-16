import { View, StyleSheet } from 'react-native';
import * as ui from '../screens';
import { SCREEN } from '../enums';
import If from '../common/If';
import Label from '../common/Label';
import SvgIcon from '../common/SvgIcon';
import { bottomIcons } from '../dummies';
import {
  COLORS,
  commonStyles,
  FONT,
  HEX_OPACITY,
  hp,
  wp,
} from '../enums/StyleGuide';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import LinearGradient from 'react-native-linear-gradient';
import { isIOS } from '../helpers';

const ICON_SIZE = wp(6);

const renderIcon =
  routeName =>
  ({ focused }) => {
    const item = bottomIcons[routeName];
    if (!item) {
      return null;
    }

    return (
      <View style={[styles.tabContainer, item.title && { marginTop: isIOS() ? hp(7) : hp(6) }]}>
        <View style={[styles.iconBg, focused && styles.activeIconBg]}>
          <SvgIcon
            icon={focused ? item.activeIcon : item.iconName}
            width={ICON_SIZE}
            height={ICON_SIZE}
          />
        </View>
        <If condition={item?.title}>
          <Label
            style={[
              styles.text,
              focused ? styles.activeText : styles.inactiveText,
            ]}
          >
            {item?.title}
          </Label>
        </If>
      </View>
    );
  };

const BottomNavigator = () => {
  const Tab = createBottomTabNavigator();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarIcon: renderIcon(route.name),
        tabBarItemStyle: {
          paddingRight: 0,
          paddingLeft: 0,
        },
        tabBarStyle: {
          position: 'absolute',
          bottom: hp(2.5),
          marginHorizontal: wp(5),
          height: hp(12),
          borderRadius: wp(8),
          backgroundColor: 'transparent',
          borderWidth: wp(0.6),
          borderColor: COLORS.lightYellow + HEX_OPACITY[55],
          shadowColor: COLORS.accent,
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.35,
          shadowRadius: 16,
          elevation: 14,
        },
        tabBarBackground: () => (
          <LinearGradient
            colors={[COLORS.surfaceAlt, COLORS.Purple, COLORS.bgPurpleDark]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[
              StyleSheet.absoluteFill,
              { borderRadius: wp(8), overflow: 'hidden' },
            ]}
          />
        ),
      })}
    >
      <Tab.Screen name={SCREEN.HOME_SCREEN} component={ui.HomeScreen} />
      <Tab.Screen name={SCREEN.GAMES_SCREEN} component={ui.GamesScreen} />
      <Tab.Screen name={SCREEN.AVATAR_SCREEN} component={ui.AvatarScreen} />
      <Tab.Screen name={SCREEN.SETTINGS_SCREEN} component={ui.SettingsScreen} />
    </Tab.Navigator>
  );
};

export default BottomNavigator;

const styles = StyleSheet.create({
  tabContainer: {
    height: '100%',
    width: wp(22),
    ...commonStyles.center,
  },
  iconBg: {
    width: wp(11),
    height: wp(11),
    borderRadius: wp(5.5),
    ...commonStyles.center,
    backgroundColor: COLORS.white + HEX_OPACITY[6],
    borderWidth: 1,
    borderColor: COLORS.white + HEX_OPACITY[12],
  },
  activeIconBg: {
    backgroundColor: COLORS.accent + HEX_OPACITY[20],
    borderColor: COLORS.lightYellow + HEX_OPACITY[68],
  },
  text: {
    fontSize: 11,
    fontFamily: FONT.medium,
    textAlign: 'center',
    marginTop: hp(0.4),
  },
  activeText: {
    color: COLORS.lightYellow,
    textShadowColor: COLORS.accent + HEX_OPACITY[45],
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  inactiveText: {
    color: COLORS.mutedText,
  },
});
