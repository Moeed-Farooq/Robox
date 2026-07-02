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
    screen: SCREEN.FREE_DAILY_ROBUX_SCREEN,
  },
  {
    id: 2,
    title1: 'New Free Emotes! Roblox',
    title2: 'Exclusive skins',
    src: IMAGES.FREE_EMOTE,
    reward: 'Elite',
    color: COLORS.pink,
    screen: '',
  },
];

export const RobuxFeaturesData = [
  { id: 1, title: 'Robux Codes', screen: SCREEN.ROBUX_CODES_SCREEN },
  { id: 2, title: 'Robux Skins', screen: SCREEN.ROBUX_CODES_SCREEN },
  { id: 3, title: 'Wordy Robux', screen: SCREEN.WORD_QUIZ_SCREEN },
  { id: 4, title: 'RBX Calculator', screen: SCREEN.RBX_CALCULATOR_SCREEN },
  { id: 5, title: 'Block Puzzle', screen: SCREEN.BLOCK_PUZZLE_SCREEN },
  { id: 6, title: 'Spin Wheel', screen: SCREEN.SPIN_WHEEL_SCREEN },
];

export const GAMES_DATA = [
  {
    title: 'Easy Games',
    detail: 'Perfect for beginners',
    bgcolor: COLORS.splashBg,
    icon: SVG.dart,
    data: [
      {
        id: '1',
        name: 'Blox Fruits',
        detail: 'Puzzle your way\nthrough Blox Fruits!',
        level: 'Easy',
        subDetail: 'Great for\nbeginners',
        bgcolor: '#4CAF50',
        icon: SVG.pirateFlag,
        screen: SCREEN.BLOX_FRUITS_GAME,
      },
      {
        id: '2',
        name: 'Adopt Me',
        detail: 'Raise magical pets\nand build your drea...',
        level: 'Easy',
        subDetail: 'Perfect\nfor families',
        bgcolor: '#e95889',
        icon: SVG.paw,
        screen: SCREEN.BLOX_FRUITS_GAME,
      },
      {
        id: '3',
        name: 'Tower of Hell',
        detail: 'Climb the ultimate\ntower challenge',
        level: 'Easy',
        subDetail: 'Fun\nobstacles',
        bgcolor: '#FF5722',
        icon: SVG.tower,
        screen: SCREEN.BLOX_FRUITS_GAME,
      },
    ],
  },
  {
    title: 'Medium Games',
    detail: 'Fun challenges for developing skills',
    bgcolor: '#b3a3ee',
    icon: SVG.gameControllerColorful,
    data: [
      {
        id: '4',
        name: 'Jailreak',
        detail: 'Escape prison or\nbeacome a cop!',
        level: 'Medium',
        subDetail: 'Action-\npacked',
        bgcolor: '#2196F3',
        screen: SCREEN.JAIL_BREAK_GAME,
        icon: SVG.policeCar,
      },
      {
        id: '5',
        name: 'Murder Mystery',
        detail: 'Find the murderer\nbefore its too late',
        level: 'Medium',
        subDetail: 'Strategy\ngameplay',
        bgcolor: '#ba09f0',
        icon: SVG.knife,
      },
      {
        id: '6',
        name: 'Arsenel',
        detail: 'Fast-paced\nFPS action',
        level: 'Medium',
        subDetail: 'Competitive\nshooter',
        bgcolor: '#FF5722',
        icon: SVG.dart,
      },
    ],
  },
  {
    title: 'Hard Games',
    detail: 'Ultmate challenges for experts',
    bgcolor: '#bd1f13',
    icon: SVG.fire,
    data: [
      {
        id: '7',
        name: 'Fantom for...',
        detail: 'Tactical shooter with\nrealistic machenics',
        level: 'Hard',
        subDetail: 'Advaced\ntectics',
        bgcolor: '#2a3a52',
        icon: SVG.croessSwords,
      },
      {
        id: '8',
        name: 'Flee the facili...',
        detail: 'Survive the beast\nand escape',
        level: 'Hard',
        subDetail: 'IntenseNSurvival',
        bgcolor: '#7add5c',
        icon: SVG.manRunnung,
      },
      {
        id: '9',
        name: 'Royale High',
        detail: 'Live your fantasy\nlife in style',
        level: 'Hard',
        subDetail: 'Complex\nMachenics',
        bgcolor: '#f436ab',
        icon: SVG.crown,
      },
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
        screen: SCREEN.TERMS_AND_CONDITIONS_SCREEN,
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
        screen: SCREEN.PRIVACY_SCREEN,
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
    question: 'What is the official currency used in Roblox?',
    options: ['Robux', 'RoboCoins', 'Tickets', 'BloxBucks'],
    correctAnswer: 'Robux',
  },
  {
    id: 2,
    question: 'Who created Roblox?',
    options: ['David Baszucki', 'Elon Musk', 'Bill Gates', 'Mark Zuckerberg'],
    correctAnswer: 'David Baszucki',
  },
  {
    id: 3,
    question: 'Which programming language is used in Roblox Studio?',
    options: ['Python', 'JavaScript', 'Lua', 'C++'],
    correctAnswer: 'Lua',
  },
  {
    id: 4,
    question: 'What is the name of the software used to make Roblox games?',
    options: [
      'Roblox Creator',
      'Roblox Studio',
      'Roblox Engine',
      'Roblox Build',
    ],
    correctAnswer: 'Roblox Studio',
  },
  {
    id: 5,
    question: 'What is the default name given to any new Roblox user?',
    options: ['Player', 'Robloxian', 'Guest', 'Noob'],
    correctAnswer: 'Player',
  },
  {
    id: 6,
    question:
      'In which popular Roblox game can you adopt pets and build houses?',
    options: ['Blox Fruits', 'Brookhaven', 'Adopt Me!', 'Piggy'],
    correctAnswer: 'Adopt Me!',
  },
  {
    id: 7,
    question: "What does 'Obby' stand for in Roblox?",
    options: [
      'Object Building',
      'Obstacle Course',
      'Obvious Way',
      'Online Battle',
    ],
    correctAnswer: 'Obstacle Course',
  },
  {
    id: 8,
    question: 'What year was Roblox officially released?',
    options: ['2004', '2006', '2010', '2015'],
    correctAnswer: '2006',
  },
  {
    id: 9,
    question:
      'What is the name of the character customization model in Roblox?',
    options: ['Player', 'Avatar', 'Skin', 'Actor'],
    correctAnswer: 'Avatar',
  },
  {
    id: 10,
    question:
      'Which Roblox game is focused on living and roleplaying in a big city?',
    options: ['Brookhaven RP', 'Murder Mystery 2', 'BedWars', 'Arsenal'],
    correctAnswer: 'Brookhaven RP',
  },
  {
    id: 11,
    question: 'What icon is famously used as the logo of Roblox?',
    options: [
      'A red square with a hole',
      'A blue circle',
      'A yellow star',
      'A green triangle',
    ],
    correctAnswer: 'A red square with a hole',
  },
  {
    id: 12,
    question: "What color is the standard Roblox 'Noob' character's torso?",
    options: ['Green', 'Blue', 'Yellow', 'Red'],
    correctAnswer: 'Blue',
  },
  {
    id: 13,
    question: 'Can you play Roblox on mobile phones?',
    options: ['Yes, Android & iOS', 'Only iOS', 'Only Android', 'No'],
    correctAnswer: 'Yes, Android & iOS',
  },
  {
    id: 14,
    question:
      'What are items that give you special perks inside a specific Roblox game called?',
    options: ['Gamepasses', 'Robux Premium', 'Badges', 'Admin Tools'],
    correctAnswer: 'Gamepasses',
  },
  {
    id: 15,
    question:
      "What was Roblox's original name during its early development stage?",
    options: ['BlockWorld', 'DynaBlocks', 'BuildCraft', 'LegoSim'],
    correctAnswer: 'DynaBlocks',
  },
];

export const ROBUX_CODES = [
  {
    id: '1',
    provider: 'elite',
    views: '62',
    time: '2 days ago',
    code: 'ELITE-DEAL-2026-X',
  },
  {
    id: '2',
    provider: 'admin',
    views: '39',
    time: '1 hour ago',
    code: 'ADMIN-PROMO-99X',
  },
  {
    id: '3',
    provider: 'premium',
    views: '120',
    time: '5 mins ago',
    code: 'PREMIUM-DISC-50',
  },
  {
    id: '4',
    provider: 'user_zone',
    views: '15',
    time: '3 hours ago',
    code: 'ZONE-FREE-TRIAL',
  },
];

export const PRIVACY_DATA = [
  {
    id: '1',
    number: '1',
    title: 'Information We Collect',
    description: 'We may collect the following information:',
    points: [
      'Personal Information: such as your name, email address, or profile information (only if you choose to provide it or connect through third-party services like Google or Apple).',
      'Usage Data: including your gameplay activity, scores, and in-app interactions.',
      'Device Information: such as device type, operating system, language, and app version.',
      'Advertising and Analytics Data: collected through third-party tools (e.g., Google AdMob, Firebase) for analytics and ad personalization.',
    ],
    footerText: '',
  },
  {
    id: '2',
    number: '2',
    title: 'How We Use Your Information',
    description: 'We use the collected data to:',
    points: [
      'Provide and improve the App experience.',
      'Personalize your gameplay and rewards.',
      'Show relevant ads and measure their performance.',
      'Analyze usage and fix technical issues.',
      'Communicate with you (e.g., updates, customer support).',
    ],
    footerText: '',
  },
  {
    id: '3',
    number: '3',
    title: 'Third-Party Services',
    description:
      'Our App may include integrations with third-party services such as:',
    points: ['Google AdMob (for ads)', 'Firebase Analytics (for analytics)'],
    footerText:
      'These services may collect information in accordance with their own privacy policies.',
  },
  {
    id: '4',
    number: '4',
    title: 'Data Retention',
    description:
      'We keep your information only as long as necessary for the purposes described in this Privacy Policy. You can request deletion of your data by contacting us at bloxiapps224@support.com.',
    points: [], // Iska direct description text hai, points nahi hain
    footerText: '',
  },
  {
    id: '5',
    number: '5',
    title: "Children's Privacy",
    description:
      'Robux Points is intended for users aged 13 and older.\nWe do not knowingly collect personal data from children under 13. If you believe your child has provided personal data, please contact us.',
    points: [],
    footerText: '',
  },
  {
    id: '6',
    number: '6',
    title: 'Data Security',
    description:
      'We implement industry-standard measures to protect your data from unauthorized access, disclosure, or alteration.',
    points: [],
    footerText: '',
  },
  {
    id: '7',
    number: '7',
    title: 'Your Rights',
    description: 'You can:',
    points: [
      'Request access, correction, or deletion of your personal data.',
      'Opt out of analytics or personalized advertising (depending on your device settings).',
    ],
    footerText: '',
  },
  {
    id: '8',
    number: '8',
    title: 'Changes to This Policy',
    description:
      'We may update this Privacy Policy from time to time. The updated version will be posted within the App with the new effective date.',
    points: [],
    footerText: '',
  },
  {
    id: '9',
    number: '9',
    title: 'Contact Us',
    description:
      'If you have any questions about this Privacy Policy, contact us.',
    points: [],
    footerText: '',
  },
];

export const TERMS_DATA = [
  {
    id: '1',
    number: '1',
    title: 'Acceptance of Terms',
    description:
      'By accessing or using the App, you agree to be bound by these Terms. If you do not agree, do not use the App.',
    points: [],
  },
  {
    id: '2',
    number: '2',
    title: 'Use of the App',
    description: '',
    points: [
      'You must be at least 13 years old to use this App.',
      'You agree to use the App only for lawful purposes and in accordance with these Terms.',
      'You may not attempt to hack, reverse-engineer, or misuse the App.',
    ],
  },
  {
    id: '3',
    number: '3',
    title: 'User Accounts',
    description:
      'Some features may require you to create an account. You are responsible for:',
    points: [
      'Keeping your login details secure.',
      'All activities that occur under your account.',
    ],
  },
  {
    id: '4',
    number: '4',
    title: 'Intellectual Property',
    description:
      'All content, trademarks, graphics, and code within the App are owned by Robux Points or its licensors. You may not copy, distribute, or modify any part of the App without written permission.',
    points: [],
  },
  {
    id: '5',
    number: '5',
    title: 'In-App Purchases & Rewards',
    description: '',
    points: [
      'Robux Points may offer in-app purchases, virtual rewards, or points.',
      'These items have no real-world monetary value and cannot be exchanged for cash.',
      'We reserve the right to modify or remove these features at any time.',
    ],
  },
  {
    id: '6',
    number: '6',
    title: 'Termination',
    description:
      'We may suspend or terminate your access to the App at any time if you violate these Terms or for any reason deemed necessary.',
    points: [],
  },
  {
    id: '7',
    number: '7',
    title: 'Disclaimer of Warranties',
    description:
      'The App is provided "as is" and "as available." We make no guarantees regarding uninterrupted service, accuracy, or reliability.',
    points: [],
  },
  {
    id: '8',
    number: '8',
    title: 'Limitation of Liability',
    description:
      'We are not responsible for any damages arising from your use or inability to use the App, including data loss or system errors.',
    points: [],
  },
  {
    id: '9',
    number: '9',
    title: 'Updates and Modifications',
    description:
      'We may update the App or these Terms from time to time. Continued use of the App after such updates constitutes acceptance of the new Terms.',
    points: [],
  },
  {
    id: '10',
    number: '10',
    title: 'Governing Law',
    description:
      'These Terms are governed by the laws of your country of residence, without regard to conflict of law principles.',
    points: [],
  },
  {
    id: '11',
    number: '11',
    title: 'Contact Us',
    description: 'For questions or support, contact us.',
    points: [],
  },
];

export const WORD_QUIZ_DATA = [
  {
    id: '1',
    question: 'What is the name of the main currency used in Roblox?',
    rightAnswer: 'Robux',
  },
  {
    id: '2',
    question:
      'What is the name of the software used to create games on Roblox?',
    rightAnswer: 'Studio',
  },
  {
    id: '3',
    question: 'Which programming language is used for coding in Roblox?',
    rightAnswer: 'Lua',
  },
  {
    id: '4',
    question: "What is the common nickname for Roblox's iconic default avatar?",
    rightAnswer: 'Noob',
  },
  {
    id: '5',
    question:
      'What is the online username of Roblox co-founder David Baszucki?',
    rightAnswer: 'Builderman',
  },
  {
    id: '6',
    question:
      'What is the name of the popular Roblox game focused on adopting pets?',
    rightAnswer: 'AdoptMe',
  },
  {
    id: '7',
    question:
      'What do you call your virtual character or representation in Roblox?',
    rightAnswer: 'Avatar',
  },
  {
    id: '8',
    question: "What is the name of Roblox's monthly paid subscription service?",
    rightAnswer: 'Premium',
  },
  {
    id: '9',
    question:
      'Which popular Roblox horror/escape game features an antagonistic pig?',
    rightAnswer: 'Piggy',
  },
  {
    id: '10',
    question:
      'What action stops a specific user from contacting or bothering you?',
    rightAnswer: 'Block',
  },
  {
    id: '11',
    question:
      'What is the main store called where you buy official avatar clothes and items?',
    rightAnswer: 'Catalog',
  },
  {
    id: '12',
    question:
      'What term is used for completely new players who lack customization?',
    rightAnswer: 'Noob',
  },
  {
    id: '13',
    question:
      'What button do you click in Roblox Studio to test your creation?',
    rightAnswer: 'Play',
  },
  {
    id: '14',
    question:
      'What feature allows players to type messages to their friends in real-time?',
    rightAnswer: 'Chat',
  },
  {
    id: '15',
    question: 'Where do you send a complaint if someone breaks Roblox rules?',
    rightAnswer: 'Support',
  },
  {
    id: '16',
    question: 'What was the name of the old, removed Roblox currency?',
    rightAnswer: 'Tix',
  },
  {
    id: '17',
    question:
      'What is the name of the annual awards ceremony for Roblox developers?',
    rightAnswer: 'Bloxys',
  },
  {
    id: '18',
    question:
      'What is the general term used for individual worlds or maps in Roblox?',
    rightAnswer: 'Games',
  },
  {
    id: '19',
    question: 'What is the short term used for obstacle courses in Roblox?',
    rightAnswer: 'Obby',
  },
  {
    id: '20',
    question:
      'Games where you live a virtual life and build cities fall under which genre?',
    rightAnswer: 'Roleplay',
  },
  {
    id: '21',
    question:
      'What do you use in Roblox Studio to move, scale, or rotate objects?',
    rightAnswer: 'Tools',
  },
  {
    id: '22',
    question:
      'What is the term for virtual items you can buy to use across various games?',
    rightAnswer: 'Gear',
  },
  {
    id: '23',
    question:
      'What system allows developers to exchange their earned Robux for real money?',
    rightAnswer: 'DevEx',
  },
  {
    id: '24',
    question:
      'What US state is the official headquarters of Roblox located in?',
    rightAnswer: 'California',
  },
  {
    id: '25',
    question:
      'What status is given to a player who has full administrative control over a game server?',
    rightAnswer: 'Admin',
  },
  {
    id: '26',
    question:
      'What type of program do exploiters use to illegally modify Roblox gameplay?',
    rightAnswer: 'Script',
  },
  {
    id: '27',
    question:
      'What do you call a person who builds models and environments in Roblox?',
    rightAnswer: 'Builder',
  },
  {
    id: '28',
    question:
      'What tag is applied to text in Roblox chat when it gets censored by filters?',
    rightAnswer: 'Hashtags',
  },
  {
    id: '29',
    question:
      'Under which main genre category do fighting and sword games usually fall?',
    rightAnswer: 'Action',
  },
  {
    id: '30',
    question:
      'What is the name of the original platform name before it was renamed to Roblox?',
    rightAnswer: 'DynaBlocks',
  },
];

export const CONVERSION_TYPES = [
  {
    id: 1,
    title: 'Robux',
    subtitle: 'To Dollar',
    icon: 'R',
    symbol: '$',
    calculate: value => value / 100,
  },
  {
    id: 2,
    title: 'Dollar',
    subtitle: 'To Robux',
    icon: '$',
    symbol: 'R',
    calculate: value => value * 100,
  },
  {
    id: 3,
    title: 'Robux',
    subtitle: 'To Euro',
    icon: 'R',
    symbol: '€',
    calculate: value => value / 100,
  },
  {
    id: 4,
    title: 'Robux',
    subtitle: 'To BC',
    icon: 'R',
    symbol: 'BC',
    calculate: value => value / 300,
  },
  {
    id: 5,
    title: 'Robux',
    subtitle: 'To TBC',
    icon: 'R',
    symbol: 'TBC',
    calculate: value => value / 500,
  },
  {
    id: 6,
    title: 'Robux',
    subtitle: 'To OBC',
    icon: 'R',
    symbol: 'OBC',
    calculate: value => value / 2500,
  },
];

export const BLOCK_SHAPES = [
  [[1]],
  [[1, 1]],
  [[1], [1]],
  [
    [1, 1],
    [1, 1],
  ],
  [[1, 1, 1]],
  [[1], [1], [1]],
  [
    [1, 0],
    [1, 1],
  ],
  [
    [0, 1],
    [1, 1],
  ],
  [
    [1, 1],
    [1, 0],
  ],
  [
    [1, 1],
    [0, 1],
  ],
  [
    [1, 1, 1],
    [0, 1, 0],
  ],
  [
    [0, 1, 0],
    [1, 1, 1],
  ],
];

export const SHAPE_COLORS = [
  '#c9b8bc',
  '#FFBB00',
  '#dbedff',
  '#43bdf5',
  '#ff9557',
];

export const SPIN_REWARDS = [
  {
    id: 1,
    title: 'Jackpot',
    icon: SVG.jackpotWheel,
    color: '#E74C3C',
    reward: 2500,
    rewardType: 'Robux',
    rarity: 'Rare',
  },
  {
    id: 2,
    title: '500',
    icon: SVG.dollarWheel,
    color: COLORS.accent,
    reward: 1000,
    rewardType: 'Robux',
    rarity: 'Common',
  },
  {
    id: 3,
    title: '1000',
    icon: SVG.diamondWheel,
    color: '#D48A3A',
    reward: 500,
    rewardType: 'Robux',
    rarity: 'Common',
  },
  {
    id: 4,
    title: '750',
    icon: SVG.rupeeWheel,
    color: '#4CAF50',
    reward: 25000,
    rewardType: 'Robux',
    rarity: 'Rare',
  },
  {
    id: 5,
    title: '1500',
    icon: SVG.shineWheel,
    color: '#F39C12',
    reward: 15000,
    rewardType: 'Robux',
    rarity: 'Epic',
  },
  {
    id: 6,
    title: 'Mega\nBonus',
    icon: SVG.megaWheel,
    color: '#1E88E5',
    reward: 1500,
    rewardType: 'Robux',
    rarity: 'Common',
  },
  {
    id: 7,
    title: 'Free\nSpin',
    icon: SVG.freeSpinWheel,
    color: '#D4C000',
    reward: 50000,
    rewardType: 'Robux',
    rarity: 'Legendary',
  },
  {
    id: 8,
    title: '2500',
    icon: SVG.starWheel,
    color: '#B23BD4',
    reward: 750,
    rewardType: 'Robux',
    rarity: 'Common',
  },
];

export const FRUITS_DATA = [
  { id: 1, name: 'Apple', icon: SVG.apple },
  { id: 2, name: 'Banana', icon: SVG.banana },
  { id: 3, name: 'Orange', icon: SVG.orange },
  { id: 4, name: 'Grapes', icon: SVG.grapes },
  { id: 5, name: 'Watermelon', icon: SVG.watermelon },
  { id: 6, name: 'Strawberry', icon: SVG.strawberry },
  { id: 7, name: 'Pineapple', icon: SVG.pineapple },
  { id: 8, name: 'Mango', icon: SVG.mango },
];
