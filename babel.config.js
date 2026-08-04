module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module:react-native-dotenv',
      {
        moduleName: '@env',
        envName: 'ENVFILE',
        path: '.env',
        blacklist: null,
        whitelist: null,
        safe: false,
        allowUndefined: true,
        blocklist: null,
        allowlist: null,
        verbose: false,
      },
    ],
    'react-native-reanimated/plugin',
  ],
};
