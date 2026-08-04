import { FRUITS_DATA } from '../dummies';
import { Alert, Platform, PermissionsAndroid ,Share, Linking } from 'react-native';
import {
  CameraRoll,
  iosRequestAddOnlyGalleryPermission,
} from '@react-native-camera-roll/camera-roll';
import ReactNativeBlobUtil from 'react-native-blob-util';
import { APP_STORE, SUPPORT } from '../enums';


export const hexToRgba = (hex, opacity = 1) => {
  const cleanHex = hex.replace('#', '');

  const bigint = parseInt(cleanHex, 16);

  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;

  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

const ALPHABETS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

export const TOTAL_TIME = 120;
export const TOTAL_LETTERS = 20;

export const shuffleArray = array => {
  return [...array].sort(() => Math.random() - 0.5);
};

export const generateLetters = answer => {
  const answerLetters = answer.toUpperCase().split('');

  const randomLetters = [];

  while (randomLetters.length < TOTAL_LETTERS - answerLetters.length) {
    randomLetters.push(ALPHABETS[Math.floor(Math.random() * ALPHABETS.length)]);
  }

  return shuffleArray([...answerLetters, ...randomLetters]).map(
    (letter, index) => ({
      id: index.toString(),
      letter,
      selected: false,
    }),
  );
};

export const formatTime = seconds => {
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;

  return `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
};

export const generateGameCards = () => {
  const pairs = [...FRUITS_DATA, ...FRUITS_DATA];
  return pairs
    .map((fruit, index) => ({
      ...fruit,
      uniqueId: `${fruit.id}-${index}-${Math.random()}`, // Unique key for rendering
      isFlipped: false,
      isMatched: false,
    }))
    .sort(() => Math.random() - 0.5);
};

export const checkPermission = async () => {
  if (Platform.OS === 'android' && Platform.Version < 33) {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      {
        title: 'Storage Permission Required',
        message: 'App needs access to your storage to download images',
      },
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  }

  if (Platform.OS === 'ios') {
    try {
      const status = await iosRequestAddOnlyGalleryPermission();
      return status === 'granted' || status === 'limited';
    } catch (error) {
      console.warn('Failed to request Photos permission:', error?.message || error);
      return false;
    }
  }

  return true;
};

// Centralized Download Function
export const handleImageDownload = async (imageUrl, onSuccess, onError) => {
  if (!imageUrl || typeof imageUrl !== 'string' || !imageUrl.startsWith('http')) {
    onError('Invalid Link', 'The download link is corrupted or broken.');
    return;
  }

  const hasPermission = await checkPermission();
  if (!hasPermission) {
    onError(
      'Permission Denied',
      Platform.OS === 'ios'
        ? 'Photos access is required to save skins and emotes. Enable it in Settings.'
        : 'Storage write access is required to save assets.',
    );
    return;
  }

  try {
    const { fs } = ReactNativeBlobUtil;
    const { CacheDir } = fs.dirs;

    const date = new Date();
    const filePath = `${CacheDir}/item_${Math.floor(date.getTime() + date.getSeconds())}.png`;
    const saveUri = filePath.startsWith('file://') ? filePath : `file://${filePath}`;

    const response = await fetch(imageUrl, {
      headers: {
        'User-Agent':
          Platform.OS === 'ios'
            ? 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15'
            : 'Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36',
        Accept: 'image/png,image/jpeg,image/*',
      },
    });

    if (!response.ok) {
      throw new Error(`Server network rejected with status: ${response.status}`);
    }

    const blob = await response.blob();
    const reader = new FileReader();

    reader.onerror = () => {
      onError('Download Failed', 'Could not read the downloaded image.');
    };

    reader.onloadend = async () => {
      try {
        if (!reader.result || typeof reader.result !== 'string') {
          onError('Download Failed', 'Could not process the downloaded image.');
          return;
        }

        const base64Data = reader.result.split(',')[1];
        if (!base64Data) {
          onError('Download Failed', 'The downloaded image data was empty.');
          return;
        }

        await fs.writeFile(filePath, base64Data, 'base64');
        await CameraRoll.save(saveUri, { type: 'photo' });

        onSuccess('Downloaded Successfuly', 'Saved to your Photos gallery!');

        fs.unlink(filePath).catch(err => console.log('Clean up err:', err));
      } catch (saveError) {
        onError('Save Failed', 'Could not save this item to your Photos gallery.');
        console.log('Conversion/Save Error:', saveError);
      }
    };

    reader.readAsDataURL(blob);
  } catch (err) {
    onError('Network Error', 'The live server layer interrupted the connection stream.');
    console.log('Standard Fetch Core Error: ', err);
  }
};


export const getAvatarStyleName = (stylesList, selectedId) => {
  const currentStyle = stylesList.find(style => style.id === selectedId);
  return currentStyle ? currentStyle.title : 'Default Style';
};

export const generateUniqueId = () => Date.now().toString();


