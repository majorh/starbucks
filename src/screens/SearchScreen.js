import React, { useState, useMemo, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, StatusBar, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../data/theme';
import { useDrinks } from '../context/DrinksContext';
import DrinkRow from '../components/DrinkRow';

export default function SearchScreen({ navigation }) {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);
  const { allDrinks } = useDrinks();

  useEffect(() => {
    const timer = setTimeout(() => inputRef.current?.focus(), 100);
    return () => clearTimeout(timer);
  }, []);

  const results = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return [];
    return allDrinks.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.desc.toLowerCase().includes(q) ||
        d.order.toLowerCase().includes(q)
    );
  }, [query, allDrinks]);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.bg} />
      <View style={styles.topRow}>
        <View style={styles.inputWrap}>
          <Text style={styles.inputIcon}>🔍</Text>
          <TextInput
            ref={inputRef}
            style={styles.input}
            placeholder="Search drinks…"
            placeholderTextColor={colors.muted}
            value={query}
            onChangeText={setQuery}
            returnKeyType="search"
            clearButtonMode="while-editing"
            autoCorrect={false}
            autoCapitalize="none"
          />
        </View>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.cancelBtn}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
      </View>
      {query.length === 0 ? (
        <View style={styles.hint}>
          <Text style={styles.hintText}>Search by name or ingredient</Text>
        </View>
      ) : results.length === 0 ? (
        <View style={styles.hint}>
          <Text style={styles.emptyEmoji}>🌿</Text>
          <Text style={styles.hintText}>No drinks found</Text>
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(d) => d.id}
          renderItem={({ item }) => (
            <DrinkRow
              drink={item}
              onPress={() => navigation.navigate('Detail', { drink: item })}
            />
          )}
          contentContainerStyle={styles.list}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  topRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  inputWrap: {
    flex: 1, flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.surface, borderRadius: 12,
    borderWidth: 1, borderColor: colors.border, paddingHorizontal: 12,
  },
  inputIcon: { fontSize: 15, marginRight: 8 },
  input: { flex: 1, color: colors.cream, fontSize: 16, paddingVertical: 11 },
  cancelBtn: { marginLeft: 12, paddingVertical: 8 },
  cancelText: { color: colors.green, fontSize: 16, fontWeight: '600' },
  list: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 24 },
  hint: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingBottom: 80 },
  emptyEmoji: { fontSize: 40, marginBottom: 12 },
  hintText: { color: colors.muted, fontSize: 15 },
});
