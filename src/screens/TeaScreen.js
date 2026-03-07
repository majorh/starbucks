import React, { useMemo } from 'react';
import { Text, StyleSheet, FlatList, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../data/theme';
import { useDrinks } from '../context/DrinksContext';
import DrinkRow from '../components/DrinkRow';
import ScreenHeader from '../components/ScreenHeader';

const TEA_CATS = ['ht', 'it', 'tl'];

export default function TeaScreen({ navigation }) {
  const { categories } = useDrinks();

  const listData = useMemo(() => {
    const items = [];
    categories.filter((c) => TEA_CATS.includes(c.id)).forEach((cat) => {
      items.push({ type: 'header', key: 'h_' + cat.id, label: cat.name });
      cat.drinks.forEach((d) =>
        items.push({ type: 'drink', key: d.id, drink: d })
      );
    });
    return items;
  }, [categories]);

  const renderItem = ({ item }) => {
    if (item.type === 'header') return <Text style={styles.sectionHeader}>{item.label}</Text>;
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
      <ScreenHeader title="Tea" onSearchPress={() => navigation.navigate('Search')} />
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
    fontSize: 20, fontWeight: '700', color: colors.cream,
    marginTop: 20, marginBottom: 12, letterSpacing: -0.3,
  },
});
