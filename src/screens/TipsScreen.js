import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../data/theme';

function SectionLabel({ text }) {
  return <Text style={styles.sectionLbl}>{text}</Text>;
}

function TipCard({ icon, title, desc, variant, onPress }) {
  return (
    <TouchableOpacity
      style={[styles.tipCard, variant === 'danger' && styles.tipCardDanger, variant === 'warn' && styles.tipCardWarn]}
      onPress={onPress}
      activeOpacity={0.75}
    >
      <View style={[styles.tipIcon, variant === 'danger' && styles.tipIconDanger, variant === 'warn' && styles.tipIconWarn]}>
        <Text style={styles.tipIconEmoji}>{icon}</Text>
      </View>
      <View style={styles.tipBody}>
        <Text style={[styles.tipTitle, variant === 'danger' && styles.tipTitleDanger, variant === 'warn' && styles.tipTitleWarn]}>
          {title}
        </Text>
        <Text style={styles.tipDesc}>{desc}</Text>
      </View>
      <Text style={styles.tipArrow}>›</Text>
    </TouchableOpacity>
  );
}

export default function TipsScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.green} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}
        <View style={styles.hero}>
          <Text style={styles.heroTitle}>Tips & Guides</Text>
          <Text style={styles.heroSub}>Everything you need to order with zero sugar confidence.</Text>
        </View>

        {/* Watch Out */}
        <SectionLabel text="Watch Out" />
        <TipCard
          icon="🚨"
          title="Hidden Sugar Traps"
          desc="9 drinks with more sugar than you'd ever expect"
          variant="danger"
          onPress={() => navigation.navigate('HiddenSugar')}
        />
        <TipCard
          icon="🥛"
          title="Milk Sugar Guide"
          desc="All milks ranked from lowest to highest sugar"
          variant="warn"
          onPress={() => navigation.navigate('MilkGuide')}
        />

        {/* Order Smarter */}
        <SectionLabel text="Order Smarter" />
        <TipCard
          icon="📖"
          title="Ordering Glossary"
          desc="What every Starbucks term actually means"
          onPress={() => navigation.navigate('Glossary')}
        />
        <TipCard
          icon="🍽️"
          title="Food Pairings"
          desc="Best low-sugar foods to order alongside your drink"
          onPress={() => navigation.navigate('Food')}
        />

        {/* About */}
        <SectionLabel text="About This App" />
        <TipCard
          icon="⚠️"
          title="Disclaimer"
          desc="Not affiliated with Starbucks Corporation"
          onPress={() => navigation.navigate('About')}
        />
        <TipCard
          icon="📋"
          title="Data & Accuracy"
          desc="2025/2026 menu data — availability may vary by location"
          onPress={() => navigation.navigate('About')}
        />
        <TipCard
          icon="©️"
          title="Copyright"
          desc="© 2026 Major Highfield. All rights reserved."
          onPress={() => navigation.navigate('About')}
        />

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:   { flex: 1, backgroundColor: colors.bg },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 32 },

  hero: {
    background: colors.green,
    backgroundColor: colors.green,
    paddingHorizontal: 20, paddingTop: 20, paddingBottom: 22,
  },
  heroTitle: {
    fontSize: 24, fontWeight: '800', color: '#fff',
    letterSpacing: -0.3, marginBottom: 5,
  },
  heroSub: { fontSize: 13, color: 'rgba(255,255,255,0.72)', lineHeight: 20 },

  sectionLbl: {
    fontSize: 11, fontWeight: '700', letterSpacing: 1.5,
    textTransform: 'uppercase', color: colors.green,
    paddingHorizontal: 16, paddingTop: 20, paddingBottom: 8,
  },

  tipCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1, borderColor: colors.border,
    borderRadius: 14, padding: 13,
    marginHorizontal: 14, marginBottom: 9,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 2, shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  tipCardDanger: { backgroundColor: colors.redBg, borderColor: colors.redBorder },
  tipCardWarn:   { backgroundColor: colors.warnBg, borderColor: colors.warnBorder },

  tipIcon: {
    width: 42, height: 42, borderRadius: 11,
    backgroundColor: colors.greenPale, borderWidth: 1, borderColor: colors.greenBorder,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  tipIconDanger: { backgroundColor: colors.redBg, borderColor: colors.redBorder },
  tipIconWarn:   { backgroundColor: colors.warnBg, borderColor: colors.warnBorder },
  tipIconEmoji:  { fontSize: 21 },

  tipBody:  { flex: 1, marginLeft: 12 },
  tipTitle: { fontSize: 15, fontWeight: '700', color: colors.text, marginBottom: 2 },
  tipTitleDanger: { color: colors.red },
  tipTitleWarn:   { color: colors.warn },
  tipDesc:  { fontSize: 12, color: colors.muted, lineHeight: 18 },
  tipArrow: { fontSize: 20, color: colors.border, marginLeft: 6 },
});
