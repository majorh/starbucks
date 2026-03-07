import React, { useMemo } from 'react';
import { Text, StyleSheet, FlatList, StatusBar, ActivityIndicator, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../data/theme';
import { useFavorites } from '../context/FavoritesContext';
import { useDrinks } from '../context/DrinksContext';
import DrinkRow from '../components/DrinkRow';
import ScreenHeader from '../components/ScreenHeader';

export default function HomeScreen({ navigation }) {
  const { favorites } = useFavorites();
  const { categories, allDrinks, loading } = useDrinks();

  const listData = useMemo(() => {
    const items = [];

    // Seasonal section — any category with id 'seasonal' floats to the top
    const seasonal = categories.find((c) => c.id === 'seasonal');
    if (seasonal && seasonal.drinks.length > 0) {
      items.push({ type: 'seasonal_header', key: 'h_seasonal', label: seasonal.name || '🍂 Seasonal' });
      seasonal.drinks.forEach((d) =>
        items.push({ type: 'drink', key: 'seasonal_' + d.id, drink: d })
      );
    }

    // Favorites
    const favDrinks = allDrinks.filter((d) => favorites.has(d.id));
    if (favDrinks.length > 0) {
      items.push({ type: 'header', key: 'h_favs', label: 'Favorites' });
      favDrinks.forEach((d) =>
        items.push({ type: 'drink', key: 'fav_' + d.id, drink: d })
      );
    }

    // All other categories (skip seasonal — already shown at top)
    categories.filter((c) => c.id !== 'seasonal').forEach((cat) => {
      items.push({ type: 'header', key: 'h_' + cat.id, label: cat.name });
      cat.drinks.forEach((d) =>
        items.push({ type: 'drink', key: d.id, drink: d })
      );
    });

    return items;
  }, [favorites, categories, allDrinks]);

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
    return (
      <DrinkRow
        drink={item.drink}
        showHeart={false}
        onPress={() => navigation.navigate('Detail', { drink: item.drink })}
      />
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.bg} />
      <ScreenHeader
        onSearchPress={() => navigation.navigate('Search')}
        onInfoPress={() => navigation.navigate('About')}
      />
      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator color={colors.green} size="large" />
        </View>
      ) : (
        <FlatList
          data={listData}
          keyExtractor={(item) => item.key}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  loader: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  list: { paddingHorizontal: 16, paddingBottom: 24 },
  sectionHeader: {
    fontSize: 20, fontWeight: '700', color: colors.cream,
    marginTop: 20, marginBottom: 12, letterSpacing: -0.3,
  },
  seasonalHeader: {
    flexDirection: 'row', alignItems: 'center',
    marginTop: 20, marginBottom: 12,
  },
  seasonalLabel: {
    fontSize: 20, fontWeight: '700', color: colors.cream,
    letterSpacing: -0.3, marginRight: 10,
  },
  seasonalBadge: {
    backgroundColor: 'rgba(255,180,0,0.15)',
    borderWidth: 1, borderColor: 'rgba(255,180,0,0.3)',
    borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3,
  },
  seasonalBadgeText: { fontSize: 10, fontWeight: '700', color: '#ffc94d' },
});
