import AsyncStorage from '@react-native-async-storage/async-storage';

export const SPIN_COOLDOWN_MS = 48 * 60 * 60 * 1000;
const LAST_SPIN_AT_KEY = '@robox/spin_wheel/last_spin_at';

export const getLastSpinTimestamp = async () => {
  try {
    const value = await AsyncStorage.getItem(LAST_SPIN_AT_KEY);
    const timestamp = Number(value);

    if (!Number.isFinite(timestamp) || timestamp <= 0) {
      return null;
    }

    return timestamp;
  } catch (error) {
    console.warn('Failed to read spin cooldown:', error?.message || error);
    return null;
  }
};

export const markSpinCompleted = async () => {
  try {
    await AsyncStorage.setItem(LAST_SPIN_AT_KEY, String(Date.now()));
  } catch (error) {
    console.warn('Failed to save spin cooldown:', error?.message || error);
  }
};

export const getSpinCooldownStatus = async () => {
  const lastSpinAt = await getLastSpinTimestamp();

  if (!lastSpinAt) {
    return {
      isAvailable: true,
      remainingMs: 0,
      availableAt: null,
    };
  }

  const availableAt = lastSpinAt + SPIN_COOLDOWN_MS;
  const remainingMs = Math.max(0, availableAt - Date.now());

  return {
    isAvailable: remainingMs <= 0,
    remainingMs,
    availableAt,
  };
};

export const formatCooldownRemaining = remainingMs => {
  const totalSeconds = Math.max(0, Math.ceil(remainingMs / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }

  const seconds = totalSeconds % 60;
  return `${minutes}m ${seconds}s`;
};
