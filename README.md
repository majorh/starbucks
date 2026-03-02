# Zero Sugar Starbucks — Expo SDK 54

## Setup

```bash
npm install
npx expo start --clear
```

Scan the QR code with **Expo Go** on your iPhone.

## Project Structure

```
ZeroSugarStarbucks/
├── App.js                            ← Root (SafeAreaProvider + Navigation)
├── app.json                          ← Expo SDK 54 config
├── package.json                      ← SDK 54 pinned dependencies
└── src/
    ├── context/
    │   └── FavoritesContext.js       ← Favorites + AsyncStorage
    ├── data/
    │   ├── drinks.js                 ← All drink data
    │   └── theme.js                  ← Colors
    ├── components/
    │   ├── DrinkRow.js               ← List row with heart button
    │   ├── ScreenHeader.js           ← Header with title + search icon
    │   ├── Tag.js                    ← Tag badge
    │   └── SugarPill.js              ← Sugar badge
    └── screens/
        ├── HomeScreen.js             ← All drinks (favorites first)
        ├── CoffeeScreen.js           ← Hot + Iced Coffee + Cold Brew
        ├── TeaScreen.js              ← Hot + Iced Tea + Tea Lattes
        ├── FavoritesScreen.js        ← Saved drinks
        ├── SearchScreen.js           ← Full-screen search
        └── DetailScreen.js           ← Drink detail + order instructions
```

## SDK 54 Key Changes Applied

- `react-native: 0.81.4`, `react: 19.1.0`
- `newArchEnabled: true` in app.json (New Architecture)
- All screens use `SafeAreaView` from `react-native-safe-area-context`
  (React Native's built-in `SafeAreaView` is deprecated in SDK 54)
- `SafeAreaProvider` wraps the entire app in `App.js`
- `@react-native-async-storage/async-storage: 2.2.0` (SDK 54 compatible)
- `react-native-safe-area-context: ~5.6.0`
- `react-native-screens: ~4.11.1`
