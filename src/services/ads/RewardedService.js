import {
  AdEventType,
  RewardedAd,
  RewardedAdEventType,
} from 'react-native-google-mobile-ads';
import { getAdUnitId } from './AdConfig';
import {
  areAdsEnabled,
  initializeAdsSettings,
  isAdsConfigLoaded,
} from './AdsSettingsService';

let rewardedAd = null;
let rewardedLoaded = false;
let rewardedLoading = false;
let rewardedListenersAttached = false;

const createRewardedAd = () => RewardedAd.createForAdRequest(getAdUnitId('rewarded'));

const ensureRewardedInstance = () => {
  if (!rewardedAd) {
    rewardedAd = createRewardedAd();
    rewardedListenersAttached = false;
  }

  if (!rewardedListenersAttached) {
    rewardedAd.addAdEventListener(RewardedAdEventType.LOADED, () => {
      rewardedLoaded = true;
      rewardedLoading = false;
    });

    rewardedAd.addAdEventListener(AdEventType.ERROR, error => {
      rewardedLoaded = false;
      rewardedLoading = false;
      console.warn('Rewarded ad load/show error:', error?.message || error);

      setTimeout(() => {
        preloadRewardedAd();
      }, 15000);
    });

    rewardedAd.addAdEventListener(AdEventType.CLOSED, () => {
      rewardedLoaded = false;
      rewardedLoading = false;
      preloadRewardedAd();
    });

    rewardedListenersAttached = true;
  }

  return rewardedAd;
};

export const preloadRewardedAd = () => {
  if (!isAdsConfigLoaded()) {
    initializeAdsSettings().catch(() => {});
    return;
  }

  if (!areAdsEnabled()) {
    return;
  }

  if (rewardedLoaded || rewardedLoading) {
    return;
  }

  const ad = ensureRewardedInstance();

  rewardedLoading = true;
  rewardedLoaded = false;

  try {
    ad.load();
  } catch (error) {
    rewardedLoading = false;
    rewardedLoaded = false;
    console.warn('Rewarded ad preload failed:', error?.message || error);
  }
};

export const isRewardedAdReady = () => rewardedLoaded;

export const REWARDED_AD_UNAVAILABLE_MESSAGE =
  'Ad not available right now. Please try again later.';

export const getRewardedAdUserMessage = reason => {
  switch (reason) {
    case 'ad_not_ready':
    case 'show_failed':
      return REWARDED_AD_UNAVAILABLE_MESSAGE;
    case 'reward_not_earned':
      return 'Watch the full rewarded ad to claim your reward.';
    case 'action_failed':
      return 'Ad completed but reward could not be granted right now. Please try again.';
    default:
      return REWARDED_AD_UNAVAILABLE_MESSAGE;
  }
};

export const showRewardedAdForAction = action => {
  return new Promise(resolve => {
    const completeWithoutAd = async reason => {
      try {
        if (typeof action === 'function') {
          await action();
        }

        resolve({
          completed: true,
          reason,
        });
      } catch (error) {
        console.warn('Reward action execution failed:', error?.message || error);
        resolve({
          completed: false,
          reason: 'action_failed',
        });
      }
    };

    if (!isAdsConfigLoaded()) {
      initializeAdsSettings()
        .then(() => {
          if (!areAdsEnabled()) {
            completeWithoutAd('ads_disabled');
            return;
          }

          resolve({
            completed: false,
            reason: 'ad_not_ready',
          });
        })
        .catch(() => {
          resolve({
            completed: false,
            reason: 'ad_not_ready',
          });
        });
      return;
    }

    if (!areAdsEnabled()) {
      completeWithoutAd('ads_disabled');
      return;
    }

    try {
      const ad = ensureRewardedInstance();

      if (!rewardedLoaded) {
        preloadRewardedAd();
        resolve({
          completed: false,
          reason: 'ad_not_ready',
        });
        return;
      }

      let rewardEarned = false;

      const unsubscribeReward = ad.addAdEventListener(
        RewardedAdEventType.EARNED_REWARD,
        () => {
          rewardEarned = true;
        },
      );

      const unsubscribeClosed = ad.addAdEventListener(AdEventType.CLOSED, async () => {
        unsubscribeReward();
        unsubscribeClosed();

        if (rewardEarned) {
          try {
            if (typeof action === 'function') {
              await action();
            }
            resolve({ completed: true });
          } catch (error) {
            console.warn('Reward action execution failed:', error?.message || error);
            resolve({
              completed: false,
              reason: 'action_failed',
            });
          }
        } else {
          resolve({
            completed: false,
            reason: 'reward_not_earned',
          });
        }
      });

      ad.show();
    } catch (error) {
      console.warn('Rewarded ad display failed:', error?.message || error);
      preloadRewardedAd();
      resolve({
        completed: false,
        reason: 'show_failed',
      });
    }
  });
};
