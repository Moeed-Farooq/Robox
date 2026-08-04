import { Platform } from 'react-native';
import { getCurrentUser } from '../firebaseServices';
import { PERKOX_CONFIG } from './PerkoxConfig';

/** Docs: each offers / hot_offers page returns up to 55 items. */
export const PERKOX_OFFERS_PER_PAGE = 55;

const pickFirst = (source, keys, fallback = '') => {
  for (const key of keys) {
    const value = source?.[key];
    if (value !== undefined && value !== null && String(value).trim() !== '') {
      return value;
    }
  }
  return fallback;
};

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

const normalizeOffer = (offer, section = 'offers') => {
  if (!offer || typeof offer !== 'object') {
    return null;
  }

  const id = pickFirst(offer, ['id', 'offer_id', 'uuid'], `${section}_${Math.random()}`);
  const name = String(
    pickFirst(offer, ['name', 'title', 'offer_name'], 'Offer'),
  );
  const description = String(
    pickFirst(offer, ['description', 'desc', 'short_description'], ''),
  );
  const requirements = String(
    pickFirst(offer, ['requirements', 'requirement', 'instructions'], ''),
  );
  const thumbnail = String(
    pickFirst(offer, ['thumbnail', 'image', 'icon', 'image_url', 'icon_url'], ''),
  );
  const link = String(
    pickFirst(offer, ['link', 'url', 'click_url', 'offer_url', 'tracking_link'], ''),
  );
  const payout = pickFirst(offer, ['payout', 'reward', 'points', 'coins', 'amount'], '0');
  const events = Array.isArray(offer.events) ? offer.events : [];

  return {
    id: String(id),
    name,
    description,
    requirements,
    thumbnail,
    link,
    payout: String(payout),
    events,
    section,
    raw: offer,
  };
};

const normalizePagedOffers = (pageData, section) => {
  const items = Array.isArray(pageData?.data)
    ? pageData.data
    : Array.isArray(pageData)
      ? pageData
      : [];

  const currentPage = Number(pageData?.current_page || pageData?.page || 1) || 1;
  const perPage =
    Number(pageData?.per_page || pageData?.perPage || PERKOX_OFFERS_PER_PAGE) ||
    PERKOX_OFFERS_PER_PAGE;
  const total = Number(pageData?.total ?? items.length) || 0;
  const lastPageFromApi = Number(pageData?.last_page || pageData?.lastPage || 0);
  const lastPage =
    lastPageFromApi > 0
      ? lastPageFromApi
      : Math.max(1, Math.ceil(total / perPage) || 1);

  return {
    data: items.map(item => normalizeOffer(item, section)).filter(Boolean),
    currentPage,
    lastPage,
    perPage,
    total,
  };
};

/**
 * Always returns Firebase anonymous auth uid.
 * Perkox `player_id` must be this value.
 */
export const getPerkoxPlayerId = () => {
  const user = getCurrentUser();

  if (!user?.uid) {
    throw new Error('Firebase anonymous user is required for Perkox player_id.');
  }

  return user.uid;
};

export const getPerkoxWebOfferwallUrl = () => {
  const playerId = getPerkoxPlayerId();
  const params = new URLSearchParams({
    app_id: PERKOX_CONFIG.APP_ID,
    player_id: String(playerId),
  });

  return `${PERKOX_CONFIG.WEB_OFFERWALL_URL}?${params.toString()}`;
};

/**
 * GET /offerwall/api/offers
 * Required: api_key, player_id (Firebase uid)
 * Pagination: offers_page, hot_offers_page (55 items per page)
 */
export const fetchPerkoxOffers = async ({
  offersPage = 1,
  hotOffersPage = 1,
} = {}) => {
  const playerId = getPerkoxPlayerId();

  const safeOffersPage = Math.max(1, Number(offersPage) || 1);
  const safeHotOffersPage = Math.max(1, Number(hotOffersPage) || 1);

  const params = new URLSearchParams({
    api_key: PERKOX_CONFIG.API_KEY,
    player_id: String(playerId),
    offers_page: String(safeOffersPage),
    hot_offers_page: String(safeHotOffersPage),
    user_agent: `Robox/${Platform.OS}`,
  });

  const response = await fetch(
    `${PERKOX_CONFIG.OFFERS_URL}?${params.toString()}`,
    {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    },
  );

  if (!response.ok) {
    throw new Error(`Perkox offers request failed (${response.status})`);
  }

  const payload = await response.json();

  if (!payload?.success) {
    throw new Error(payload?.message || 'Failed to load Perkox offers.');
  }

  const data = payload?.data || {};
  const totalEarned =
    toFiniteNumber(data.total_earned) ??
    toFiniteNumber(data.totalEarned) ??
    toFiniteNumber(data?.offerwall?.total_earned) ??
    toFiniteNumber(data?.player?.total_earned) ??
    0;

  return {
    offerwall: data.offerwall || null,
    totalEarned,
    hotOffers: normalizePagedOffers(data.hot_offers, 'hot'),
    offers: normalizePagedOffers(data.offers, 'offers'),
    playerId,
    requestedOffersPage: safeOffersPage,
    requestedHotOffersPage: safeHotOffersPage,
    rawTotalEarned: data.total_earned,
  };
};

export const mergePerkoxOffers = (existing = [], incoming = []) => {
  const map = new Map();

  [...existing, ...incoming].forEach(item => {
    if (!item?.id) {
      return;
    }
    map.set(`${item.section}-${item.id}`, item);
  });

  return Array.from(map.values());
};
