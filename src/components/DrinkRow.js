import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../data/theme';
import { useFavorites } from '../context/FavoritesContext';

export default function DrinkRow({ drink, onPress, showHeart = true }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const fav = isFavorite(drink.id);

  return (
    <TouchableOpacity style={styles.row} onPress={onPress} activeOpacity={0.7}>
      <Text style={styles.emoji}>{drink.emoji}</Text>
      <View style={styles.body}>
        <Text style={[styles.name, drink.tags.includes('m') && styles.nameMod]}>
          {drink.name}
        </Text>
        <Text style={styles.desc} numberOfLines={1}>{drink.desc}</Text>
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
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
  },
  emoji: {
    fontSize: 30,
    width: 44,
    textAlign: 'center',
    marginRight: 14,
  },
  body: { flex: 1 },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.cream,
    marginBottom: 4,
  },
  nameMod: { color: colors.greenLight },
  desc: {
    fontSize: 13,
    color: colors.muted,
    lineHeight: 18,
  },
  heartBtn: {
    paddingHorizontal: 6,
  },
  heart: { fontSize: 18 },
  arrow: {
    color: colors.muted,
    fontSize: 22,
    marginLeft: 4,
  },
});
