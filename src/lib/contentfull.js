const contentfulSpaceId = import.meta.env.VITE_CONTENTFUL_SPACE_ID;
const contentfulAccessToken = import.meta.env.VITE_CONTENTFUL_ACCESS_TOKEN;
const contentfulEnvironment = import.meta.env.VITE_CONTENTFUL_ENVIRONMENT || 'master';
const normalizeImageUrl = (url) => {
  if (!url) return '';
  return url.startsWith('//') ? `https:${url}` : url;
};

const isRichTextNode = (value) =>
  value && typeof value === 'object' && ('content' in value || 'value' in value);

const extractTextFromRichText = (value) => {
  if (!value) return '';

  if (typeof value === 'string') return value;

  if (Array.isArray(value)) {
    return value.map((item) => extractTextFromRichText(item)).join(' ');
  }

  if (isRichTextNode(value)) {
    const text = value.value ? String(value.value) : '';
    const nested = value.content ? extractTextFromRichText(value.content) : '';
    return `${text} ${nested}`.trim();
  }

  if (typeof value === 'object') {
    return Object.values(value)
      .map((entry) => extractTextFromRichText(entry))
      .filter(Boolean)
      .join(' ');
  }

  return '';
};

const pickFirstValue = (obj, keys) => {
  for (const key of keys) {
    if (obj?.[key] !== undefined && obj?.[key] !== null) return obj[key];
  }

  const normalizedKeys = keys.map((key) => key.toLowerCase());
  const matchingKey = Object.keys(obj || {}).find((key) =>
    normalizedKeys.includes(key.toLowerCase())
  );

  if (matchingKey) return obj[matchingKey];

  return undefined;
};

const resolveImageUrl = (fields, assetsById, imageKeys) => {
  const imageField = pickFirstValue(fields, imageKeys || [
    'BlogImg',
    'featuredImage',
    'heroImage',
    'image',
    'thumbnail',
    'mainImage',
    'coverImage',
  ]);

  const resolveAssetUrl = (value, visited = new Set()) => {
    if (!value || visited.has(value)) return '';
    if (typeof value === 'string') return normalizeImageUrl(value);
    if (typeof value !== 'object') return '';

    visited.add(value);

    const linkedAsset = value.sys?.id ? assetsById.get(value.sys.id) : undefined;
    if (linkedAsset) {
      const linkedUrl = resolveAssetUrl(linkedAsset, visited);
      if (linkedUrl) return linkedUrl;
    }

    const fileUrl = value.fields?.file?.url || value.file?.url;
    if (fileUrl) return normalizeImageUrl(fileUrl);

    return resolveAssetUrl(value.fields?.image, visited);
  };

  return resolveAssetUrl(imageField);
};

const normalizeText = (value, fallback = '') => {
  if (typeof value === 'string') return value.trim() || fallback;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  return fallback;
};

const normalizeReadingTime = (value) => {
  const readingTime = Number(value);
  return Number.isFinite(readingTime) && readingTime >= 0 ? readingTime : null;
};

const normalizeCategory = (value) => {
  if (Array.isArray(value)) return normalizeCategory(value[0]);

  if (!value) return 'News';

  if (typeof value === 'string') return value.trim() || 'News';

  if (typeof value === 'object') {
    return normalizeCategory(value.name || value.title || value.fields?.name || value.fields?.title);
  }

  return 'News';
};

const buildEntry = (item, assetsById) => {
  const fields = item?.fields ?? {};
  const title = pickFirstValue(fields, ['title', 'headline', 'name', 'seoTitle']) || 'Untitled news';
  const summary =
    pickFirstValue(fields, ['summary', 'excerpt', 'description', 'shortDescription']) ||
    extractTextFromRichText(fields.body).slice(0, 180) ||
    extractTextFromRichText(fields.content).slice(0, 180) ||
    'Read the latest update.';
  const category = normalizeCategory(pickFirstValue(fields, ['category', 'type', 'section', 'newsType']));
  const publishedAt =
    fields.publishedDate || fields.date || fields.publishDate || item?.sys?.createdAt || new Date().toISOString();

  const body =
    pickFirstValue(fields, ['body', 'content']) ||
    summary ||
    'Read the latest update.';

  return {
    id: item?.sys?.id ?? `${title}-${publishedAt}`,
    title: String(title),
    category: String(category),
    summary: String(summary).trim(),
    body: body,
    publishedAt,
    imageUrl: resolveImageUrl(fields, assetsById),
    authorName: normalizeText(pickFirstValue(fields, ['authorName']), 'Editorial team'),
    authorImageUrl: resolveImageUrl(fields, assetsById, ['authorImage']),
    readingTime: normalizeReadingTime(pickFirstValue(fields, ['readingTime'])),
    url: pickFirstValue(fields, ['slug', 'url', 'path']) || '#',
  };
};

export async function fetchNewsEntries() {
  if (!contentfulSpaceId || !contentfulAccessToken) {
    throw new Error('Missing Contentful configuration. Add VITE_CONTENTFUL_SPACE_ID and VITE_CONTENTFUL_ACCESS_TOKEN to .env.local.');
  }

  const response = await fetch(
    `https://cdn.contentful.com/spaces/${contentfulSpaceId}/environments/${contentfulEnvironment}/entries?access_token=${contentfulAccessToken}&include=2`
  );

  if (!response.ok) {
    throw new Error('Unable to fetch content from Contentful.');
  }

  const data = await response.json();
  const items = Array.isArray(data.items) ? data.items : [];
  const assetsById = new Map(
    (data.includes?.Asset || []).map((asset) => [asset?.sys?.id, asset])
  );
  console.log(data.items);
  return items
    .filter((item) => item?.fields)
    .map((item) => buildEntry(item, assetsById))
    .filter((entry) => entry.title)
    .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
}
