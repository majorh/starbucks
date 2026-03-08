import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { loadDrinks } from '../data/drinksRemote';
import { CATEGORIES as BUNDLED_CATEGORIES } from '../data/drinks';

const DrinksContext = createContext();

export function DrinksProvider({ children }) {
  const [categories, setCategories] = useState(BUNDLED_CATEGORIES);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState('bundled'); // 'bundled' | 'cache' | 'remote'

  useEffect(() => {
    loadDrinks()
      .then((data) => {
        setCategories(data);
        setSource(data === BUNDLED_CATEGORIES ? 'bundled' : 'remote');
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Derive flat list of all drinks from current categories
  const allDrinks = categories.flatMap((cat) => cat.drinks.map((d) => ({ ...d, categoryId: cat.id })));
  // Cache for geofence notification service
  React.useEffect(() => {
    if (allDrinks.length > 0) {
      AsyncStorage.setItem('cached_drinks_flat', JSON.stringify(allDrinks)).catch(() => {});
    }
  }, [allDrinks]);

  return (
    <DrinksContext.Provider value={{ categories, allDrinks, loading, source }}>
      {children}
    </DrinksContext.Provider>
  );
}

export function useDrinks() {
  return useContext(DrinksContext);
}
