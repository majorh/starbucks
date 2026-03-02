import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../data/theme';
import AppLogo from './AppLogo';

export default function ScreenHeader({ title, onSearchPress, onInfoPress }) {
  const isHome = !title; // home screen passes no title — uses logo + full title

  return (
    <View style={styles.header}>
      {/* Left: logo + title (home) or plain title (other screens) */}
      <View style={styles.left}>
        {isHome ? (
          <View style={styles.brandRow}>
            <AppLogo size={38} />
            <View style={styles.brandText}>
              <Text style={styles.brandTop}>STARBUCKS</Text>
              <Text style={styles.brandBottom}>Zero Sugar</Text>
            </View>
          </View>
        ) : (
          <Text style={styles.title}>{title}</Text>
        )}
      </View>

      {/* Right: icon buttons */}
      <View style={styles.actions}>
        {onSearchPress && (
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={onSearchPress}
            activeOpacity={0.7}
          >
            <Text style={styles.iconText}>🔍</Text>
          </TouchableOpacity>
        )}
        {onInfoPress && (
          <TouchableOpacity
            style={[styles.iconBtn, styles.iconBtnInfo]}
            onPress={onInfoPress}
            activeOpacity={0.7}
          >
            <Text style={styles.infoText}>i</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  left: { flex: 1 },

  // Home brand lockup
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandText: {
    marginLeft: 10,
  },
  brandTop: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
    color: colors.green,
    textTransform: 'uppercase',
  },
  brandBottom: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.cream,
    letterSpacing: -0.3,
    lineHeight: 26,
  },

  // Other screen title
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.cream,
    letterSpacing: -0.4,
  },

  // Icon buttons
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginLeft: 12,
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBtnInfo: {},
  iconText: { fontSize: 16 },
  infoText: {
    fontSize: 17,
    fontWeight: '700',
    fontStyle: 'italic',
    color: colors.cream,
    lineHeight: 20,
  },
});
