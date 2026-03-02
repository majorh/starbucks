import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TAG_META } from '../data/drinks';

export default function Tag({ id }) {
  const meta = TAG_META[id];
  if (!meta) return null;
  return (
    <View style={[styles.tag, { backgroundColor: meta.bg, borderColor: meta.border }]}>
      <Text style={[styles.label, { color: meta.color }]}>{meta.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tag: {
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 7,
    paddingVertical: 2,
    marginRight: 4,
    marginBottom: 2,
  },
  label: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
});