export const shareAvatar = async (promptText, styleName) => {
  try {
    const message = `Check out my AI avatar: "${promptText}" - Style: ${styleName || 'Robux Avatar'} - Created with Robox App! 🎮✨`;
    
    await Share.share({
      message: message,
    });
  } catch (error) {
    console.log('Sharing error: ', error.message);
  }
};

export const isIOS = () => Platform.OS === 'ios';

const openExternalUrl = async urls => {
  for (const url of urls) {
    try {
      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url);
        return true;
      }
    } catch (error) {
      console.warn('Failed to open URL:', url, error?.message || error);
    }
  }

  return false;
};

const resolveIosAppStoreId = async () => {
  if (APP_STORE.IOS_APP_STORE_ID) {
    return APP_STORE.IOS_APP_STORE_ID;
  }

  try {
    const response = await fetch(
      `https://itunes.apple.com/lookup?bundleId=${APP_STORE.IOS_BUNDLE_ID}`,
    );
    const data = await response.json();
    return data?.results?.[0]?.trackId || null;
  } catch (error) {
    console.warn('Failed to resolve App Store ID:', error?.message || error);
    return null;
  }
};

export const openAppStore = async () => {
  try {
    if (Platform.OS === 'android') {
      const packageName = APP_STORE.ANDROID_PACKAGE_NAME;
      const opened = await openExternalUrl([
        `market://details?id=${packageName}`,
        `https://play.google.com/store/apps/details?id=${packageName}`,
      ]);

      if (!opened) {
        Alert.alert('Unable to open store', 'Could not open the Play Store.');
      }

      return;
    }

    if (Platform.OS === 'ios') {
      const appStoreId = await resolveIosAppStoreId();

      if (!appStoreId) {
        Alert.alert(
          'Unable to open store',
          'This app is not on the App Store yet (TestFlight-only builds cannot open a public listing). Add IOS_APP_STORE_ID in AppEnums once the app has an Apple ID in App Store Connect.',
        );
        return;
      }

      const opened = await openExternalUrl([
        `itms-apps://apps.apple.com/app/id${appStoreId}?action=write-review`,
        `https://apps.apple.com/app/id${appStoreId}?action=write-review`,
        `itms-apps://apps.apple.com/app/id${appStoreId}`,
        `https://apps.apple.com/app/id${appStoreId}`,
      ]);

      if (!opened) {
        Alert.alert('Unable to open store', 'Could not open the App Store.');
      }
    }
  } catch (error) {
    Alert.alert(
      'Unable to open store',
      'Something went wrong. Please try again later.',
    );
    console.warn('Failed to open app store:', error?.message || error);
  }
};

export const getAppStoreShareUrl = async () => {
  if (Platform.OS === 'android') {
    return `https://play.google.com/store/apps/details?id=${APP_STORE.ANDROID_PACKAGE_NAME}`;
  }

  if (Platform.OS === 'ios') {
    const appStoreId = await resolveIosAppStoreId();

    return appStoreId ? `https://apps.apple.com/app/id${appStoreId}` : null;
  }

  return `https://play.google.com/store/apps/details?id=${APP_STORE.ANDROID_PACKAGE_NAME}`;
};

export const requestNativeAppReview = async () => {
  try {
    const InAppReview = require('react-native-in-app-review').default;

    if (!InAppReview?.isAvailable?.()) {
      return false;
    }

    await InAppReview.RequestInAppReview();
    return true;
  } catch (error) {
    console.warn('Native in-app review unavailable:', error?.message || error);
    return false;
  }
};

/**
 * Explicit "Rate App" actions should open the store page.
 * Apple's in-app review API often shows on Simulator but is suppressed on
 * TestFlight / real devices (quota + no guarantee the UI appears).
 * Returning success from RequestInAppReview does NOT mean a dialog was shown.
 */
export const rateApp = async () => {
  await openAppStore();
};

export const shareApp = async () => {
  try {
    const storeUrl = await getAppStoreShareUrl();
    // Keep the link only in `message`. Passing `url` as well on iOS
    // duplicates the store link in the shared text.
    const message = storeUrl
      ? `Invite 2 friends and help us grow! Download Robux Game Puzzles here: ${storeUrl}`
      : 'Invite 2 friends and help us grow! Search for Robux Game Puzzles on the App Store or Play Store.';

    await Share.share({ message });
  } catch (error) {
    console.warn('Failed to share app:', error?.message || error);
  }
};

export const openSupportEmail = async () => {
  const email = SUPPORT.EMAIL;
  const subject = encodeURIComponent('Robux Game Puzzles Support');
  const mailtoUrl = `mailto:${email}?subject=${subject}`;

  try {
    await Linking.openURL(mailtoUrl);
  } catch (error) {
    Alert.alert('Unable to open email', `Please contact us at ${email}`);
    console.warn('Failed to open support email:', error?.message || error);
  }
};