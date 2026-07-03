const ROBLOX_CATALOG_BASE_URL = 'https://catalog.roblox.com/v1';
const ROBLOX_THUMBNAILS_BASE_URL = 'https://thumbnails.roblox.com/v1';

const DEFAULT_LIMIT = 30;
const DEFAULT_RETRY_ATTEMPTS = 2;
const DEFAULT_RETRY_DELAY_MS = 500;
const RETRYABLE_STATUS_CODES = new Set([408, 429, 500, 502, 503, 504]);
const EMOTES_CATEGORY = 12;
const DEFAULT_EMOTES_LIMIT = 30;

const TAB_SEARCH_QUERY = {
  all: null,
  aesthetic: 'aesthetic',
  kawaii: 'kawaii',
  emo: 'emo',
  y2k: 'y2k',
  street: 'street',
  sporty: 'sport',
  royal: 'royal',
  ninja: 'ninja',
  casual: 'casual',
  formal: 'formal',
  halloween: 'halloween',
  xmas: 'christmas',
};

const EMOTES_TAB_SEARCH_QUERY = {
  all: null,
  aesthetic: 'aesthetic',
  kawaii: 'kawaii',
  emo: 'emo',
  y2k: 'y2k',
  gothic: 'gothic',
  anime: 'anime',
  cute: 'cute',
  dark: 'dark',
  pastel: 'pastel',
  vintage: 'vintage',
  modern: 'modern',
  retro: 'retro',
  fiber: 'fiber',
  fantasy: 'fantasy',
};

const buildQueryString = (params) => {
  return Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== null && value !== '')
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
    .join('&');
};

const sleep = (durationMs) =>
  new Promise(resolve => {
    setTimeout(resolve, durationMs);
  });

const fetchJson = async (
  url,
  {
    signal,
    retries = DEFAULT_RETRY_ATTEMPTS,
    retryDelayMs = DEFAULT_RETRY_DELAY_MS,
  } = {},
) => {
  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      const response = await fetch(url, { signal });

      if (!response.ok) {
        const canRetry =
          RETRYABLE_STATUS_CODES.has(response.status) && attempt < retries;

        if (canRetry) {
          await sleep(retryDelayMs * (attempt + 1));
          continue;
        }

        throw new Error(`Request failed with status ${response.status}`);
      }

      return response.json();
    } catch (error) {
      if (error?.name === 'AbortError') {
        throw error;
      }

      if (attempt < retries) {
        await sleep(retryDelayMs * (attempt + 1));
        continue;
      }

      throw error;
    }
  }

  throw new Error('Request failed after retries.');
};

export const fetchCatalogAccessories = async ({ limit = DEFAULT_LIMIT, cursor, signal } = {}) => {
  const query = buildQueryString({
    Category: 11,
    Subcategory: 19,
    SortType: 3,
    Limit: limit,
    Cursor: cursor,
  });

  const url = `${ROBLOX_CATALOG_BASE_URL}/search/items/details?${query}`;

  return fetchJson(url, { signal });
};

const normalizeTabValue = (tab) => String(tab || 'all').trim().toLowerCase();

export const getRobuxSkinsKeywordForTab = (tab) => {
  const normalizedTab = normalizeTabValue(tab);

  return TAB_SEARCH_QUERY[normalizedTab] ?? null;
};

export const fetchCatalogAccessoriesByTab = async ({
  tab = 'all',
  limit = DEFAULT_LIMIT,
  cursor,
  signal,
} = {}) => {
  const keyword = getRobuxSkinsKeywordForTab(tab);
  const query = buildQueryString({
    Category: 11,
    Subcategory: 19,
    SortType: 3,
    Limit: limit,
    Cursor: cursor,
    Keyword: keyword,
  });

  const url = `${ROBLOX_CATALOG_BASE_URL}/search/items/details?${query}`;

  return fetchJson(url, { signal });
};

export const fetchAssetThumbnails = async (
  assetIds,
  {
    size = '420x420',
    format = 'Png',
    isCircular = false,
    signal,
  } = {},
) => {
  if (!Array.isArray(assetIds) || !assetIds.length) {
    return [];
  }

  const query = buildQueryString({
    assetIds: assetIds.join(','),
    size,
    format,
    isCircular,
  });

  const url = `${ROBLOX_THUMBNAILS_BASE_URL}/assets?${query}`;
  const response = await fetchJson(url, { signal });

  return Array.isArray(response?.data) ? response.data : [];
};

