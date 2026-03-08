import React from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../data/theme';

const FOOD_ITEMS = [
  {
    category: '🥚 Egg Bites',
    items: [
      { name: 'Bacon & Gruyère Egg Bites', emoji: '🥓', sugar: '2g', protein: '19g', carbs: '9g', cal: '300', verdict: 'best', note: 'Best keto option. High protein, very low carb.' },
      { name: 'Kale & Mushroom Egg Bites', emoji: '🥦', sugar: '1g', protein: '15g', carbs: '11g', cal: '230', verdict: 'best', note: 'Lowest sugar of all egg bites. Great veggie option.' },
      { name: 'Egg White & Red Pepper Bites', emoji: '🫑', sugar: '3g', protein: '12g', carbs: '11g', cal: '170', verdict: 'good', note: 'Lightest option. Good for lower calorie goals.' },
    ],
  },
  {
    category: '🥗 Protein & Snacks',
    items: [
      { name: 'Eggs & Cheddar Protein Box', emoji: '🧀', sugar: '5g', protein: '23g', carbs: '28g', cal: '470', verdict: 'good', note: 'High protein. Carbs come from the apple and bread — skip those for lower sugar.' },
      { name: 'Grilled Chicken Salad', emoji: '🥗', sugar: '3g', protein: '21g', carbs: '15g', cal: '390', verdict: 'good', note: 'Hold the dressing to reduce sugar further.' },
      { name: 'String Cheese (packaged)', emoji: '🧀', sugar: '0g', protein: '7g', carbs: '0g', cal: '80', verdict: 'best', note: 'Perfect zero-sugar snack. Found near register.' },
      { name: 'Beef Jerky (packaged)', emoji: '🥩', sugar: '3g', protein: '9g', carbs: '5g', cal: '80', verdict: 'good', note: 'High protein, but watch sodium if that\'s a concern.' },
    ],
  },
  {
    category: '⚠️ Avoid or Modify',
    items: [
      { name: 'Butter Croissant', emoji: '🥐', sugar: '6g', protein: '5g', carbs: '31g', cal: '270', verdict: 'avoid', note: 'High carb, low protein. Spikes blood sugar quickly.' },
      { name: 'Banana Nut Bread', emoji: '🍌', sugar: '21g', protein: '4g', carbs: '38g', cal: '420', verdict: 'avoid', note: '21g sugar — nearly as much as a candy bar.' },
      { name: 'Classic Coffee Cake', emoji: '🎂', sugar: '29g', protein: '4g', carbs: '51g', cal: '370', verdict: 'avoid', note: 'Very high sugar. Skip entirely.' },
      { name: 'Chocolate Chip Cookie', emoji: '🍪', sugar: '26g', protein: '3g', carbs: '45g', cal: '360', verdict: 'avoid', note: 'Dessert, not a snack.' },
      { name: 'Spinach Feta Wrap', emoji: '🌯', sugar: '5g', protein: '20g', carbs: '34g', cal: '290', verdict: 'modify', note: 'Good protein but high carb from the wrap. Order egg bites instead for a lower-carb alternative.' },
    ],
  },
];

const VERDICT_STYLES = {
  best:   { color: '#00c975', bg: 'rgba(0,201,117,0.12)', border: 'rgba(0,201,117,0.25)', label: '✓ Best Choice' },
  good:   { color: '#ffc94d', bg: 'rgba(255,201,77,0.12)', border: 'rgba(255,201,77,0.25)', label: '~ Good Choice' },
  modify: { color: '#ff9f43', bg: 'rgba(255,159,67,0.12)', border: 'rgba(255,159,67,0.25)', label: '⚡ Modify Order' },
  avoid:  { color: '#ff6b6b', bg: 'rgba(255,107,107,0.1)', border: 'rgba(255,107,107,0.2)', label: '✕ Avoid' },
};

function MacroPill({ label, value, highlight }) {
  return (
    <View style={[fp.macroPill, highlight && fp.macroPillHighlight]}>
      <Text style={[fp.macroVal, highlight && fp.macroValHighlight]}>{value}</Text>
      <Text style={fp.macroLabel}>{label}</Text>
    </View>
  );
}

function FoodCard({ item }) {
  const v = VERDICT_STYLES[item.verdict];
  return (
    <View style={[fp.card, { borderColor: v.border }]}>
      <View style={fp.cardTop}>
        <Text style={fp.itemEmoji}>{item.emoji}</Text>
        <View style={{ flex: 1 }}>
          <Text style={fp.itemName}>{item.name}</Text>
          <View style={[fp.verdictBadge, { backgroundColor: v.bg, borderColor: v.border }]}>
            <Text style={[fp.verdictText, { color: v.color }]}>{v.label}</Text>
          </View>
        </View>
      </View>
      <View style={fp.macroRow}>
        <MacroPill label="sugar" value={item.sugar} highlight={item.verdict === 'best' || item.verdict === 'good'} />
        <MacroPill label="protein" value={item.protein} />
        <MacroPill label="carbs" value={item.carbs} />
        <MacroPill label="cal" value={item.cal} />
      </View>
      <Text style={fp.noteText}>{item.note}</Text>
    </View>
  );
}

