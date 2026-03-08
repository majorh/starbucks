import React from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../data/theme';

const MILKS = [
  {
    rank: 1,
    name: 'No Milk / Black',
    emoji: '🚫',
    sugar: '0g',
    sugarNum: 0,
    note: 'The ultimate zero-sugar choice. Every espresso and tea drink works black.',
    level: 'zero',
  },
  {
    rank: 2,
    name: 'Heavy Cream',
    emoji: '🍶',
    sugar: '~0.4g',
    sugarNum: 0.4,
    note: 'Best dairy option. Rich, creamy, and almost no sugar. Ask for "a splash of heavy cream."',
    level: 'zero',
  },
  {
    rank: 3,
    name: 'Half & Half',
    emoji: '🫙',
    sugar: '~1.3g',
    sugarNum: 1.3,
    note: 'Good middle ground between heavy cream and regular milk. Available at most locations.',
    level: 'low',
  },
  {
    rank: 4,
    name: 'Almond Milk',
    emoji: '🌰',
    sugar: '~1.3g',
    sugarNum: 1.3,
    note: 'Lowest-sugar plant-based option at Starbucks, but contains added sugar. Not truly unsweetened.',
    level: 'low',
    warning: true,
  },
  {
    rank: 5,
    name: 'Whole Milk',
    emoji: '🥛',
    sugar: '~3g',
    sugarNum: 3,
    note: 'Natural lactose sugar only — no added sugar. Richer taste than 2% or nonfat.',
    level: 'low',
  },
  {
    rank: 6,
    name: '2% Milk',
    emoji: '🥛',
    sugar: '~3g',
    sugarNum: 3,
    note: 'Starbucks default milk. Natural lactose only, slightly lighter than whole milk.',
    level: 'low',
  },
  {
    rank: 7,
    name: 'Nonfat Milk',
    emoji: '🥛',
    sugar: '~3.2g',
    sugarNum: 3.2,
    note: 'Slightly more sugar per serving than whole milk due to higher lactose concentration.',
    level: 'low',
  },
  {
    rank: 8,
    name: 'Soy Milk',
    emoji: '🫘',
    sugar: '~3.5g',
    sugarNum: 3.5,
    note: 'Contains added cane sugar. Higher in protein than other plant milks.',
    level: 'low',
  },
  {
    rank: 9,
    name: 'Oat Milk',
    emoji: '🌾',
    sugar: '~4g',
    sugarNum: 4,
    note: 'Highest added sugar among plant milks. Oats are naturally high in carbohydrates.',
    level: 'moderate',
    warning: true,
  },
  {
    rank: 10,
    name: 'Coconut Milk',
    emoji: '🥥',
    sugar: '~4g',
    sugarNum: 4,
    note: 'Contains added sugar. Light and slightly sweet flavour. Tied with oat milk for most sugar.',
    level: 'moderate',
    warning: true,
  },
];

const LEVEL_COLORS = {
  zero:     { color: '#00c975', bg: 'rgba(0,201,117,0.12)', label: 'Zero' },
  low:      { color: '#ffc94d', bg: 'rgba(255,201,77,0.12)', label: 'Low' },
  moderate: { color: '#ff9f43', bg: 'rgba(255,159,67,0.12)', label: 'Moderate' },
};

function SugarBar({ sugarNum }) {
  const max = 5;
  const pct = Math.min(sugarNum / max, 1) * 100;
  const col = sugarNum === 0 ? '#00c975' : sugarNum < 2 ? '#00c975' : sugarNum < 3.5 ? '#ffc94d' : '#ff9f43';
  return (
    <View style={mg.barTrack}>
      <View style={[mg.barFill, { width: `${pct}%`, backgroundColor: col }]} />
    </View>
  );
}

