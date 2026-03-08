import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { colors } from '../data/theme';

const FILTERS = [
  { id: 'all',      label: 'All',             emoji: '☕' },
  { id: 'diabetic', label: 'Diabetic-Friendly', emoji: '💚' },
  { id: 'zero',     label: 'Zero Sugar',       emoji: '0️⃣' },
  { id: 'cold',     label: 'Iced Only',        emoji: '🧊' },
  { id: 'hot',      label: 'Hot Only',         emoji: '🔥' },
  { id: 'caffFree', label: 'Caffeine-Free',    emoji: '😴' },
];

export default function FilterBar({ active, onChange }) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={fb.row}
    >
      {FILTERS.map((f) => {
        const sel = active === f.id;
        return (
          <TouchableOpacity
            key={f.id}
            style={[fb.chip, sel && fb.chipSelected]}
            onPress={() => onChange(f.id)}
            activeOpacity={0.7}
          >
            <Text style={fb.chipEmoji}>{f.emoji}</Text>
            <Text style={[fb.chipLabel, sel && fb.chipLabelSelected]}>{f.label}</Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

// Filter a list of drinks by a given filter id
export function applyFilter(drinks, filter) {
  switch (filter) {
    case 'diabetic':
      // Zero or low sugar AND no chai concentrate or pre-sweetened base
      return drinks.filter(
        (d) => d.sugarLevel === 'zero' && !d.tags.includes('m') || 
               (d.sugarLevel === 'zero' && d.tags.includes('z'))
      );
    case 'zero':
      return drinks.filter((d) => d.sugarLevel === 'zero');
    case 'cold':
      return drinks.filter((d) => d.tags.includes('c'));
    case 'hot':
      return drinks.filter((d) => d.tags.includes('h'));
    case 'caffFree':
      return drinks.filter((d) => d.tags.includes('f'));
    default:
      return drinks;
  }
}

const fb = StyleSheet.create({
  row: { paddingHorizontal: 14, paddingVertical: 9, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#e8e8e8' },
  chip: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.bg, borderWidth: 1, borderColor: colors.border,
    borderRadius: 20, paddingHorizontal: 11, paddingVertical: 7, marginRight: 8,
  },
  chipSelected: { backgroundColor: colors.green, borderColor: colors.green },
  chipEmoji: { fontSize: 13, marginRight: 5 },
  chipLabel: { fontSize: 12, fontWeight: '600', color: colors.muted },
  chipLabelSelected: { color: '#fff' },
});
