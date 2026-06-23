import { SVG } from '../assets';
import { IMAGES } from '../assets/images';
import { SCREEN } from '../enums';
import { COLORS } from '../enums/StyleGuide';

export const bottomIcons = {
  [SCREEN.HOME_SCREEN]: {
    iconName: SVG.Home,
    activeIcon: SVG.HomeActive,
    title: 'Home',
  },
  [SCREEN.GAMES_SCREEN]: {
    iconName: SVG.gameController,
    activeIcon: SVG.gameControllerActive,
    title: 'Games',
  },
  [SCREEN.AVATAR_SCREEN]: {
    iconName: SVG.avatar,
    activeIcon: SVG.avatarActive,
    title: 'Avatar',
  },
  [SCREEN.SETTINGS_SCREEN]: {
    iconName: SVG.settings,
    activeIcon: SVG.settingsActive,
    title: 'Settings',
  },
};


export const DailyReward = [
  {
    id: 1,
    title1: 'Free Daily Robux',
    title2: 'Earn more daily',
    src: IMAGES.DAILY_ROBUX,
    reward: '2,500',
    color: COLORS.yellow,
  },
  {
    id: 2,
    title1: 'New Free Emotes! Roblox',
    title2: 'Exclusive skins',
    src: IMAGES.FREE_EMOTE,
    reward: 'Elite',
    color: COLORS.pink,
  },
];

export const RobuxFeaturesData = [
  { id: 1, title: 'Robux Codes' },
  { id: 2, title: 'Robux Skins' },
  { id: 3, title: 'Wordy Robux' },
  { id: 4, title: 'RBX Calculator' },
  { id: 5, title: 'Block Puzzle' },
  { id: 6, title: 'Spin Wheel' },
];


export const GAMES_DATA = [
  {
    title: "Easy Games",
    detail:"Perfect for beginners",
    bgcolor: COLORS.splashBg,
    icon: SVG.dart,
    data: [
      { id: "1", name: "Blox Fruits", detail: "Puzzle your way\nthrough Blox Fruits!", level: "Easy", subDetail: "Great for\nbeginners", bgcolor: "#4CAF50", icon: SVG.pirateFlag },
      { id: "2", name: "Adopt Me", detail: "Raise magical pets\nand build your drea...", level: "Easy", subDetail: "Perfect\nfor families", bgcolor: "#e95889", icon: SVG.paw },
      { id: "3", name: "Tower of Hell", detail: "Climb the ultimate\ntower challenge", level: "Easy", subDetail: "Fun\nobstacles", bgcolor: "#FF5722", icon: SVG.tower },
    ],
  },
  {
    title: "Medium Games",
    detail:"Fun challenges for developing skills",
    bgcolor: "#b3a3ee",
    icon: SVG.gameControllerColorful,
    data: [
      { id: "4", name: "Jailreak", detail: "Escape prison or\nbeacome a cop!", level: "Medium", subDetail: "Action-\npacked", bgcolor: "#2196F3", icon:SVG.policeCar },
      { id: "5", name: "Murder Mystery", detail: "Find the murderer\nbefore its too late", level: "Medium", subDetail: "Strategy\ngameplay", bgcolor: "#ba09f0", icon:SVG.knife},
      { id: "6", name: "Arsenel", detail: "Fast-paced\nFPS action", level: "Medium", subDetail: "Competitive\nshooter", bgcolor: "#FF5722", icon: SVG.dart },
    ],
  },
  {
    title: "Hard Games",
    detail:"Ultmate challenges for experts",
    bgcolor: "#bd1f13",
    icon: SVG.fire,
    data: [
      { id: "7", name: "Fantom for...", detail: "Tactical shooter with\nrealistic machenics", level: "Hard", subDetail: "Advaced\ntectics", bgcolor: "#2a3a52", icon: SVG.croessSwords },
      { id: "8", name: "Flee the facili...", detail: "Survive the beast\nand escape", level: "Hard", subDetail: "Intense\NSurvival", bgcolor: "#7add5c", icon: SVG.manRunnung },
      { id: "9", name: "Royale High", detail: "Live your fantasy\nlife in style", level: "Hard", subDetail: "Complex\nMachenics", bgcolor: "#f436ab", icon: SVG.crown },
    ],
  },
];



export const AVATAR_STYLES = [
  {
    id: 1,
    title: 'Robux Avatar',
    subtitle: 'Default Style',
    icon: SVG.userAvatarWhite,
    activeIcon: SVG.userAvatarBlack,
  },
  {
    id: 2,
    title: 'Anime',
    subtitle: 'Japanese Style',
    icon: SVG.starsWhite,
    activeIcon: SVG.starsBlack,
  },
  {
    id: 3,
    title: 'Cartoon',
    subtitle: 'Fun and Playful',
    icon: SVG.smileWhite,
    activeIcon: SVG.smileBlack,
  },
  {
    id: 4,
    title: 'Realistic',
    subtitle: 'Lifelike Potraits',
    icon: SVG.cameraWhite,
    activeIcon: SVG.cameraBlack,
  },
  {
    id: 5,
    title: 'Cyberpunk',
    subtitle: 'Futuristic Tech',
    icon: SVG.lighteningWhite,
    activeIcon: SVG.lighteningblack,
  },
  {
    id: 6,
    title: 'Fantasy',
    subtitle: 'Magical Worlds',
    icon: SVG.magicWhite,
    activeIcon: SVG.magicBlack,
  },
];
