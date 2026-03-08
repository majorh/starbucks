/**
 * App.js — Zero Sugar Starbucks v2
 *
 * Navigation structure:
 *   Stack
 *   ├── Onboarding  (shown once on first launch)
 *   └── Tabs
 *       ├── Home        (launchpad)
 *       ├── Drinks      (full list + filters + search)
 *       ├── Tips        (guides + about)
 *       └── Calculator
 *   Stack (continued — modal/push screens)
 *   ├── Detail
 *   ├── Search
 *   ├── Favorites
 *   ├── About
 *   ├── MilkGuide
 *   ├── HiddenSugar
 *   ├── Food
 *   └── Glossary
 */

import React, { useState, useEffect } from 'react';
import { Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { FavoritesProvider } from './src/context/FavoritesContext';
import { DrinksProvider }    from './src/context/DrinksContext';
import { colors }            from './src/data/theme';

// Screens
import OnboardingScreen, { ONBOARDING_KEY } from './src/screens/OnboardingScreen';
import HomeScreen       from './src/screens/HomeScreen';
import DrinksScreen     from './src/screens/DrinksScreen';
import TipsScreen       from './src/screens/TipsScreen';
import CalculatorScreen from './src/screens/CalculatorScreen';
import DetailScreen     from './src/screens/DetailScreen';
import SearchScreen     from './src/screens/SearchScreen';
import FavoritesScreen  from './src/screens/FavoritesScreen';
import AboutScreen      from './src/screens/AboutScreen';
import MilkGuideScreen  from './src/screens/MilkGuideScreen';
import HiddenSugarScreen from './src/screens/HiddenSugarScreen';
import FoodScreen       from './src/screens/FoodScreen';
import GlossaryScreen   from './src/screens/GlossaryScreen';

const Tab   = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function TabIcon({ emoji, focused }) {
  return (
    <Text style={{ fontSize: focused ? 23 : 21, opacity: focused ? 1 : 0.3 }}>
      {emoji}
    </Text>
  );
}

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          paddingBottom: 8,
          paddingTop: 6,
          height: 72,
          shadowColor: '#000',
          shadowOpacity: 0.06,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: -2 },
          elevation: 8,
        },
        tabBarActiveTintColor:   colors.green,
        tabBarInactiveTintColor: colors.muted2,
        tabBarLabelStyle: { fontSize: 10, fontWeight: '700', marginTop: 1 },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="🏠" focused={focused} /> }}
      />
      <Tab.Screen
        name="Drinks"
        component={DrinksScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="☕" focused={focused} /> }}
      />
      <Tab.Screen
        name="Tips"
        component={TipsScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="💡" focused={focused} /> }}
      />
      <Tab.Screen
        name="Calculator"
        component={CalculatorScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="🧮" focused={focused} /> }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  const [onboardingDone, setOnboardingDone] = useState(null); // null = loading

  useEffect(() => {
    AsyncStorage.getItem(ONBOARDING_KEY).then((val) => {
      setOnboardingDone(!!val);
    });
  }, []);

  // Still checking AsyncStorage
  if (onboardingDone === null) return null;

  return (
    <SafeAreaProvider>
      <DrinksProvider>
        <FavoritesProvider>
          <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>

              {!onboardingDone && (
                <Stack.Screen name="Onboarding">
                  {() => (
                    <OnboardingScreen onComplete={() => setOnboardingDone(true)} />
                  )}
                </Stack.Screen>
              )}

              <Stack.Screen name="Tabs" component={TabNavigator} />

              <Stack.Screen
                name="Detail"
                component={DetailScreen}
                options={{ animation: 'slide_from_right' }}
              />
              <Stack.Screen
                name="Search"
                component={SearchScreen}
                options={{ animation: 'fade' }}
              />
              <Stack.Screen
                name="Favorites"
                component={FavoritesScreen}
                options={{ animation: 'slide_from_right' }}
              />
              <Stack.Screen
                name="About"
                component={AboutScreen}
                options={{ animation: 'slide_from_bottom' }}
              />
              <Stack.Screen
                name="MilkGuide"
                component={MilkGuideScreen}
                options={{ animation: 'slide_from_right' }}
              />
              <Stack.Screen
                name="HiddenSugar"
                component={HiddenSugarScreen}
                options={{ animation: 'slide_from_right' }}
              />
              <Stack.Screen
                name="Food"
                component={FoodScreen}
                options={{ animation: 'slide_from_right' }}
              />
              <Stack.Screen
                name="Glossary"
                component={GlossaryScreen}
                options={{ animation: 'slide_from_right' }}
              />

            </Stack.Navigator>
          </NavigationContainer>
        </FavoritesProvider>
      </DrinksProvider>
    </SafeAreaProvider>
  );
}
