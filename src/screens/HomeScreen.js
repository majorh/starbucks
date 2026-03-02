import React, { useMemo } from 'react';
import { Text, StyleSheet, FlatList, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CATEGORIES, ALL_DRINKS } from '../data/drinks';
import { colors } from '../data/theme';
import { useFavorites } from '../context/FavoritesContext';
import DrinkRow from '../components/DrinkRow';
import ScreenHeader from '../components/ScreenHeader';

export default function HomeScreen({ navigation }) {
  const { favorites } = useFavorites();

  const listData = useMemo(() => {
    const items = [];
    const favDrinks = ALL_DRINKS.filter((d) => favorites.has(d.id));
    if (favDrinks.length > 0) {
      items.push({ type: 'header', key: 'h_favs', label: 'Favorites' });
      favDrinks.forEach((d) =>
        items.push({ type: 'drink', key: 'fav_' + d.id, drink: d })
      );
    }
    CATEGORIES.forEach((cat) => {
      items.push({ type: 'header', key: 'h_' + cat.id, label: cat.name });
      cat.drinks.forEach((d) =>
        items.push({ type: 'drink', key: d.id, drink: d })
      );
    });
    return items;
  }, [favorites]);

  const renderItem = ({ item }) => {
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
      <FlatList
        data={listData}
        keyExtractor={(item) => item.key}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  list: { paddingHorizontal: 16, paddingBottom: 24 },
  sectionHeader: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.cream,
    marginTop: 20,
    marginBottom: 12,
    letterSpacing: -0.3,
  },
});
