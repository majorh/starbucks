import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../data/theme';

const TRAPS = [
  {
    id: 'iced_coffee',
    emoji: '☕',
    title: 'Iced Coffee is Pre-Sweetened',
    severity: 'high',
    sugar: '~25g in a Grande',
    body: 'Plain Iced Coffee at Starbucks comes with Classic syrup by default — 4 pumps in a Grande, adding about 20g of sugar before you even customise it. Most people have no idea.',
    fix: 'Order "Iced Coffee, no classic syrup" or "Iced Coffee, unsweetened." You can add a splash of sugar-free vanilla to keep a hint of sweetness.',
  },
  {
    id: 'matcha',
    emoji: '🍵',
    title: 'Matcha Contains Added Sugar',
    severity: 'high',
    sugar: '~28g in a Grande latte',
    body: "Starbucks' matcha powder blend contains sugar as its second ingredient. There is currently no sugar-free matcha option at Starbucks — the sugar is built into the powder itself, not added separately.",
    fix: 'There is no way to order a truly zero-sugar matcha at Starbucks. Order a green tea (bag) instead for a zero-sugar alternative.',
  },
  {
    id: 'chai',
    emoji: '🌶️',
    title: 'Chai Concentrate is Mostly Sugar',
    severity: 'high',
    sugar: '~42g in a Grande latte',
    body: "Starbucks chai lattes use a pre-sweetened concentrate — not brewed chai tea. A Grande contains about 4 pumps of concentrate, each with ~5g of sugar, plus the milk.",
    fix: 'Order a "Chai Tea Bag" drink — ask for 2 chai tea bags steeped in hot water or milk. Zero sugar from the chai itself. Add sugar-free vanilla if you want sweetness.',
  },
  {
    id: 'refreshers',
    emoji: '🍋',
    title: 'Refreshers Cannot Be Made Sugar-Free',
    severity: 'high',
    sugar: '~20g in a Grande',
    body: "Starbucks Refreshers use a pre-sweetened base that contains sugar. Unlike syrups, this can't be removed or substituted. There is no way to order a Refresher without sugar.",
    fix: 'Skip Refreshers entirely if you are avoiding sugar. Iced green tea or iced black tea (unsweetened) are the closest zero-sugar alternatives.',
  },
  {
    id: 'skinny',
    emoji: '⚠️',
    title: '"Skinny" Doesn\'t Mean Sugar-Free',
    severity: 'medium',
    sugar: 'Varies',
    body: '"Skinny" at Starbucks means the drink uses sugar-free syrup and nonfat milk — but nonfat milk still contains natural lactose (~13g per cup). A "skinny latte" is lower sugar than a regular latte, but it is not zero sugar.',
    fix: 'Ask for "sugar-free syrup + heavy cream" instead of "skinny" for the lowest possible sugar version of a flavoured latte.',
  },
  {
    id: 'oat_milk',
    emoji: '🌾',
    title: 'Oat Milk Has the Most Added Sugar',
    severity: 'medium',
    sugar: '+4g per serving',
    body: "Oat milk is popular but it's the highest-sugar plant milk at Starbucks. Oats naturally convert to sugar, and Starbucks' oat milk adds about 4g of sugar per serving — more than whole dairy milk.",
    fix: 'Choose heavy cream (0.4g), almond milk (1.3g), or whole milk (3g) for a lower-sugar milk option.',
  },
  {
    id: 'frappuccino',
    emoji: '🥤',
    title: 'Frappuccinos Are Dessert, Not Coffee',
    severity: 'high',
    sugar: '50–70g in a Grande',
    body: 'A Grande Caramel Frappuccino contains about 50g of sugar — more than a can of Coke. The base syrup, milk, and toppings all add sugar. There is no zero-sugar Frappuccino option.',
    fix: 'Skip Frappuccinos entirely. For a cold, creamy fix try a Cold Brew with a splash of heavy cream instead — 0g sugar.',
  },
  {
    id: 'default_pumps',
    emoji: '💉',
    title: 'Larger Sizes Get More Syrup Automatically',
    severity: 'medium',
    sugar: '+5–10g going from Tall → Venti',
    body: 'Starbucks scales syrup pumps with drink size automatically. A Tall gets 3 pumps, Grande gets 4, and Venti hot gets 5 (iced Venti gets 6). Each pump is 5g of sugar — so a Venti has 10g more sugar than a Tall before you add anything.',
    fix: 'Always specify your pump count when ordering any sized drink with syrup. Say "Grande latte with 2 pumps of sugar-free vanilla" not just "Grande sugar-free vanilla latte."',
  },
  {
    id: 'classic_syrup',
    emoji: '🍬',
    title: 'Classic Syrup is Invisible Sugar',
    severity: 'medium',
    sugar: '5g per pump',
    body: 'Classic syrup is Starbucks\' simple syrup — pure sugar and water. It\'s added to shaken iced teas, lemonades, and iced coffees by default. It has no flavour of its own so you often can\'t taste it, but it adds significant sugar.',
    fix: 'Always ask for "no classic" on any iced tea, iced coffee, or shaken beverage. It\'s always added unless you say otherwise.',
  },
];

