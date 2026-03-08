import React, { useState, useMemo } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  StatusBar, TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../data/theme';

const TERMS = [
  { term: 'Classic Syrup', emoji: '🍬', body: 'Starbucks\' plain simple syrup — sugar dissolved in water. It has no flavour of its own and is added automatically to iced coffees, iced teas, and shaken beverages unless you say "no classic." Contains 5g of sugar per pump.' },
  { term: 'Pump', emoji: '💉', body: 'The unit baristas use to measure syrup. One pump is roughly 0.35 oz (10ml) and about 5g of sugar for regular syrups. Default pumps per size: Tall = 3, Grande = 4, Venti hot = 5, Venti iced = 6.' },
  { term: 'Sugar-Free Syrup', emoji: '✨', body: 'Starbucks currently offers Sugar-Free Vanilla and Sugar-Free Caramel (new 2026). These use sucralose (Splenda) instead of sugar. They add 0g of sugar but ~1g of carbs per pump from other ingredients.' },
  { term: 'Breve', emoji: '🫙', body: 'Replacing regular milk with half-and-half (half milk, half cream). Adds richness and slightly more fat, with slightly less sugar than full milk. Ask for "breve" when ordering any latte.' },
  { term: 'No Water', emoji: '💧', body: 'For tea-based drinks, asking for "no water" means the cup is filled entirely with milk or a milk alternative instead of part water. This increases the milk sugar content but makes the drink richer and creamier.' },
  { term: 'Blonde Roast', emoji: '☀️', body: 'A lighter roast espresso with slightly higher caffeine than Starbucks\' standard Signature espresso. Has the same 0g of sugar. Good to know if caffeine level matters to you.' },
  { term: 'Cold Foam', emoji: '☁️', body: 'Frothed nonfat milk poured on top of cold drinks. Standard cold foam contains about 3g of sugar from lactose. Sweet cream cold foam is much higher sugar and not recommended.' },
  { term: 'Sweet Cream', emoji: '🍦', body: 'A blend of heavy cream, milk, and vanilla syrup. Very high in sugar due to the vanilla syrup. Not to be confused with plain heavy cream, which has almost no sugar.' },
  { term: 'Shaken Espresso', emoji: '🥤', body: 'Espresso shaken with ice and (usually) Classic syrup. Always ask for "no classic syrup" or specify a sugar-free syrup when ordering. Shaking adds Classic by default in most Starbucks locations.' },
  { term: 'Nitro', emoji: '🫧', body: 'Cold brew infused with nitrogen gas, giving it a creamy, Guinness-like texture and a natural sweetness — with zero added sugar. One of the best zero-sugar options on the menu.' },
  { term: 'Misto', emoji: '🌫️', body: 'Half brewed coffee, half steamed milk. Lower in caffeine than a latte. Sugar comes only from the milk. Ask for heavy cream instead of milk for a near-zero-sugar version.' },
  { term: 'Americano', emoji: '🖤', body: 'Espresso shots diluted with hot water. Zero sugar, strong flavour, and one of the most straightforward low-sugar options. Add a splash of heavy cream if you want a creamier version.' },
  { term: 'Flat White', emoji: '🥛', body: 'A smaller, stronger espresso drink with micro-foamed whole milk. Less milk than a latte, so slightly less natural sugar. Zero added sugar if ordered plain.' },
  { term: 'Ristretto', emoji: '⚡', body: 'A shorter, more concentrated espresso shot made with less water. More intense flavour, slightly sweeter naturally. Used in some specialty drinks. Zero sugar.' },
  { term: 'Upside Down', emoji: '🙃', body: 'A modifier where the order of ingredients is reversed — usually espresso goes in last instead of first. Common with macchiatos. No effect on sugar content.' },
  { term: 'Pike Place', emoji: '☕', body: 'Starbucks\' standard medium roast drip coffee. Brewed fresh throughout the day. Zero sugar. One of the simplest zero-sugar options available.' },
  { term: 'Frappuccino', emoji: '🥤', body: 'Blended iced drinks made with a sweetened base syrup, milk, and ice. They cannot be made sugar-free — the base contains sugar that cannot be removed. Most contain 40–70g of sugar.' },
  { term: 'Refresher', emoji: '🍋', body: 'Fruit-flavoured cold drinks made with a pre-sweetened juice base and green coffee extract. Cannot be made sugar-free as the base contains added sugar. Avoid if minimising sugar.' },
  { term: 'Skinny', emoji: '📏', body: 'Starbucks shorthand for: sugar-free syrup + nonfat milk. A "skinny latte" uses SF syrup and nonfat milk but still contains ~13g of natural sugar from the milk. Lower sugar than regular, but not zero sugar.' },
  { term: 'No Classic', emoji: '🚫', body: 'The key phrase to add to any iced tea, iced coffee, or shaken beverage order. Without saying this, Classic syrup (sugar) is added automatically. Always say "no classic" when ordering unsweetened.' },
  { term: 'Heavy Cream', emoji: '🍶', body: 'The highest-fat, lowest-sugar dairy option at Starbucks. About 0.4g of sugar per splash compared to 3g for regular milk. Ask for "a splash of heavy cream" in any drink that calls for milk.' },
  { term: 'Concentrate (Chai)', emoji: '🌶️', body: 'The pre-made liquid used to make Starbucks chai lattes. It\'s sweetened with sugar as an ingredient — you can\'t get an unsweetened chai latte at Starbucks using this concentrate. Order chai tea bags instead.' },
];

