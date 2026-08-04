import AsyncStorage from '@react-native-async-storage/async-storage';
import { addPointsToUserTotal, getCurrentUser } from '../firebaseServices';
import { fetchPerkoxOffers, getPerkoxPlayerId } from './perkoxApi';

const lastSyncedKey = playerId => `@robox/perkox/last_synced_earned/${playerId}`;

let syncInFlight = null;

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

const readLastSyncedEarned = async playerId => {
  try {
    const value = await AsyncStorage.getItem(lastSyncedKey(playerId));
    if (value === null || value === undefined) {
      return null;
    }

    return toFiniteNumber(value);
  } catch (error) {
    console.warn('Failed to read Perkox sync baseline:', error?.message || error);
    return null;
  }
};

const writeLastSyncedEarned = async (playerId, earned) => {
  try {
    await AsyncStorage.setItem(lastSyncedKey(playerId), String(earned));
  } catch (error) {
    console.warn('Failed to save Perkox sync baseline:', error?.message || error);
    throw error;
  }
};

/**
 * Syncs Perkox `data.total_earned` into Firebase `totalPoints`.
 *
 * How Perkox reports earnings:
 * GET /offerwall/api/offers?api_key=...&player_id=<firebase_uid>
 * → { success: true, data: { total_earned: <number>, hot_offers, offers, ... } }
 *
 * `total_earned` is the player's lifetime virtual-currency balance on Perkox
 * (based on your dashboard Currency Rate). We credit only the positive delta
 * since the last successful sync into the shared app points balance.
 */
export const syncPerkoxEarningsToPoints = async () => {
  if (syncInFlight) {
    return syncInFlight;
  }

  syncInFlight = (async () => {
    const user = getCurrentUser();

    if (!user?.uid) {
      throw new Error('Sign in required before syncing Perkox rewards.');
    }

    const playerId = getPerkoxPlayerId();
    // Page 1 is enough to read total_earned; list pagination is handled by the screen.
    const result = await fetchPerkoxOffers({
      offersPage: 1,
      hotOffersPage: 1,
    });
    const currentEarned = toFiniteNumber(result.totalEarned) ?? 0;
    const lastSynced = await readLastSyncedEarned(playerId);

    if (lastSynced === null) {
      await writeLastSyncedEarned(playerId, currentEarned);
      return {
        granted: 0,
        totalEarned: currentEarned,
        isBaseline: true,
        playerId,
        offersPayload: result,
      };
    }

    const rawDelta = currentEarned - lastSynced;
    const pointsToGrant = rawDelta > 0 ? Math.max(0, Math.round(rawDelta)) : 0;

    if (pointsToGrant > 0) {
      await addPointsToUserTotal(pointsToGrant);
      await writeLastSyncedEarned(playerId, currentEarned);
    } else if (rawDelta < 0) {
      // Keep baseline aligned if Perkox ever adjusts downward.
      await writeLastSyncedEarned(playerId, currentEarned);
    }

    return {
      granted: pointsToGrant,
      totalEarned: currentEarned,
      isBaseline: false,
      playerId,
      offersPayload: result,
    };
  })();

  try {
    return await syncInFlight;
  } finally {
    syncInFlight = null;
  }
};