const mapCatalogItemsToSkinCards = (catalogItems, thumbnails) => {
  const imageByAssetId = thumbnails.reduce((acc, thumbnail) => {
    if (thumbnail?.state === 'Completed' && thumbnail?.imageUrl && thumbnail?.targetId) {
      acc[String(thumbnail.targetId)] = thumbnail.imageUrl;
    }

    return acc;
  }, {});

  return catalogItems
    .map((item) => {
      const itemId = String(item?.id || '');
      const image = imageByAssetId[itemId];

      if (!itemId || !image) {
        return null;
      }

      return {
        id: itemId,
        title: item?.name || `Asset ${itemId}`,
        image,
        category: 'all',
        price: '0',
      };
    })
    .filter(Boolean);
};


export const fetchRobuxSkinsPageByTab = async ({
  tab = 'all',
  cursor,
  limit = DEFAULT_LIMIT,
  signal,
} = {}) => {
  const normalizedTab = normalizeTabValue(tab);
  const catalogResponse = await fetchCatalogAccessoriesByTab({
    tab: normalizedTab,
    limit,
    cursor,
    signal,
  });
  const catalogItems = Array.isArray(catalogResponse?.data) ? catalogResponse.data : [];

  if (!catalogItems.length) {
    throw new Error('No Roblox accessory items were returned from catalog API.');
  }

  const assetIds = catalogItems.map(item => item?.id).filter(Boolean);
  const thumbnails = await fetchAssetThumbnails(assetIds, { signal });

  const mappedItems = mapCatalogItemsToSkinCards(catalogItems, thumbnails);

  if (!mappedItems.length) {
    throw new Error('No valid thumbnails were returned for catalog assets.');
  }

  return {
    items: mappedItems.map(item => ({ ...item, category: normalizedTab })),
    nextCursor: catalogResponse?.nextPageCursor || null,
  };
};

export const getRobloxEmotesKeywordForTab = (tab) => {
  const normalizedTab = normalizeTabValue(tab);

  return EMOTES_TAB_SEARCH_QUERY[normalizedTab] ?? null;
};

export const fetchCatalogEmotesByTab = async ({
  tab = 'all',
  limit = DEFAULT_EMOTES_LIMIT,
  cursor,
  signal,
} = {}) => {
  const keyword = getRobloxEmotesKeywordForTab(tab);
  const query = buildQueryString({
    Category: EMOTES_CATEGORY,
    SortType: 3,
    Limit: limit,
    Cursor: cursor,
    Keyword: keyword,
  });

  const url = `${ROBLOX_CATALOG_BASE_URL}/search/items/details?${query}`;

  return fetchJson(url, { signal });
};

const mapCatalogItemsToEmoteCards = (catalogItems, thumbnails, requestedTab) => {
  const imageByAssetId = thumbnails.reduce((acc, thumbnail) => {
    if (thumbnail?.state === 'Completed' && thumbnail?.imageUrl && thumbnail?.targetId) {
      acc[String(thumbnail.targetId)] = thumbnail.imageUrl;
    }

    return acc;
  }, {});

  return catalogItems
    .map((item) => {
      const itemId = String(item?.id || '');
      const image = imageByAssetId[itemId];
      const taxonomyCategory = Array.isArray(item?.taxonomy)
        ? item.taxonomy.find(Boolean)?.taxonomyName
        : null;

      if (!itemId || !image) {
        return null;
      }

      return {
        id: itemId,
        title: item?.name || `Emote ${itemId}`,
        image,
        category: taxonomyCategory || requestedTab,
        price:
          typeof item?.price === 'number'
            ? String(item.price)
            : typeof item?.lowestPrice === 'number'
              ? String(item.lowestPrice)
              : 'N/A',
      };
    })
    .filter(Boolean);
};

export const fetchRobloxEmotesPageByTab = async ({
  tab = 'all',
  cursor,
  limit = DEFAULT_EMOTES_LIMIT,
  signal,
} = {}) => {
  const normalizedTab = normalizeTabValue(tab);
  const catalogResponse = await fetchCatalogEmotesByTab({
    tab: normalizedTab,
    limit,
    cursor,
    signal,
  });
  const catalogItems = Array.isArray(catalogResponse?.data) ? catalogResponse.data : [];

  if (!catalogItems.length) {
    return {
      items: [],
      nextCursor: null,
    };
  }

  const assetIds = catalogItems.map(item => item?.id).filter(Boolean);
  const thumbnails = await fetchAssetThumbnails(assetIds, { signal });
  const mappedItems = mapCatalogItemsToEmoteCards(
    catalogItems,
    thumbnails,
    normalizedTab,
  );

  return {
    items: mappedItems,
    nextCursor: catalogResponse?.nextPageCursor || null,
  };
};

