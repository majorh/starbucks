/**
 * locationService.js
 *
 * Handles geofencing for Starbucks locations and push notifications.
 *
 * Flow:
 *  1. User grants location permission on onboarding slide 4.
 *  2. We register a background geofence task.
 *  3. When the user enters any registered Starbucks region, the task fires
 *     a local notification showing their favourite zero-sugar drink.
 *
 * Starbucks geofences are stored as a simple list of {lat, lng, radius} objects.
 * In production you'd load these from your remote drinks.json or a separate
 * locations.json file. For now we seed a handful of well-known locations so
 * the feature works immediately after install.
 */

import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const GEOFENCE_TASK = 'STARBUCKS_GEOFENCE_TASK';
const NOTIF_COOLDOWN_KEY = 'last_geofence_notif';
const NOTIF_COOLDOWN_MS  = 60 * 60 * 1000; // 1 hour between notifications

// ─── Configure how notifications appear when the app is in foreground ─────────
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge:  false,
  }),
});

// ─── Background task definition ───────────────────────────────────────────────
// Must be defined at module scope (top level), not inside a component.
TaskManager.defineTask(GEOFENCE_TASK, async ({ data: { eventType, region }, error }) => {
  if (error) {
    console.warn('[Geofence] Task error:', error);
    return;
  }

  if (eventType === Location.GeofencingEventType.Enter) {
    // Cooldown: don't spam notifications
    const lastStr = await AsyncStorage.getItem(NOTIF_COOLDOWN_KEY);
    const last    = lastStr ? parseInt(lastStr, 10) : 0;
    const now     = Date.now();

    if (now - last < NOTIF_COOLDOWN_MS) return;
    await AsyncStorage.setItem(NOTIF_COOLDOWN_KEY, String(now));

    // Load the user's favourite drink (first favourite, or generic message)
    let drinkName = null;
    try {
      const raw = await AsyncStorage.getItem('favorites');
      if (raw) {
        const favSet = JSON.parse(raw);
        const ids    = Object.keys(favSet).filter((k) => favSet[k]);
        if (ids.length > 0) {
          // Try to match against a known drinks list cached locally
          const drinksRaw = await AsyncStorage.getItem('cached_drinks_flat');
          if (drinksRaw) {
            const drinks = JSON.parse(drinksRaw);
            const match  = drinks.find((d) => d.id === ids[0]);
            if (match) drinkName = match.name;
          }
        }
      }
    } catch (_) {}

    const body = drinkName
      ? `Your go-to: ${drinkName}. Remember — no classic syrup! ☕`
      : 'Open the app for your zero-sugar order. Remember — no classic syrup! ☕';

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "You're at Starbucks! ☕",
        body,
        data: { type: 'geofence' },
      },
      trigger: null, // fire immediately
    });
  }
});

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Request foreground + background location permission.
 * Returns true if granted.
 */
export async function requestLocationPermission() {
  const { status: fg } = await Location.requestForegroundPermissionsAsync();
  if (fg !== 'granted') return false;

  const { status: bg } = await Location.requestBackgroundPermissionsAsync();
  return bg === 'granted';
}

/**
 * Check current permission status without prompting.
 */
export async function getLocationPermissionStatus() {
  const fg = await Location.getForegroundPermissionsAsync();
  const bg = await Location.getBackgroundPermissionsAsync();
  return {
    foreground: fg.status,
    background: bg.status,
    granted: fg.status === 'granted' && bg.status === 'granted',
  };
}

/**
 * Request notification permission.
 * Returns true if granted.
 */
export async function requestNotificationPermission() {
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

/**
 * Register geofences for a list of Starbucks locations.
 * Each region: { identifier: string, latitude, longitude, radius (metres) }
 *
 * Call this after permission is granted. Safe to call multiple times —
 * it stops any existing task first.
 */
export async function startGeofencing(regions) {
  try {
    const isRunning = await Location.hasStartedGeofencingAsync(GEOFENCE_TASK);
    if (isRunning) {
      await Location.stopGeofencingAsync(GEOFENCE_TASK);
    }
    await Location.startGeofencingAsync(GEOFENCE_TASK, regions);
  } catch (e) {
    console.warn('[Geofence] Failed to start:', e);
  }
}

/**
 * Stop all geofencing.
 */
export async function stopGeofencing() {
  try {
    const isRunning = await Location.hasStartedGeofencingAsync(GEOFENCE_TASK);
    if (isRunning) await Location.stopGeofencingAsync(GEOFENCE_TASK);
  } catch (_) {}
}

/**
 * A starter set of Starbucks geofence regions.
 * Replace / extend this with a remote fetch from your locations.json in production.
 * radius is in metres — 100m is tight enough to be "inside the store".
 */
export const DEFAULT_STARBUCKS_REGIONS = [
  // These are examples — swap for real lat/lng near your users
  { identifier: 'sbux_demo_1', latitude: 37.7749,  longitude: -122.4194, radius: 100 }, // SF
  { identifier: 'sbux_demo_2', latitude: 40.7128,  longitude: -74.0060,  radius: 100 }, // NYC
  { identifier: 'sbux_demo_3', latitude: 47.6062,  longitude: -122.3321, radius: 100 }, // Seattle
  { identifier: 'sbux_demo_4', latitude: 34.0522,  longitude: -118.2437, radius: 100 }, // LA
  { identifier: 'sbux_demo_5', latitude: 25.7617,  longitude: -80.1918,  radius: 100 }, // Miami
  { identifier: 'sbux_demo_6', latitude: 41.8781,  longitude: -87.6298,  radius: 100 }, // Chicago
  { identifier: 'sbux_demo_7', latitude: 29.7604,  longitude: -95.3698,  radius: 100 }, // Houston
  { identifier: 'sbux_demo_8', latitude: 33.4484,  longitude: -112.0740, radius: 100 }, // Phoenix
];

/**
 * Full setup: request permissions, then start geofencing.
 * Returns { locationGranted, notifGranted }.
 */
export async function setupLocationFeature() {
  const locationGranted = await requestLocationPermission();
  const notifGranted    = await requestNotificationPermission();

  if (locationGranted) {
    await startGeofencing(DEFAULT_STARBUCKS_REGIONS);
  }

  return { locationGranted, notifGranted };
}

/**
 * Send a manual "seasonal" notification — call this from your
 * remote drinks.json update flow if you add a field like `notify: true`.
 */
export async function sendSeasonalNotification({ title, body }) {
  await Notifications.scheduleNotificationAsync({
    content: { title, body, data: { type: 'seasonal' } },
    trigger: null,
  });
}
