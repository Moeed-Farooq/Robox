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
    screen:SCREEN.FREE_DAILY_ROBUX_SCREEN
  },
  {
    id: 2,
    title1: 'New Free Emotes! Roblox',
    title2: 'Exclusive skins',
    src: IMAGES.FREE_EMOTE,
    reward: 'Elite',
    color: COLORS.pink,
    screen:""
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


export const SETTINGS_SECTIONS = [
  {
    title: 'Preferences',
    type: 'toggle',
    data: [
      {
        id: '1',
        title: 'Notifications',
        subtitle: 'Receive\ngame alerts',
        icon: SVG.bell,
        value: true,
      },
      {
        id: '2',
        title: 'Dark Mode',
        subtitle: 'Use dark theme',
        icon: SVG.moon,
        value: true,
      },
      {
        id: '3',
        title: 'Sound Effects',
        subtitle: 'Play game\nsounds',
        icon: SVG.speaker,
        value: true,
      },
      {
        id: '4',
        title: 'Haptics Feedback',
        subtitle: 'Device\nvibrations',
        icon: SVG.mobileVibration,
        value: true,
      },
    ],
  },
  {
    title: 'About',
    type: 'navigation',
    data: [
      {
        id: '5',
        title: 'Rate App',
        subtitle: 'Rate us on the app store',
        icon: SVG.starRating,
      },
      {
        id: '6',
        title: 'Share app',
        subtitle: 'Share with friends',
        icon: SVG.share,
      },
      {
        id: '7',
        title: 'Terms And Conditions',
        subtitle: 'Read our terms',
        icon: SVG.paper,
      },
      {
        id: '8',
        title: 'Help And Support',
        subtitle: 'Get help with the app',
        icon: SVG.help,
      },
      {
        id: '9',
        title: 'Privacy',
        subtitle: 'Manage your privacy',
        icon: SVG.lock,
      },
      {
        id: '10',
        title: 'App Version',
        subtitle: 'Version 1.4.0',
        icon: SVG.about,
      },
    ],
  },
];

export const QUIZ_DATA = [
  {
    id: 1,
    question: "What is the official currency used in Roblox?",
    options: ["Robux", "RoboCoins", "Tickets", "BloxBucks"],
    correctAnswer: "Robux",
  },
  {
    id: 2,
    question: "Who created Roblox?",
    options: [
      "David Baszucki",
      "Elon Musk",
      "Bill Gates",
      "Mark Zuckerberg",
    ],
    correctAnswer: "David Baszucki",
  },
  {
    id: 3,
    question: "Which programming language is used in Roblox Studio?",
    options: ["Python", "JavaScript", "Lua", "C++"],
    correctAnswer: "Lua",
  },
  {
    id: 4,
    question: "What is the name of the software used to make Roblox games?",
    options: ["Roblox Creator", "Roblox Studio", "Roblox Engine", "Roblox Build"],
    correctAnswer: "Roblox Studio",
  },
  {
    id: 5,
    question: "What is the default name given to any new Roblox user?",
    options: ["Player", "Robloxian", "Guest", "Noob"],
    correctAnswer: "Player",
  },
  {
    id: 6,
    question: "In which popular Roblox game can you adopt pets and build houses?",
    options: ["Blox Fruits", "Brookhaven", "Adopt Me!", "Piggy"],
    correctAnswer: "Adopt Me!",
  },
  {
    id: 7,
    question: "What does 'Obby' stand for in Roblox?",
    options: ["Object Building", "Obstacle Course", "Obvious Way", "Online Battle"],
    correctAnswer: "Obstacle Course",
  },
  {
    id: 8,
    question: "What year was Roblox officially released?",
    options: ["2004", "2006", "2010", "2015"],
    correctAnswer: "2006",
  },
  {
    id: 9,
    question: "What is the name of the character customization model in Roblox?",
    options: ["Player", "Avatar", "Skin", "Actor"],
    correctAnswer: "Avatar",
  },
  {
    id: 10,
    question: "Which Roblox game is focused on living and roleplaying in a big city?",
    options: ["Brookhaven RP", "Murder Mystery 2", "BedWars", "Arsenal"],
    correctAnswer: "Brookhaven RP",
  },
  {
    id: 11,
    question: "What icon is famously used as the logo of Roblox?",
    options: ["A red square with a hole", "A blue circle", "A yellow star", "A green triangle"],
    correctAnswer: "A red square with a hole",
  },
  {
    id: 12,
    question: "What color is the standard Roblox 'Noob' character's torso?",
    options: ["Green", "Blue", "Yellow", "Red"],
    correctAnswer: "Blue",
  },
  {
    id: 13,
    question: "Can you play Roblox on mobile phones?",
    options: ["Yes, Android & iOS", "Only iOS", "Only Android", "No"],
    correctAnswer: "Yes, Android & iOS",
  },
  {
    id: 14,
    question: "What are items that give you special perks inside a specific Roblox game called?",
    options: ["Gamepasses", "Robux Premium", "Badges", "Admin Tools"],
    correctAnswer: "Gamepasses",
  },
  {
    id: 15,
    question: "What was Roblox's original name during its early development stage?",
    options: ["BlockWorld", "DynaBlocks", "BuildCraft", "LegoSim"],
    correctAnswer: "DynaBlocks",
  },
];