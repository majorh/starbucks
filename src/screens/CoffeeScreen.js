import React, { useMemo } from 'react';
import { Text, StyleSheet, FlatList, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CATEGORIES } from '../data/drinks';
import { colors } from '../data/theme';
import DrinkRow from '../components/DrinkRow';
import ScreenHeader from '../components/ScreenHeader';

const COFFEE_CATS = ['hc', 'ic', 'cb'];

export default function CoffeeScreen({ navigation }) {
  const listData = useMemo(() => {
    const items = [];
    CATEGORIES.filter((c) => COFFEE_CATS.includes(c.id)).forEach((cat) => {
      items.push({ type: 'header', key: 'h_' + cat.id, label: cat.name });
      cat.drinks.forEach((d) =>
        items.push({ type: 'drink', key: d.id, drink: d })
      );
    });
    return items;
  }, []);

  const renderItem = ({ item }) => {
    if (item.type === 'header') {
      return <Text style={styles.sectionHeader}>{item.label}</Text>;
    }
    return (
      <DrinkRow
        drink={item.drink}
        onPress={() => navigation.navigate('Detail', { drink: item.drink })}
      />
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.bg} />
      <ScreenHeader title="Coffee" onSearchPress={() => navigation.navigate('Search')} />
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