export default function FoodScreen({ navigation }) {
  return (
    <SafeAreaView style={fp.safe} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.bg} />
      <View style={fp.nav}>
        <TouchableOpacity style={fp.backBtn} onPress={() => navigation.goBack()}>
          <Text style={fp.backArrow}>‹</Text>
          <Text style={fp.backLabel}>Back</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={fp.scroll} showsVerticalScrollIndicator={false}>
        <View style={fp.hero}>
          <Text style={fp.heroEmoji}>🍽️</Text>
          <Text style={fp.heroTitle}>Food Pairings</Text>
          <Text style={fp.heroSub}>
            Pairing your low-sugar drink with a high-protein food helps stabilise blood sugar and keeps you full longer. Here's what to order — and what to avoid.
          </Text>
        </View>

        <View style={fp.tipBox}>
          <Text style={fp.tipTitle}>💡 Blood Sugar Tip</Text>
          <Text style={fp.tipBody}>
            Eating protein or fat alongside caffeine slows glucose absorption and prevents the sugar crash that follows high-carb pastries. Egg bites + black coffee is one of the best combinations at Starbucks for sustained energy.
          </Text>
        </View>

        {FOOD_ITEMS.map((group) => (
          <View key={group.category}>
            <Text style={fp.groupHeader}>{group.category}</Text>
            {group.items.map((item) => (
              <FoodCard key={item.name} item={item} />
            ))}
          </View>
        ))}

        <View style={fp.footer}>
          <Text style={fp.footerText}>
            Nutritional values are approximate and sourced from Starbucks' 2025/2026 menu data. Values may vary slightly by location and preparation.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const fp = StyleSheet.create({
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

  hero: { alignItems: 'center', paddingVertical: 20 },
  heroEmoji: { fontSize: 52, marginBottom: 12 },
  heroTitle: { fontSize: 26, fontWeight: '700', color: colors.text, marginBottom: 8, letterSpacing: -0.3 },
  heroSub: { fontSize: 14, color: colors.muted, textAlign: 'center', lineHeight: 22, paddingHorizontal: 4 },

  tipBox: {
    backgroundColor: 'rgba(0,168,98,0.08)', borderWidth: 1,
    borderColor: 'rgba(0,168,98,0.25)', borderRadius: 14,
    padding: 16, marginBottom: 20,
  },
  tipTitle: { fontSize: 14, fontWeight: '700', color: colors.green, marginBottom: 6 },
  tipBody: { fontSize: 14, color: colors.text, lineHeight: 21 },

  groupHeader: {
    fontSize: 16, fontWeight: '700', color: colors.text,
    marginBottom: 10, marginTop: 4,
  },

  card: {
    backgroundColor: colors.card, borderWidth: 1,
    borderRadius: 14, padding: 14, marginBottom: 10,
  },
  cardTop: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10 },
  itemEmoji: { fontSize: 26, marginRight: 12, width: 32, textAlign: 'center' },
  itemName: { fontSize: 14, fontWeight: '600', color: colors.text, marginBottom: 5 },
  verdictBadge: { alignSelf: 'flex-start', borderWidth: 1, borderRadius: 6, paddingHorizontal: 7, paddingVertical: 2 },
  verdictText: { fontSize: 10, fontWeight: '700' },

  macroRow: { flexDirection: 'row', marginBottom: 10 },
  macroPill: {
    flex: 1, alignItems: 'center',
    backgroundColor: colors.surface, borderRadius: 8,
    paddingVertical: 6, marginRight: 6,
    borderWidth: 1, borderColor: colors.border,
  },
  macroPillHighlight: { backgroundColor: 'rgba(0,201,117,0.08)', borderColor: 'rgba(0,201,117,0.2)' },
  macroVal: { fontSize: 13, fontWeight: '700', color: colors.text, marginBottom: 2 },
  macroValHighlight: { color: '#00c975' },
  macroLabel: { fontSize: 9, color: colors.muted, textTransform: 'uppercase', letterSpacing: 0.5 },

  noteText: { fontSize: 12, color: colors.muted, lineHeight: 18 },

  footer: {
    marginTop: 8, padding: 14,
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 12,
  },
  footerText: { fontSize: 12, color: colors.muted, lineHeight: 18, textAlign: 'center' },
});