export default function GlossaryScreen({ navigation }) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return TERMS;
    return TERMS.filter(
      (t) => t.term.toLowerCase().includes(q) || t.body.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <SafeAreaView style={gs.safe} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.bg} />
      <View style={gs.nav}>
        <TouchableOpacity style={gs.backBtn} onPress={() => navigation.goBack()}>
          <Text style={gs.backArrow}>‹</Text>
          <Text style={gs.backLabel}>Back</Text>
        </TouchableOpacity>
      </View>

      <View style={gs.searchWrap}>
        <Text style={gs.searchIcon}>🔍</Text>
        <TextInput
          style={gs.searchInput}
          placeholder="Search terms…"
          placeholderTextColor={colors.muted}
          value={query}
          onChangeText={setQuery}
          autoCorrect={false}
          autoCapitalize="none"
          clearButtonMode="while-editing"
        />
      </View>

      <ScrollView contentContainerStyle={gs.scroll} showsVerticalScrollIndicator={false}>
        <View style={gs.hero}>
          <Text style={gs.heroTitle}>📖 Ordering Glossary</Text>
          <Text style={gs.heroSub}>
            Every term you'll encounter when customising a Starbucks order, explained simply.
          </Text>
        </View>

        {filtered.length === 0 && (
          <Text style={gs.noResults}>No terms found</Text>
        )}

        {filtered.map((t) => (
          <View key={t.term} style={gs.card}>
            <View style={gs.cardTop}>
              <Text style={gs.termEmoji}>{t.emoji}</Text>
              <Text style={gs.termName}>{t.term}</Text>
            </View>
            <Text style={gs.termBody}>{t.body}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const gs = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  nav: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  backBtn: { flexDirection: 'row', alignItems: 'center' },
  backArrow: { fontSize: 26, color: colors.green, marginRight: 4, lineHeight: 30 },
  backLabel: { fontSize: 17, color: colors.green, fontWeight: '600' },

  searchWrap: {
    flexDirection: 'row', alignItems: 'center',
    margin: 16, marginBottom: 4,
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    borderRadius: 12, paddingHorizontal: 12,
  },
  searchIcon: { fontSize: 15, marginRight: 8 },
  searchInput: { flex: 1, color: colors.text, fontSize: 15, paddingVertical: 11 },

  scroll: { padding: 16, paddingBottom: 48 },
  hero: { marginBottom: 16 },
  heroTitle: { fontSize: 22, fontWeight: '700', color: colors.text, marginBottom: 6, letterSpacing: -0.3 },
  heroSub: { fontSize: 13, color: colors.muted, lineHeight: 20 },

  noResults: { color: colors.muted, textAlign: 'center', marginTop: 40 },

  card: {
    backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border,
    borderRadius: 14, padding: 14, marginBottom: 8,
  },
  cardTop: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  termEmoji: { fontSize: 18, marginRight: 10, width: 24, textAlign: 'center' },
  termName: { fontSize: 15, fontWeight: '700', color: colors.green },
  termBody: { fontSize: 13, color: colors.text, lineHeight: 20 },
});
