import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../data/theme';
import { useFavorites } from '../context/FavoritesContext';

export default function DrinkRow({ drink, onPress, showHeart = true, showSugarPill = false }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const fav = isFavorite(drink.id);

  return (
    <TouchableOpacity style={styles.row} onPress={onPress} activeOpacity={0.7}>
      <Text style={styles.emoji}>{drink.emoji}</Text>
      <View style={styles.body}>
        <Text style={[styles.name, drink.tags && drink.tags.includes('m') && styles.nameMod]}>
          {drink.name}
        </Text>
        <Text style={styles.desc} numberOfLines={1}>{drink.desc}</Text>
        {showSugarPill && (
          <View style={[styles.sugarPill, drink.sugarLevel === 'zero' ? styles.pillZero : styles.pillLow]}>
            <Text style={[styles.sugarPillText, drink.sugarLevel === 'zero' ? styles.pillTextZero : styles.pillTextLow]}>
              {drink.sugarLabel || (drink.sugarLevel === 'zero' ? '0g sugar' : 'low sugar')}
            </Text>
          </View>
        )}
      </View>
      {showHeart && (
        <TouchableOpacity
          style={styles.heartBtn}
          onPress={() => toggleFavorite(drink.id)}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Text style={styles.heart}>{fav ? '❤️' : '🤍'}</Text>
        </TouchableOpacity>
      )}
      <Text style={styles.arrow}>›</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.surface,
    borderBottomWidth: 1, borderBottomColor: colors.border,
    paddingVertical: 12, paddingHorizontal: 16,
  },
  emoji: { fontSize: 26, width: 42, textAlign: 'center', marginRight: 12 },
  body: { flex: 1 },
  name: { fontSize: 15, fontWeight: '700', color: colors.text, marginBottom: 2 },
  nameMod: { color: colors.green },
  desc: { fontSize: 12, color: colors.muted, lineHeight: 17 },
  sugarPill: {
    alignSelf: 'flex-start', marginTop: 5,
    borderRadius: 8, borderWidth: 1,
    paddingHorizontal: 7, paddingVertical: 2,
  },
  pillZero: { backgroundColor: colors.greenPale, borderColor: colors.greenBorder },
  pillLow:  { backgroundColor: colors.warnBg, borderColor: colors.warnBorder },
  sugarPillText: { fontSize: 10, fontWeight: '700' },
  pillTextZero: { color: colors.green },
  pillTextLow:  { color: colors.warn },
  heartBtn: { paddingHorizontal: 6 },
  heart: { fontSize: 18 },
  arrow: { color: colors.border, fontSize: 20, marginLeft: 4 },
});
