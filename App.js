import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Text } from 'react-native';
import HomeScreen from './src/screens/HomeScreen';
import CoffeeScreen from './src/screens/CoffeeScreen';
import TeaScreen from './src/screens/TeaScreen';
import FavoritesScreen from './src/screens/FavoritesScreen';
import DetailScreen from './src/screens/DetailScreen';
import SearchScreen from './src/screens/SearchScreen';
import AboutScreen from './src/screens/AboutScreen';
import { FavoritesProvider } from './src/context/FavoritesContext';
import { colors } from './src/data/theme';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function TabIcon({ emoji, focused }) {
  return (
    <Text style={{ fontSize: focused ? 24 : 22, opacity: focused ? 1 : 0.5 }}>
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
          paddingBottom: 6,
          paddingTop: 6,
          height: 70,
        },
        tabBarActiveTintColor: colors.green,
        tabBarInactiveTintColor: colors.muted,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 2,
        },
      }}
    >
      <Tab.Screen
        name="All"
        component={HomeScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="☕" focused={focused} /> }}
      />
      <Tab.Screen
        name="Coffee"
        component={CoffeeScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="🧊" focused={focused} /> }}
      />
      <Tab.Screen
        name="Tea"
        component={TeaScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="🍵" focused={focused} /> }}
      />
      <Tab.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="❤️" focused={focused} /> }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <FavoritesProvider>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
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
              name="About"
              component={AboutScreen}
              options={{ animation: 'slide_from_bottom' }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </FavoritesProvider>
    </SafeAreaProvider>
  );
}
