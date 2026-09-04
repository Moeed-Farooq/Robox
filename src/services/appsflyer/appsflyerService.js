import appsFlyer from 'react-native-appsflyer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { FIREBASE_COLLECTIONS } from '../../enums';

const APPSFLYER_DEV_KEY = Platform.select({
  ios: 'FYUh8WXCVi3tScJFpcuGRL',
  android: 'doHi6jTJG32pcaP3KL6iyA',
  default: 'doHi6jTJG32pcaP3KL6iyA',
});

const APPLE_APP_ID = 'RobuxFruits.perkmedia.app';
const LAST_MILESTONE_KEY = '@robux-fruits/appsflyer/last_coin_milestone';
const LEGACY_MILESTONES_KEY = '@robux-fruits/appsflyer/completed_milestones';
const MILESTONE_STEP = 500;
const MAX_MILESTONE = 1_000_000;

let isInitialized = false;
let milestoneLock = false;
let lastCompletedMilestoneCache = null;

const getUserRef = uid =>
  firestore().collection(FIREBASE_COLLECTIONS.USERS_COLLECTION).doc(uid);

const logAppsFlyerEvent = (eventName, eventValues = {}) => {
  try {
    appsFlyer.logEvent(
      eventName,
      eventValues,
      res => {
        if (__DEV__) {
          console.log(`[AppsFlyer] Logged event '${eventName}':`, res);
        }
      },
      err => {
        console.warn(`[AppsFlyer] Event '${eventName}' failed:`, err);
      },
    );
  } catch (error) {
    console.warn(`[AppsFlyer] Exception logging '${eventName}':`, error?.message || error);
  }
};

const normalizeMilestone = value => {
  const numericValue = Number(value);
  if (!Number.isFinite(numericValue) || numericValue < MILESTONE_STEP) {
    return 0;
  }

  const steppedValue =
    Math.floor(Math.min(numericValue, MAX_MILESTONE) / MILESTONE_STEP) * MILESTONE_STEP;

  return Math.max(MILESTONE_STEP, steppedValue);
};

const readLegacyMaxMilestone = value => {
  if (Array.isArray(value)) {
    return value.reduce((max, item) => {
      const parsed = Number(item);
      return Number.isFinite(parsed) ? Math.max(max, parsed) : max;
    }, 0);
  }

  if (value && typeof value === 'object') {
    return Object.keys(value).reduce((max, key) => {
      const parsed = Number(key);
      return Number.isFinite(parsed) && value[key] ? Math.max(max, parsed) : max;
    }, 0);
  }

  return 0;
};

const loadLastCompletedMilestone = async () => {
  if (lastCompletedMilestoneCache !== null) {
    return lastCompletedMilestoneCache;
  }

  let lastCompleted = 0;

  try {
    const rawLocal = await AsyncStorage.getItem(LAST_MILESTONE_KEY);
    if (rawLocal !== null) {
      lastCompleted = normalizeMilestone(rawLocal);
    } else {
      const legacyLocal = await AsyncStorage.getItem(LEGACY_MILESTONES_KEY);
      if (legacyLocal) {
        lastCompleted = normalizeMilestone(
          readLegacyMaxMilestone(JSON.parse(legacyLocal)),
        );
      }
    }
  } catch (err) {
    console.warn('[AppsFlyer] Failed to read local milestones:', err?.message || err);
  }

  try {
    const currentUser = auth().currentUser;
    if (currentUser?.uid) {
      const doc = await getUserRef(currentUser.uid).get();
      const data = doc.data() || {};
      const firestoreLast = normalizeMilestone(data.lastCompletedCoinMilestone);
      const legacyFirestore = readLegacyMaxMilestone(data.completedMilestones);
      lastCompleted = Math.max(lastCompleted, firestoreLast, legacyFirestore);
    }
  } catch (err) {
    console.warn('[AppsFlyer] Failed to read Firestore milestones:', err?.message || err);
  }

  lastCompletedMilestoneCache = lastCompleted;
  return lastCompletedMilestoneCache;
};

const persistLastCompletedMilestone = async milestone => {
  lastCompletedMilestoneCache = milestone;

  try {
    await AsyncStorage.setItem(LAST_MILESTONE_KEY, String(milestone));
  } catch (err) {
    console.warn('[AppsFlyer] Failed to write local milestones:', err?.message || err);
  }

  try {
    const currentUser = auth().currentUser;
    if (currentUser?.uid) {
      await getUserRef(currentUser.uid).set(
        {
          lastCompletedCoinMilestone: milestone,
          updatedAt: firestore.FieldValue.serverTimestamp(),
        },
        { merge: true },
      );
    }
  } catch (err) {
    console.warn('[AppsFlyer] Failed to update Firestore milestones:', err?.message || err);
  }
};

export const initAppsFlyer = () => {
  if (isInitialized) {
    return;
  }

  const options = {
    devKey: APPSFLYER_DEV_KEY,
    isDebug: __DEV__,
    appId: APPLE_APP_ID,
    onInstallConversionDataListener: true,
    onDeepLinkListener: true,
    timeToWaitForATTUserAuthorization: 10,
  };

  appsFlyer.initSdk(
    options,
    result => {
      isInitialized = true;
      if (__DEV__) {
        console.log('[AppsFlyer] Init success:', result);
      }
    },
    error => {
      console.warn('[AppsFlyer] Init error:', error);
    },
  );
};

export const checkAndFireCoinMilestones = async currentTotalPoints => {
  const highestReachable = normalizeMilestone(currentTotalPoints);
  if (highestReachable < MILESTONE_STEP) {
    return;
  }

  if (milestoneLock) {
    return;
  }

  milestoneLock = true;

  try {
    const lastCompleted = await loadLastCompletedMilestone();
    if (highestReachable <= lastCompleted) {
      return;
    }

    for (
      let milestone = lastCompleted + MILESTONE_STEP;
      milestone <= highestReachable;
      milestone += MILESTONE_STEP
    ) {
      logAppsFlyerEvent(`coin_milestone_${milestone}`);
    }

    await persistLastCompletedMilestone(highestReachable);
  } catch (error) {
    console.warn('[AppsFlyer] Milestone check failed:', error?.message || error);
  } finally {
    milestoneLock = false;
  }
};

export const resetAppsFlyerCache = () => {
  lastCompletedMilestoneCache = null;
};
