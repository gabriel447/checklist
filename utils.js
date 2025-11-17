import * as FileSystem from 'expo-file-system';

export const onlyDigits = (s) => String(s || '').replace(/\D+/g, '');

export const formatPhoneBR = (s) => {
  const d = onlyDigits(s);
  if (d.length <= 2) return d;
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7, 11)}`;
};

export const formatCpfBR = (s) => {
  const d = onlyDigits(s);
  const p1 = d.slice(0, 3);
  const p2 = d.slice(3, 6);
  const p3 = d.slice(6, 9);
  const p4 = d.slice(9, 11);
  let out = p1;
  if (p2) out += '.' + p2;
  if (p3) out += '.' + p3;
  if (p4) out += '-' + p4;
  return out;
};

export const isStrongPassword = (s) => {
  if (!s || s.length < 12) return false;
  if (!/[a-z]/.test(s)) return false;
  if (!/[A-Z]/.test(s)) return false;
  if (!/[0-9]/.test(s)) return false;
  if (!/[^A-Za-z0-9]/.test(s)) return false;
  return true;
};

export const isValidEmail = (s) => {
  if (!s) return false;
  const e = s.trim();
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e);
};

export const toTitleCase = (s) => {
  if (!s) return '';
  return String(s)
    .split(/\s+/)
    .map((w) => (w ? w.charAt(0).toUpperCase() + w.slice(1) : ''))
    .join(' ');
};

export const sanitizeNameInput = (s) => String(s || '').replace(/[^A-Za-zÀ-ÿ\s'\-]/g, '');

export const parseMapsLink = (s) => {
  const t = String(s || '').trim();
  if (!t) return null;
  let m = t.match(/@(-?\d+\.\d+),\s*(-?\d+\.\d+)/);
  if (m) return { lat: Number(m[1]), lng: Number(m[2]) };
  m = t.match(/[?&]q=(-?\d+\.?\d*),\s*(-?\d+\.?\d*)/);
  if (m) return { lat: Number(m[1]), lng: Number(m[2]) };
  const nums = t.match(/-?\d+\.\d+/g) || [];
  const cand = nums.map(Number).filter((n) => !Number.isNaN(n));
  for (let i = 0; i < cand.length - 1; i++) {
    const a = cand[i], b = cand[i + 1];
    if (a >= -90 && a <= 90 && b >= -180 && b <= 180) return { lat: a, lng: b };
  }
  return null;
};

export const isMapsUrl = (s) => {
  const t = String(s || '').trim();
  if (!t) return false;
  if (!/^https?:\/\//i.test(t)) return false;
  return /^(https?:\/\/)(maps\.app\.goo\.gl|goo\.gl\/maps|maps\.google\.com|www\.google\.com\/maps)/i.test(t);
};

export const buildMapsLink = (lat, lng) => `https://www.google.com/maps?q=${Number(lat).toFixed(6)},${Number(lng).toFixed(6)}`;

export const extractUrlFromText = (s) => {
  let t = String(s || '').trim();
  t = t.replace(/^[\'"`\s]+|[\'"`\s]+$/g, '');
  if (!/^https?:\/\//i.test(t)) {
    const m = t.match(/https?:\/\/\S+/i);
    if (m) {
      t = m[0];
    }
  }
  t = t.replace(/[)\]\}>]+$/g, '');
  return t.trim();
};

export const isValidUrl = (s) => {
  try {
    const u = new URL((s || '').trim());
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
};

export const normalizeTextToUrl = (s) => {
  const direct = extractUrlFromText(s);
  if (direct) return direct;
  const t = String(s || '').trim();
  const m = t.match(/(maps\.app\.goo\.gl|goo\.gl\/maps|maps\.google\.com|www\.google\.com\/maps)[^\s'"`]+/i);
  if (m) {
    const tail = m[0];
    return `https://${tail}`;
  }
  return '';
};

export const extractOrAcceptMapsLink = (s) => {
  const raw = normalizeTextToUrl(s);
  const p = parseMapsLink(s);
  if (p && Number.isFinite(p.lat) && Number.isFinite(p.lng)) {
    return buildMapsLink(p.lat, p.lng);
  }
  if (isMapsUrl(raw)) {
    return raw;
  }
  if (isValidUrl(raw)) {
    return raw;
  }
  return null;
};

export const isUuid = (s) => {
  const v = (s || '').trim();
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(v);
};

export const getMimeFromUri = (uri) => {
  if (!uri) return 'image/jpeg';
  const lower = String(uri).toLowerCase();
  if (lower.endsWith('.png')) return 'image/png';
  if (lower.endsWith('.jpg') || lower.endsWith('.jpeg')) return 'image/jpeg';
  return 'image/jpeg';
};

export const toBase64 = async (uri) => {
  if (!uri) return null;
  try {
    const b64 = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
    const mime = getMimeFromUri(uri);
    return `data:${mime};base64,${b64}`;
  } catch {
    return null;
  }
};

export const dataOrRead = async (dataUri, uri) => {
  if (dataUri) return dataUri;
  if (uri && /^https?:\/\//.test(uri)) return uri;
  return await toBase64(uri);
};