export default function MilkGuideScreen({ navigation }) {
  return (
    <SafeAreaView style={mg.safe} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.bg} />

      <View style={mg.nav}>
        <TouchableOpacity style={mg.backBtn} onPress={() => navigation.goBack()}>
          <Text style={mg.backArrow}>‹</Text>
          <Text style={mg.backLabel}>Back</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={mg.scroll} showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <View style={mg.hero}>
          <Text style={mg.heroEmoji}>🥛</Text>
          <Text style={mg.heroTitle}>Milk Sugar Guide</Text>
          <Text style={mg.heroSub}>
            All Starbucks plant-based milks contain added sugar. Here's every option ranked from lowest to highest sugar per serving.
          </Text>
        </View>

        {/* Key tip */}
        <View style={mg.tipBox}>
          <Text style={mg.tipTitle}>💡 Best swap for zero sugar</Text>
          <Text style={mg.tipBody}>
            Ask for <Text style={mg.tipBold}>heavy cream</Text> instead of milk in any latte or cold brew. It adds richness with virtually no sugar and keeps your drink in true zero-sugar territory.
          </Text>
        </View>

        <Text style={mg.listHeader}>Ranked: Lowest → Highest Sugar</Text>

        {MILKS.map((milk) => {
          const lv = LEVEL_COLORS[milk.level];
          return (
            <View key={milk.rank} style={mg.card}>
              <View style={mg.cardTop}>
                <View style={mg.rankBadge}>
                  <Text style={mg.rankText}>{milk.rank}</Text>
                </View>
                <Text style={mg.milkEmoji}>{milk.emoji}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={mg.milkName}>{milk.name}</Text>
                  <View style={mg.sugarRow}>
                    <Text style={[mg.sugarAmt, { color: lv.color }]}>{milk.sugar} sugar</Text>
                    <View style={[mg.levelPill, { backgroundColor: lv.bg }]}>
                      <Text style={[mg.levelPillText, { color: lv.color }]}>{lv.label}</Text>
                    </View>
                  </View>
                </View>
              </View>
              <SugarBar sugarNum={milk.sugarNum} />
              <Text style={mg.milkNote}>{milk.note}</Text>
              {milk.warning && (
                <View style={mg.warnRow}>
                  <Text style={mg.warnText}>⚠️ Contains added sugar</Text>
                </View>
              )}
            </View>
          );
        })}

        {/* Footer note */}
        <View style={mg.footerBox}>
          <Text style={mg.footerText}>
            Sugar values are approximate per standard serving (¼ cup milk / splash of cream) and may vary by drink size. Always verify with your barista for allergen or dietary needs.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const mg = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  nav: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  backBtn: { flexDirection: 'row', alignItems: 'center' },
  backArrow: { fontSize: 26, color: colors.green, marginRight: 4, lineHeight: 30 },
  backLabel: { fontSize: 17, color: colors.green, fontWeight: '600' },

  scroll: { padding: 16, paddingBottom: 48 },

  hero: { alignItems: 'center', paddingVertical: 24 },
  heroEmoji: { fontSize: 52, marginBottom: 12 },
  heroTitle: { fontSize: 26, fontWeight: '700', color: colors.text, marginBottom: 8, letterSpacing: -0.3 },
  heroSub: { fontSize: 14, color: colors.muted, textAlign: 'center', lineHeight: 22, paddingHorizontal: 8 },

  tipBox: {
    backgroundColor: 'rgba(0,168,98,0.08)', borderWidth: 1,
    borderColor: 'rgba(0,168,98,0.25)', borderRadius: 14,
    padding: 16, marginBottom: 24,
  },
  tipTitle: { fontSize: 14, fontWeight: '700', color: colors.green, marginBottom: 6 },
  tipBody: { fontSize: 14, color: colors.text, lineHeight: 21 },
  tipBold: { fontWeight: '700', color: colors.green },

  listHeader: {
    fontSize: 11, fontWeight: '700', letterSpacing: 1.2,
    textTransform: 'uppercase', color: colors.green, marginBottom: 12,
  },

  card: {
    backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border,
    borderRadius: 14, padding: 14, marginBottom: 10,
  },
  cardTop: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  rankBadge: {
    width: 24, height: 24, borderRadius: 12,
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    alignItems: 'center', justifyContent: 'center', marginRight: 10,
  },
  rankText: { fontSize: 11, fontWeight: '700', color: colors.muted },
  milkEmoji: { fontSize: 24, marginRight: 10, width: 30, textAlign: 'center' },
  milkName: { fontSize: 15, fontWeight: '600', color: colors.text, marginBottom: 4 },
  sugarRow: { flexDirection: 'row', alignItems: 'center' },
  sugarAmt: { fontSize: 13, fontWeight: '700', marginRight: 8 },
  levelPill: { borderRadius: 8, paddingHorizontal: 7, paddingVertical: 2 },
  levelPillText: { fontSize: 10, fontWeight: '700' },

  barTrack: {
    height: 4, backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 2, marginBottom: 10,
  },
  barFill: { height: 4, borderRadius: 2 },

  milkNote: { fontSize: 13, color: colors.muted, lineHeight: 19 },
  warnRow: { marginTop: 8 },
  warnText: { fontSize: 12, color: '#ffc94d' },

  footerBox: {
    marginTop: 8, padding: 14,
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    borderRadius: 12,
  },
  footerText: { fontSize: 12, color: colors.muted, lineHeight: 18, textAlign: 'center' },
});
