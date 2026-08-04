export const SCREEN = {
  SPLASH_SCREEN: 'SplashScreen',
  HOME_SCREEN: 'HomeScreen',
  AVATAR_SCREEN: 'AvatarScreen',
  GAMES_SCREEN: 'GamesScreen',
  SETTINGS_SCREEN: 'SettingsScreen',
  FREE_DAILY_ROBUX_SCREEN: 'FreeDailyRobuxScreen',
  DAILY_ROBUX_QUIZ: 'DailyRobuxQuiz',
  ROBUX_CODES_SCREEN: 'RobuxCodesScreen',
  TERMS_AND_CONDITIONS_SCREEN: 'TermsAndConditionsScreen',
  PRIVACY_SCREEN: 'PrivacyScreen',
  WORD_QUIZ_SCREEN: 'WordQuizScreen',
  RBX_CALCULATOR_SCREEN: 'RbxCalculatorScreen',
  BLOCK_PUZZLE_SCREEN: 'BlockPuzzleScreen',
  SPIN_WHEEL_SCREEN: 'SpinWheelScreen',
  BLOX_FRUITS_GAME: 'BloxFruitsGame',
  JAIL_BREAK_GAME: 'JailBreakGame',
  FREE_EMOTES_SCREEN: 'FreeEmotesScreen',
  ROBUX_SKINS_SCREEN: 'RobuxSkinsScreen',
  ADOPT_ME_GAME: 'AdoptMeGame',
  ARSENAL_GAME: 'ArsenalGame',
  FLEE_THE_FACILITY_GAME: 'FleeTheFacilityGame',
  MURDER_MYSTERY_GAME: 'MurderMysteryGame',
  PHANTOM_FORCES_GAME: 'PhantomForcesGame',
  ROYALE_HIGH_GAME: 'RoyaleHighGame',
  TOWER_HELL_GAME: 'TowerHellGame',
  PERKOX_OFFERWALL_SCREEN: 'PerkoxOfferwallScreen',
  PERKOX_WEBVIEW_SCREEN: 'PerkoxWebViewScreen',
};
export const TAB = {
  BOTTOM: 'BottomNavigator',
};
export const KEYBOARD_TYPE = {
  DEFAULT: 'default',
  DECIMAL_PAD: 'decimal-pad',
  NUMERIC: 'numeric',
  EMAIL: 'email-address',
  PHONE_PAD: 'phone-pad',
  URL: 'url',
};
export const ADS = {
  ADS_DOCUMENT: 'showAds',
  ADS_FIELD: 'enabled',
};
export const FIREBASE_COLLECTIONS = {
  USERS_COLLECTION: 'users',
  ADS_COLLECTION: 'ads',
};

// Show interstitial when navigating into these screens (before mini-games / key features).
export const INTERSTITIAL_ADS_SCREENS = [
  SCREEN.BLOX_FRUITS_GAME,
  SCREEN.JAIL_BREAK_GAME,
  SCREEN.BLOCK_PUZZLE_SCREEN,
  SCREEN.WORD_QUIZ_SCREEN,
  SCREEN.SPIN_WHEEL_SCREEN,
  SCREEN.DAILY_ROBUX_QUIZ,
  SCREEN.ADOPT_ME_GAME,
  SCREEN.ARSENAL_GAME,
  SCREEN.FLEE_THE_FACILITY_GAME,
  SCREEN.MURDER_MYSTERY_GAME,
  SCREEN.PHANTOM_FORCES_GAME,
  SCREEN.ROYALE_HIGH_GAME,
  SCREEN.TOWER_HELL_GAME,
];

export const ENGAGEMENT_THRESHOLDS = {
  RATE: 50,
  SHARE: 70,
};

export const APP_STORE = {
  ANDROID_PACKAGE_NAME: 'robuxskin.getskin.com',
  IOS_BUNDLE_ID: 'RobuxFruits.perkmedia.app',
  IOS_APP_STORE_ID: '',
};

export const SETTINGS_ACTION = {
  RATE_APP: 'RATE_APP',
  SHARE_APP: 'SHARE_APP',
  HELP_SUPPORT: 'HELP_SUPPORT',
};

export const SUPPORT = {
  EMAIL: 'support@perkmedia-group.com',
};
