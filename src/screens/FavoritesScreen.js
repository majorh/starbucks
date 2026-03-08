import React, { useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../data/theme';
import { useFavorites } from '../context/FavoritesContext';
import { useDrinks } from '../context/DrinksContext';
import DrinkRow from '../components/DrinkRow';
import ScreenHeader from '../components/ScreenHeader';

export default function FavoritesScreen({ navigation }) {
  const { favorites } = useFavorites();
  const { allDrinks } = useDrinks();

  const favDrinks = useMemo(
    () => allDrinks.filter((d) => favorites.has(d.id)),
    [favorites, allDrinks]
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.bg} />
      <ScreenHeader title="Favorites" />
      {favDrinks.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyEmoji}>🤍</Text>
          <Text style={styles.emptyTitle}>No favorites yet</Text>
          <Text style={styles.emptySubtitle}>
            Tap the heart on any drink to save it here.
          </Text>
        </View>
      ) : (
        <FlatList
          data={favDrinks}
          keyExtractor={(d) => d.id}
          renderItem={({ item }) => (
            <DrinkRow
              drink={item}
              onPress={() => navigation.navigate('Detail', { drink: item })}
            />
          )}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  list: { paddingHorizontal: 16, paddingBottom: 24 },
  empty: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: 40, paddingBottom: 80,
  },
  emptyEmoji: { fontSize: 56, marginBottom: 20 },
  emptyTitle: { fontSize: 22, fontWeight: '700', color: colors.text, marginBottom: 10, textAlign: 'center' },
  emptySubtitle: { fontSize: 15, color: colors.muted, textAlign: 'center', lineHeight: 22 },
});
