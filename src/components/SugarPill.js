import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function SugarPill({ label, level }) {
  const isZero = level === 'zero';
  return (
    <View style={[styles.pill, isZero ? styles.pillZero : styles.pillLow]}>
      <Text style={[styles.text, isZero ? styles.textZero : styles.textLow]}>
        🍬 {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 7,
    paddingVertical: 2,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  pillZero: {
    backgroundColor: 'rgba(0,201,117,0.12)',
    borderColor: 'rgba(0,201,117,0.25)',
  },
  pillLow: {
    backgroundColor: 'rgba(255,180,0,0.08)',
    borderColor: 'rgba(255,180,0,0.2)',
  },
  text: { fontSize: 10, fontWeight: '500' },
  textZero: { color: '#00c975' },
  textLow: { color: '#ffc94d' },
});