const SEVERITY_COLORS = {
  high:   { color: '#ff6b6b', bg: 'rgba(255,107,107,0.1)', border: 'rgba(255,107,107,0.25)', label: 'High Sugar Trap' },
  medium: { color: '#ffc94d', bg: 'rgba(255,201,77,0.1)',  border: 'rgba(255,201,77,0.25)',  label: 'Watch Out' },
};

function TrapCard({ trap }) {
  const [open, setOpen] = useState(false);
  const sev = SEVERITY_COLORS[trap.severity];

  return (
    <TouchableOpacity
      style={[styles.card, { borderColor: sev.border, backgroundColor: sev.bg }]}
      onPress={() => setOpen((v) => !v)}
      activeOpacity={0.8}
    >
      <View style={styles.cardTop}>
        <Text style={styles.cardEmoji}>{trap.emoji}</Text>
        <View style={{ flex: 1 }}>
          <Text style={[styles.cardTitle, { color: sev.color }]}>{trap.title}</Text>
          <View style={styles.cardMeta}>
            <View style={[styles.sevBadge, { backgroundColor: sev.bg, borderColor: sev.border }]}>
              <Text style={[styles.sevText, { color: sev.color }]}>{sev.label}</Text>
            </View>
            <Text style={styles.sugarAmt}>{trap.sugar}</Text>
          </View>
        </View>
        <Text style={[styles.chevron, { color: sev.color }]}>{open ? '▾' : '▸'}</Text>
      </View>

      {open && (
        <View style={styles.cardBody}>
          <Text style={styles.bodyText}>{trap.body}</Text>
          <View style={styles.fixBox}>
            <Text style={styles.fixLabel}>✅  What to do instead</Text>
            <Text style={styles.fixText}>{trap.fix}</Text>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
}

export default function HiddenSugarScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.bg} />
      <View style={styles.nav}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backArrow}>‹</Text>
          <Text style={styles.backLabel}>Back</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <Text style={styles.heroEmoji}>🚨</Text>
          <Text style={styles.heroTitle}>Hidden Sugar Traps</Text>
          <Text style={styles.heroSub}>
            These popular Starbucks items contain more sugar than most people realise — often because it's added automatically and invisibly.
          </Text>
        </View>

        <Text style={styles.hint}>Tap any card to see the fix ▸</Text>

        {TRAPS.map((trap) => (
          <TrapCard key={trap.id} trap={trap} />
        ))}

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Sugar values are approximate for a Grande (16oz) serving. Amounts vary by size — use the Sugar Calculator tab to estimate your specific order.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
  heroSub: { fontSize: 14, color: colors.muted, textAlign: 'center', lineHeight: 22, paddingHorizontal: 8 },

  hint: { fontSize: 12, color: colors.muted, textAlign: 'center', marginBottom: 16 },

  card: {
    borderWidth: 1, borderRadius: 14, padding: 14, marginBottom: 10,
  },
  cardTop: { flexDirection: 'row', alignItems: 'flex-start' },
  cardEmoji: { fontSize: 24, marginRight: 12, marginTop: 2, width: 30, textAlign: 'center' },
  cardTitle: { fontSize: 15, fontWeight: '700', marginBottom: 6 },
  cardMeta: { flexDirection: 'row', alignItems: 'center' },
  sevBadge: { borderWidth: 1, borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2, marginRight: 8 },
  sevText: { fontSize: 10, fontWeight: '700' },
  sugarAmt: { fontSize: 12, color: colors.muted },
  chevron: { fontSize: 16, marginLeft: 8, marginTop: 2 },

  cardBody: { marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.06)' },
  bodyText: { fontSize: 14, color: colors.text, lineHeight: 21, marginBottom: 12 },
  fixBox: {
    backgroundColor: 'rgba(0,168,98,0.08)', borderWidth: 1,
    borderColor: 'rgba(0,168,98,0.2)', borderRadius: 10, padding: 12,
  },
  fixLabel: { fontSize: 12, fontWeight: '700', color: colors.green, marginBottom: 5 },
  fixText: { fontSize: 13, color: colors.text, lineHeight: 20 },

  footer: {
    marginTop: 8, padding: 14,
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 12,
  },
  footerText: { fontSize: 12, color: colors.muted, lineHeight: 18, textAlign: 'center' },
});
