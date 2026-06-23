// /* eslint-disable curly */
// /* eslint-disable no-unused-vars */
// /* eslint-disable quotes */
// import {Platform} from 'react-native';
// import {CommonActions, useNavigation} from '@react-navigation/native';
// // import ImagePicker, {cleanSingle} from 'react-native-image-crop-picker';
// import messaging, { requestPermission } from '@react-native-firebase/messaging';
// import auth from '@react-native-firebase/auth';
// import {SCREEN} from '../enums';


export const hexToRgba = (hex, opacity = 1) => {
  const cleanHex = hex.replace('#', '');

  const bigint = parseInt(cleanHex, 16);

  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;

  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

// export const emptyFunction = () => {};

// export const sendNotification = async (navigation) => {
//   const currentUser = auth().currentUser;
//   const username= extractCleanUsername(currentUser.email);
//   console.log('Current User Email:', username);
//   const token = await messaging().getToken();
//   try {
//     const response = await fetch(
//       'https://us-central1-shattrah-20d3d.cloudfunctions.net/sendCustomNotification',
//       {
//         method: 'POST',
//         headers: {'Content-Type': 'application/json'},
//         body: JSON.stringify({
//           fcmToken: token,
//           title: `${username}`,
//           body: `You have a new notification 😊`,
//         }),
//       },
//     );
//     const text = await response.text();
//     let data;
//     try {
//       data = JSON.parse(text);
//     } catch (err) {
//       console.warn('Response is not JSON, raw text:', text);
//       return;
//     }
//     console.log('Notification response:', data);
//     navigation.navigate(SCREEN.BOTTOM);
//   } catch (error) {
//     console.error('Notification send error:', error);
//   }
// };
// //==================Notification by UID========================
// export const sendNotificationByUid = async (navigation,otherUser) => {
//   const currentUser = auth().currentUser;
//   const currentUsername= extractCleanUsername(currentUser.email);
//   const userId = otherUser.uid; 
//   const username= extractCleanUsername(otherUser.email);
//   console.log('Current User ID:', userId);

// const LastMsg = await getLastMessageForChat(currentUser.uid, userId)
// console.log('Last message in chat:', LastMsg);

//   try {
//     const response = await fetch(
//       'https://sendnotificationbyuid-ibtt546vwa-uc.a.run.app',
//       {
//         method: 'POST',
//         headers: {'Content-Type': 'application/json'},
//         body: JSON.stringify({
//           uid: userId,
//           title: `${currentUsername}`,
//           body: LastMsg,
//         }),
//       },
//     );
//     const text = await response.text();
//     let data;
//     try {
//       data = JSON.parse(text);
//     } catch (err) {
//       console.warn('Response is not JSON, raw text:', text);
//       return;
//     }
//     console.log('Notification response:', data);
//   } catch (error) {
//     console.error('Notification send error:', error);
//   }
// };

// export const isIOS = () => {
//   return Platform.OS === 'ios';
// };

// // export const openCamera = () => {
// //   return new Promise((resolve, reject) => {
// //     ImagePicker.openCamera({
// //       height: 600,
// //       width: 400,
// //       mediaType: 'photo',
// //     })
// //       .then(async image => resolve(image))
// //       .catch(err => reject(err));
// //   });
// // };

// // export const openGallery = (options = {}) => {
// //   return new Promise((resolve, reject) => {
// //     ImagePicker.openPicker({
// //       height: 600,
// //       width: 400,
// //       mediaType: 'photo',
// //       ...options,
// //     })
// //       .then(image => resolve(image))
// //       .catch(err => reject(err));
// //   });
// // };

// export const handleResetStack = (navigation, screenName, params) => {
//   navigation.dispatch(
//     CommonActions.reset({
//       index: 0,
//       routes: [{name: screenName, params: params && params}],
//     }),
//   );
// };

// //==================notification sending request========================

// export const requestNotificationPermission = async () => {
//   const authStatus = await messaging().requestPermission();

//   const enabled =
//     authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
//     authStatus === messaging.AuthorizationStatus.PROVISIONAL;

//   if (enabled) {
//     const token = await messaging().getToken();
//     return token;
//   } else {
//     return null;
//   }
// };

// //=============Token update in firestore when user login or signup================
// import firestore from '@react-native-firebase/firestore';
// import { getLastMessageForChat } from '../services';

// export const updateFcmTokenIfNeeded = async () => {
//   const user = auth().currentUser;
//   if (!user) return;

//   try {
//     const token = await messaging().getToken();
//     await firestore().collection('users').doc(user.uid).update({
//       FcmToken: token,
//     });
//     console.log('FCM token updated:', token);
//   } catch (err) {
//     console.warn('FCM token update failed:', err);
//   }
// };
// //=================Extract username from email=======================
// export const extractCleanUsername = email => {
//   if (!email || typeof email !== 'string') return '';

//   // 1️⃣ Lowercase + trim
//   let username = email.trim().toLowerCase();

//   // 2️⃣ Remove domain
//   username = username.split('@')[0];

//   // 3️⃣ Remove numbers
//   username = username.replace(/[0-9]/g, '');

//   // 4️⃣ Remove special characters except letters
//   username = username.replace(/[^a-zA-Z]/g, '');

//   if (!username) return '';

//   // 5️⃣ Capitalize first letter
//   return username.charAt(0).toUpperCase() + username.slice(1);
// };