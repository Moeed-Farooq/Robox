import { FRUITS_DATA } from '../dummies';
import { Alert, Platform, PermissionsAndroid } from 'react-native';
import { CameraRoll } from '@react-native-camera-roll/camera-roll';
import ReactNativeBlobUtil from 'react-native-blob-util';


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
    onError('Permission Denied', 'Storage write access is required to save assets.');
    return;
  }

  try {
    const { fs } = ReactNativeBlobUtil;
    const { CacheDir } = fs.dirs;

    const date = new Date();
    const filePath = `${CacheDir}/item_${Math.floor(date.getTime() + date.getSeconds())}.png`;

    const response = await fetch(imageUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36',
        Accept: 'image/png,image/jpeg,image/*',
      },
    });

    if (!response.ok) {
      throw new Error(`Server network rejected with status: ${response.status}`);
    }

    const blob = await response.blob();
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = async () => {
      try {
        const base64Data = reader.result.split(',')[1];
        await fs.writeFile(filePath, base64Data, 'base64');

        await CameraRoll.save(filePath, { type: 'photo' });
        
        // Trigger Dynamic Success Modal Callback
        onSuccess('Downloaded Successfuly', 'The skin has been saved to your gallery!');

        fs.unlink(filePath).catch(err => console.log('Clean up err:', err));
      } catch (saveError) {
        onError('Compilation Error', 'Failed to compile raw asset streams onto local memory.');
        console.log('Conversion/Save Error:', saveError);
      }
    };
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