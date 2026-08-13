import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeEventEmitter, NativeModules } from 'react-native';
import { PerkoxSDK } from '@perkoxofficial/react-native-sdk';
import { addPointsToUserTotal } from '../firebaseServices';
import { getPerkoxPlayerId } from './perkoxApi';
import { PERKOX_CONFIG } from './PerkoxConfig';

const PROCESSED_TXIDS_KEY = '@robox/perkox/processed_txids';
const { RoboxPerkoxModule } = NativeModules;

let initPromise = null;
let rewardSubscription = null;
let closeSubscription = null;
let externalRewardListeners = new Set();

const toFiniteNumber = value => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'string') {
    const cleaned = value.replace(/,/g, '').trim();
    const parsed = Number(cleaned);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
};

const readProcessedTxids = async () => {
  try {
    const raw = await AsyncStorage.getItem(PROCESSED_TXIDS_KEY);
    if (!raw) {
      return new Set();
    }

    const parsed = JSON.parse(raw);
    return new Set(Array.isArray(parsed) ? parsed.map(String) : []);
  } catch (error) {
    console.warn('[Perkox] Failed to read processed txids:', error?.message || error);
    return new Set();
  }
};

const markTxidProcessed = async txid => {
  if (!txid) {
    return;
  }

  try {
    const existing = await readProcessedTxids();
    existing.add(String(txid));
    const trimmed = Array.from(existing).slice(-500);
    await AsyncStorage.setItem(PROCESSED_TXIDS_KEY, JSON.stringify(trimmed));
  } catch (error) {
    console.warn('[Perkox] Failed to persist processed txid:', error?.message || error);
  }
};

const creditReward = async reward => {
  const amount = toFiniteNumber(reward?.amount) ?? 0;
  const txid = reward?.txid ? String(reward.txid) : '';

  if (amount <= 0) {
    return { granted: 0, skipped: true, reason: 'invalid_amount' };
  }

  if (txid) {
    const processed = await readProcessedTxids();
    if (processed.has(txid)) {
      return { granted: 0, skipped: true, reason: 'duplicate_txid', txid };
    }
  }

  const pointsToGrant = Math.max(0, Math.round(amount));
  await addPointsToUserTotal(pointsToGrant);

  if (txid) {
    await markTxidProcessed(txid);
  }

  return { granted: pointsToGrant, skipped: false, txid, reward };
};

const handleNativeReward = async reward => {
  try {
    const result = await creditReward(reward);

    externalRewardListeners.forEach(listener => {
      try {
        listener(reward, result);
      } catch (error) {
        console.warn('[Perkox] Reward listener error:', error?.message || error);
      }
    });

    if (__DEV__) {
      console.log('[Perkox] Reward handled:', result);
    }

    return result;
  } catch (error) {
    console.warn('[Perkox] Failed to credit reward:', error?.message || error);
    return { granted: 0, skipped: true, reason: 'credit_failed', error };
  }
};

const ensureEventListeners = () => {
  if (rewardSubscription) {
    return;
  }

  // Prefer store-aware host module events; fall back to official SDK listeners.
  if (RoboxPerkoxModule) {
    const emitter = new NativeEventEmitter(RoboxPerkoxModule);
    rewardSubscription = emitter.addListener('onPerkoxReward', handleNativeReward);
    closeSubscription = emitter.addListener('onPerkoxClose', () => {
      if (__DEV__) {
        console.log('[Perkox] Offerwall closed');
      }
    });
    return;
  }

  const unsubscribeReward = PerkoxSDK.onReward(handleNativeReward);
  const unsubscribeClose = PerkoxSDK.onClose(() => {
    if (__DEV__) {
      console.log('[Perkox] Offerwall closed');
    }
  });

  rewardSubscription = { remove: unsubscribeReward };
  closeSubscription = { remove: unsubscribeClose };
};

/**
 * Initializes the Perkox SDK with Firebase uid as playerId.
 */
export const initPerkoxSdk = async () => {
  if (initPromise) {
    return initPromise;
  }

  initPromise = (async () => {
    if (!PERKOX_CONFIG.APP_ID || !PERKOX_CONFIG.SDK_ID) {
      throw new Error('Perkox APP_ID and SDK_ID are required.');
    }

    const playerId = getPerkoxPlayerId();

    await PerkoxSDK.init({
      appId: PERKOX_CONFIG.APP_ID,
      sdkKey: PERKOX_CONFIG.SDK_ID,
      playerId,
      beta: Boolean(PERKOX_CONFIG.BETA),
    });

    ensureEventListeners();
    return true;
  })();

  try {
    return await initPromise;
  } catch (error) {
    initPromise = null;
    throw error;
  }
};

/**
 * Shows the offerwall. Uses the store-aware host module when available so
 * Play Store / App Store redirects open in the store apps.
 */
export const showPerkoxOfferwall = async () => {
  await initPerkoxSdk();

  const playerId = getPerkoxPlayerId();
  await PerkoxSDK.setUserId(playerId);

  const options = {
    appId: PERKOX_CONFIG.APP_ID,
    sdkKey: PERKOX_CONFIG.SDK_ID,
    playerId,
    beta: Boolean(PERKOX_CONFIG.BETA),
  };

  if (typeof RoboxPerkoxModule?.showOfferwall === 'function') {
    const success = await RoboxPerkoxModule.showOfferwall(options);
    return Boolean(success);
  }

  const success = await PerkoxSDK.showOfferwall(options);
  return Boolean(success);
};

/**
 * Subscribe to reward credit results (after Firebase points are updated).
 * Listener signature: (reward, creditResult) => void
 */
export const onPerkoxRewardCredited = callback => {
  ensureEventListeners();
  externalRewardListeners.add(callback);

  return () => {
    externalRewardListeners.delete(callback);
  };
};

export const isPerkoxSdkReady = () => Boolean(initPromise);
