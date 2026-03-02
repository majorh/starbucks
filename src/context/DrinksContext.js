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
  const allDrinks = categories.flatMap((c) => c.drinks);

  return (
    <DrinksContext.Provider value={{ categories, allDrinks, loading, source }}>
      {children}
    </DrinksContext.Provider>
  );
}

export function useDrinks() {
  return useContext(DrinksContext);
}
