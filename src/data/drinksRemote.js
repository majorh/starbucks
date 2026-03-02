/**
 * Remote drinks data loader
 *
 * Fetches drink data from a JSON file hosted in your GitHub repository.
 * Update drinks without a deployment by editing drinks.json on GitHub.
 *
 * Setup:
 *  1. Push this project to a GitHub repo
 *  2. Replace the URL below with your own raw GitHub URL
 *  3. Deploy the app once — all future drink updates require no deployment
 *
 * Your URL format:
 *  https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_REPO/main/drinks.json
 *
 * Caching strategy:
 *  1. Fresh remote fetch (if online and cache > 1 hour old)
 *  2. Cached version from last successful fetch
 *  3. Bundled drinks.js as final offline fallback
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { CATEGORIES as BUNDLED_CATEGORIES } from './drinks';

// ─── SET THIS AFTER CREATING YOUR GITHUB REPO ──────────────────────────────
const DRINKS_URL = 'https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_REPO/main/drinks.json';
// ───────────────────────────────────────────────────────────────────────────

const CACHE_KEY = '@zsb_drinks_cache';
const CACHE_TIMESTAMP_KEY = '@zsb_drinks_cache_ts';
const CACHE_TTL_MS = 1000 * 60 * 60; // 1 hour

export async function loadDrinks() {
  // Not yet configured — use bundled data
  if (DRINKS_URL.includes('YOUR_USERNAME')) {
    console.log('[drinks] Remote URL not configured — using bundled data');
    return BUNDLED_CATEGORIES;
  }

  // Check if cache is still fresh
  try {
    const ts = await AsyncStorage.getItem(CACHE_TIMESTAMP_KEY);
    const age = Date.now() - parseInt(ts || '0', 10);
    if (ts && age < CACHE_TTL_MS) {
      const cached = await AsyncStorage.getItem(CACHE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (isValid(parsed)) {
          console.log('[drinks] Using fresh cache');
          return parsed;
        }
      }
    }
  } catch (e) {
    console.warn('[drinks] Cache read error', e);
  }

  // Fetch from GitHub
  try {
    const res = await fetch(DRINKS_URL, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!isValid(data)) throw new Error('Invalid data shape');

    await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(data));
    await AsyncStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString());
    console.log('[drinks] Fetched fresh data from GitHub');
    return data;
  } catch (e) {
    console.warn('[drinks] Remote fetch failed:', e.message);
  }

  // Fall back to stale cache
  try {
    const cached = await AsyncStorage.getItem(CACHE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (isValid(parsed)) {
        console.log('[drinks] Using stale cache');
        return parsed;
      }
    }
  } catch (e) {
    console.warn('[drinks] Stale cache read error', e);
  }

  // Final fallback — bundled data
  console.log('[drinks] Using bundled fallback data');
  return BUNDLED_CATEGORIES;
}

function isValid(data) {
  return (
    Array.isArray(data) &&
    data.length > 0 &&
    data[0].id &&
    Array.isArray(data[0].drinks)
  );
}
