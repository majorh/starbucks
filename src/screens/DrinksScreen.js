import React, { useMemo, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, StatusBar,
  TouchableOpacity, TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../data/theme';
import { useDrinks } from '../context/DrinksContext';
import DrinkRow from '../components/DrinkRow';
import FilterBar, { applyFilter } from '../components/FilterBar';

export default function DrinksScreen({ navigation, route }) {
  const { categories, allDrinks } = useDrinks();
  const [filter, setFilter] = useState('all');
  const [query, setQuery]   = useState('');

  // If navigated here from Home's coffee/tea shortcuts, pre-apply a filter
  // (we handle this via the filterCategory param)
  const initialCategory = route?.params?.filterCategory;

  const listData = useMemo(() => {
    const items = [];

    // Search mode
    if (query.trim().length > 0) {
      const q = query.toLowerCase();
      const results = allDrinks.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.desc.toLowerCase().includes(q) ||
          (d.order && d.order.toLowerCase().includes(q))
      );
      if (results.length === 0) {
        items.push({ type: 'empty', key: 'empty', msg: 'No drinks found for "' + query + '"' });
      } else {
        items.push({ type: 'resultCount', key: 'count', count: results.length, query });
        results.forEach((d) => items.push({ type: 'drink', key: 'sr_' + d.id, drink: d }));
      }
      return items;
    }

    const isFiltered = filter !== 'all';
    const catFilter  = initialCategory; // 'coffee' | 'tea' | undefined

    // Seasonal (only when not filtering)
    const seasonal = categories.find((c) => c.id === 'seasonal');
    if (seasonal && seasonal.drinks.length > 0 && !isFiltered && !catFilter) {
      items.push({ type: 'seasonal_header', key: 'h_seasonal', label: seasonal.name || '🍂 Seasonal' });
      seasonal.drinks.forEach((d) =>
        items.push({ type: 'drink', key: 'seasonal_' + d.id, drink: d })
      );
    }

    // Category groups
    const COFFEE_CATS = ['hc', 'ic', 'cb'];
    const TEA_CATS    = ['ht', 'it', 'tl'];

    categories
      .filter((c) => {
        if (c.id === 'seasonal') return false;
        if (catFilter === 'coffee') return COFFEE_CATS.includes(c.id);
        if (catFilter === 'tea')    return TEA_CATS.includes(c.id);
        return true;
      })
      .forEach((cat) => {
        const drinks = applyFilter(cat.drinks, filter);
        if (drinks.length === 0) return;
        items.push({ type: 'header', key: 'h_' + cat.id, label: cat.name });
        drinks.forEach((d) => items.push({ type: 'drink', key: d.id, drink: d }));
      });

    if (items.length === 0) {
      items.push({ type: 'empty', key: 'empty', msg: 'No drinks match this filter' });
    }

    return items;
  }, [categories, allDrinks, filter, query, initialCategory]);

  const renderItem = ({ item }) => {
    if (item.type === 'seasonal_header') {
      return (
        <View style={styles.seasonalHeader}>
          <Text style={styles.seasonalLabel}>{item.label}</Text>
          <View style={styles.seasonalBadge}>
            <Text style={styles.seasonalBadgeText}>Limited Time</Text>
          </View>
        </View>
      );
    }
    if (item.type === 'header') {
      return <Text style={styles.sectionHeader}>{item.label}</Text>;
    }
    if (item.type === 'resultCount') {
      return (
        <Text style={styles.resultCount}>
          {item.count} result{item.count !== 1 ? 's' : ''} for "{item.query}"
        </Text>
      );
    }
    if (item.type === 'empty') {
      return (
        <View style={styles.empty}>
          <Text style={styles.emptyEmoji}>🌿</Text>
          <Text style={styles.emptyText}>{item.msg}</Text>
        </View>
      );
    }
    return (
      <DrinkRow
        drink={item.drink}
        showHeart={false}
        showSugarPill
        onPress={() => navigation.navigate('Detail', { drink: item.drink })}
      />
    );
  };

  const headerTitle = initialCategory === 'coffee'
    ? 'Coffees'
    : initialCategory === 'tea'
    ? 'Teas'
    : 'All Drinks';

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.surface} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>{headerTitle}</Text>
        {/* Search bar */}
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search drinks…"
            placeholderTextColor={colors.muted2}
            value={query}
            onChangeText={setQuery}
            returnKeyType="search"
            autoCorrect={false}
            autoCapitalize="none"
            clearButtonMode="while-editing"
          />
        </View>
      </View>

      {/* Filter chips — hide when in search mode */}
      {query.length === 0 && (
        <FilterBar active={filter} onChange={setFilter} />
      )}

      <FlatList
        data={listData}
        keyExtractor={(item) => item.key}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },

  header: {
    backgroundColor: colors.surface,
    paddingHorizontal: 18, paddingTop: 13, paddingBottom: 11,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  title: {
    fontSize: 22, fontWeight: '900', color: colors.text,
    letterSpacing: -0.3, marginBottom: 10,
  },
  searchBar: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: colors.bg, borderWidth: 1, borderColor: colors.border,
    borderRadius: 12, paddingHorizontal: 12,
  },
  searchIcon:  { fontSize: 15 },
  searchInput: { flex: 1, color: colors.text, fontSize: 15, paddingVertical: 10 },

  list: { paddingBottom: 24 },

  sectionHeader: {
    fontSize: 17, fontWeight: '900', color: colors.text,
    paddingHorizontal: 16, paddingTop: 18, paddingBottom: 8,
  },
  seasonalHeader: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingTop: 18, paddingBottom: 8,
  },
  seasonalLabel: { fontSize: 17, fontWeight: '900', color: colors.text, marginRight: 10 },
  seasonalBadge: {
    backgroundColor: colors.warnBg, borderWidth: 1, borderColor: colors.warnBorder,
    borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3,
  },
  seasonalBadgeText: { fontSize: 10, fontWeight: '700', color: colors.warn },

  resultCount: {
    fontSize: 12, color: colors.muted,
    paddingHorizontal: 16, paddingTop: 12, paddingBottom: 4,
  },
  empty: { alignItems: 'center', paddingTop: 60 },
  emptyEmoji: { fontSize: 40, marginBottom: 12 },
  emptyText:  { fontSize: 15, color: colors.muted },
});
