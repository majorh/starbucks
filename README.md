# Starbucks Zero Sugar

A React Native (Expo SDK 54) app for browsing zero-sugar Starbucks drinks with ordering instructions, favorites, and deep linking into the Starbucks app.

---

## Getting Started

```bash
npm install
npx expo start --clear
```

Scan the QR code with **Expo Go** on your iPhone.

---

## Updating Drinks (No Deployment Required)

Drink data is fetched from `drinks.json` in this repository at app launch.
To add, edit, or remove drinks:

1. Edit `drinks.json` directly on GitHub (click the file → pencil icon)
2. Click **Commit changes**
3. Users receive the update the next time they open the app

### One-Time Setup

After pushing this repo to GitHub, open `src/data/drinksRemote.js` and set:

```js
const DRINKS_URL = 'https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_REPO/main/drinks.json';
```

Replace `YOUR_USERNAME` and `YOUR_REPO` with your actual GitHub username and
repository name. The URL never changes, so this only needs to be done once.

Then do one final EAS build:

```bash
eas build --platform ios
```

All future drink updates are just GitHub edits — no build or App Store
submission needed.

---

## drinks.json Format

```json
[
  {
    "id": "hc",
    "name": "Hot Coffees",
    "icon": "☕",
    "drinks": [
      {
        "id": "hc1",
        "name": "Pike Place / Drip Coffee",
        "emoji": "☕",
        "desc": "Short description shown on the list row.",
        "tags": ["z", "h"],
        "sugarLabel": "0g sugar",
        "sugarLevel": "zero",
        "order": "Verbal ordering instructions.",
        "app": "How to order in the Starbucks app.",
        "note": "Optional warning in an amber box. null if none.",
        "milkNote": "Optional milk recommendation. null if none."
      }
    ]
  }
]
```

### Tags

| Tag | Meaning       |
|-----|---------------|
| `z` | Zero/low sugar |
| `h` | Hot drink      |
| `c` | Cold drink     |
| `m` | Modified order |
| `f` | Caffeine-free  |

### sugarLevel

| Value  | Badge color |
|--------|-------------|
| `zero` | Green       |
| `low`  | Amber       |

---

## Caching Behavior

| Situation                        | What the app shows         |
|----------------------------------|----------------------------|
| Online, cache < 1 hour old       | Cached data (instant load) |
| Online, cache > 1 hour old       | Fresh data from GitHub     |
| Offline, cache exists            | Last successful fetch      |
| Offline, no cache ever           | Bundled drinks.js          |

---

## Building for the App Store

```bash
npm install -g eas-cli
eas login
eas build:configure
eas build --platform ios
```

Update `ios.bundleIdentifier` in `app.json` to your own reverse-domain
identifier before submitting.

---

## Project Structure

```
├── drinks.json                       ← Edit this to update drinks remotely
├── App.js                            ← Root navigation
├── app.json                          ← Expo config (SDK 54)
├── package.json
└── src/
    ├── context/
    │   ├── DrinksContext.js          ← Loads & provides remote drink data
    │   └── FavoritesContext.js       ← Favorites with AsyncStorage
    ├── data/
    │   ├── drinks.js                 ← Bundled offline fallback
    │   ├── drinksRemote.js           ← Fetch + cache logic (set URL here)
    │   └── theme.js                  ← Colors
    ├── components/
    │   ├── AppLogo.js
    │   ├── DrinkRow.js
    │   ├── ScreenHeader.js
    │   ├── SugarPill.js
    │   └── Tag.js
    └── screens/
        ├── HomeScreen.js
        ├── CoffeeScreen.js
        ├── TeaScreen.js
        ├── FavoritesScreen.js
        ├── SearchScreen.js
        ├── DetailScreen.js
        └── AboutScreen.js
```

---

## Copyright

Copyright 2026 Major Highfield. All rights reserved.

This app is not affiliated with or endorsed by Starbucks Corporation.
Starbucks is a registered trademark of Starbucks Corporation.
