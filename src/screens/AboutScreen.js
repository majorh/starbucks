import React from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, StatusBar, Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../data/theme';
import AppLogo from '../components/AppLogo';

function Section({ title, children }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionCard}>
        {children}
      </View>
    </View>
  );
}

function Row({ icon, text, onPress }) {
  const Inner = (
    <View style={styles.row}>
      <Text style={styles.rowIcon}>{icon}</Text>
      <Text style={[styles.rowText, onPress && styles.rowTextLink]}>{text}</Text>
    </View>
  );
  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {Inner}
      </TouchableOpacity>
    );
  }
  return Inner;
}

export default function AboutScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.bg} />

      {/* Nav */}
      <View style={styles.nav}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backArrow}>‹</Text>
          <Text style={styles.backLabel}>Back</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}
        <View style={styles.hero}>
          <AppLogo size={72} />
          <Text style={styles.heroTitle}>Starbucks{'\n'}Zero Sugar</Text>
          <Text style={styles.heroVersion}>Version 1.0.0</Text>
        </View>

        {/* Disclaimer */}
        <Section title="Disclaimer">
          <Row
            icon="⚠️"
            text="This app is not officially associated with, endorsed by, or affiliated with Starbucks Corporation in any way. Starbucks is a registered trademark of Starbucks Corporation."
          />
        </Section>

        {/* Data Sources */}
        <Section title="Data & Accuracy">
          <Row
            icon="📋"
            text="Drink and nutritional information is sourced from Starbucks' 2025/2026 national menu and publicly available nutritional data."
          />
          <View style={styles.divider} />
          <Row
            icon="🔄"
            text="Menu items, ingredients, and nutritional values are subject to change. Always verify with your barista, especially for allergen or dietary needs."
          />
          <View style={styles.divider} />
          <Row
            icon="📍"
            text="Availability of items such as sugar-free syrups may vary by location, season, and regional menu differences."
          />
        </Section>

        {/* How it works */}
        <Section title="How to Use This App">
          <Row
            icon="☕"
            text='Browse drinks by category using the tabs below, or search by name. Tap any drink for full ordering instructions.'
          />
          <View style={styles.divider} />
          <Row
            icon="❤️"
            text="Save your go-to orders by tapping the heart icon on any drink's detail page. Your favorites are saved to your device."
          />
          <View style={styles.divider} />
          <Row
            icon="📤"
            text="Use the Share button on any drink to send the order to a friend or open the Starbucks app directly."
          />
        </Section>

        {/* Milk note */}
        <Section title="A Note on Milk & Sugar">
          <Row
            icon="🥛"
            text="No Starbucks plant-based milk is truly unsweetened. Heavy cream is the best choice for near-zero sugar drinks. Almond milk is the lowest-sugar plant-based option."
          />
          <View style={styles.divider} />
          <Row
            icon="📊"
            text="View the full Milk Sugar Guide — all options ranked lowest to highest sugar →"
            onPress={() => navigation.navigate('MilkGuide')}
          />
        </Section>

        {/* Legal */}
        <Section title="Legal">
          <Row icon="©" text="Copyright 2026 Major Highfield. All rights reserved." />
          <View style={styles.divider} />
          <Row
            icon="📄"
            text="This app is provided for informational purposes only. The developer makes no warranties regarding the accuracy or completeness of the information provided."
          />
        </Section>

        <Text style={styles.footer}>
          Made with ☕ for anyone trying to enjoy Starbucks without the sugar.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },

  nav: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backBtn: { flexDirection: 'row', alignItems: 'center' },
  backArrow: { fontSize: 26, color: colors.green, marginRight: 4, lineHeight: 30 },
  backLabel: { fontSize: 17, color: colors.green, fontWeight: '600' },

  scroll: { padding: 20, paddingBottom: 48 },

  // Hero
  hero: {
    alignItems: 'center',
    paddingBottom: 32,
    marginBottom: 8,
  },
  heroTitle: {
    fontWeight: '700',
    fontSize: 26,
    color: colors.cream,
    textAlign: 'center',
    marginTop: 16,
    letterSpacing: -0.3,
    lineHeight: 32,
  },
  heroVersion: {
    fontSize: 13,
    color: colors.muted,
    marginTop: 6,
  },

  // Sections
  section: { marginBottom: 24 },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: colors.green,
    marginBottom: 10,
  },
  sectionCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    overflow: 'hidden',
  },

  // Rows
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 14,
  },
  rowIcon: { fontSize: 16, marginRight: 12, marginTop: 1, width: 22, textAlign: 'center' },
  rowText: { flex: 1, fontSize: 14, color: colors.cream, lineHeight: 21 },
  rowTextLink: { color: colors.greenLight },

  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginHorizontal: 14,
  },

  footer: {
    textAlign: 'center',
    color: colors.muted,
    fontSize: 13,
    marginTop: 8,
    lineHeight: 20,
  },
});
