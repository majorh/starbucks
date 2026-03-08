import React, { useMemo } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../data/theme';
import { useFavorites } from '../context/FavoritesContext';
import { useDrinks } from '../context/DrinksContext';

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning \u2600\ufe0f';
  if (h < 17) return 'Good afternoon \u2600\ufe0f';
  return 'Good evening \uD83C\uDF19';
}

function SectionLabel({ text }) {
  return <Text style={styles.sectionLbl}>{text}</Text>;
}

function EntryCard({ icon, title, desc, count, onPress, style, titleStyle, countStyle }) {
  return (
    <TouchableOpacity style={[styles.card, style]} onPress={onPress} activeOpacity={0.75}>
      <Text style={styles.cardIcon}>{icon}</Text>
      <Text style={[styles.cardTitle, titleStyle]}>{title}</Text>
      {desc ? <Text style={styles.cardDesc}>{desc}</Text> : null}
      {count ? <Text style={[styles.cardCount, countStyle]}>{count}</Text> : null}
    </TouchableOpacity>
  );
}

function EntryCardFull({ icon, title, desc, count, onPress, style, countStyle }) {
  return (
    <TouchableOpacity style={[styles.cardFull, style]} onPress={onPress} activeOpacity={0.75}>
      <Text style={[styles.cardIcon, styles.cardIconFull]}>{icon}</Text>
      <View style={{ flex: 1 }}>
        <Text style={[styles.cardTitle, styles.cardTitleFull]}>{title}</Text>
        {desc ? <Text style={styles.cardDesc}>{desc}</Text> : null}
        {count ? <Text style={[styles.cardCount, countStyle]}>{count}</Text> : null}
      </View>
    </TouchableOpacity>
  );
}

export default function HomeScreen({ navigation }) {
  const { favorites } = useFavorites();
  const { allDrinks } = useDrinks();

  const hasFavorites = favorites.size > 0;
  const favCount = favorites.size;

  const coffeeDrinks = useMemo(
    () => allDrinks.filter((d) => ['hc', 'ic', 'cb'].includes(d.categoryId)),
    [allDrinks]
  );
  const teaDrinks = useMemo(
    () => allDrinks.filter((d) => ['ht', 'it', 'tl'].includes(d.categoryId)),
    [allDrinks]
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.surface} />

      <View style={styles.header}>
        <View style={styles.brandRow}>
          <View style={styles.logoBadge}>
            <Text style={styles.logoEmoji}>☕</Text>
          </View>
          <View>
            <Text style={styles.brandSup}>Starbucks</Text>
            <Text style={styles.brandMain}>Zero Sugar</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.searchBtn}
          onPress={() => navigation.navigate('Search')}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text style={styles.searchBtnIcon}>🔍</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <Text style={styles.heroGreeting}>{getGreeting()}</Text>
          <Text style={styles.heroTitle}>What are you ordering today?</Text>
          <Text style={styles.heroSubtitle}>Browse drinks, calculate sugar, and order with confidence.</Text>
        </View>

        {hasFavorites && (
          <>
            <SectionLabel text="Your Favourites" />
            <View style={styles.grid}>
              <EntryCardFull
                icon="❤️"
                title="My Favourites"
                desc="Your saved drinks, always one tap away"
                count={favCount + ' saved'}
                onPress={() => navigation.navigate('Favorites')}
                style={styles.cardFavStyle}
                countStyle={styles.countFav}
              />
            </View>
          </>
        )}

        <SectionLabel text="Drinks" />
        <View style={styles.grid}>
          <EntryCardFull
            icon="☕"
            title="All Drinks"
            desc="Browse the complete zero-sugar menu"
            count={allDrinks.length + ' drinks'}
            onPress={() => navigation.navigate('Drinks')}
            style={styles.cardAllStyle}
            countStyle={styles.countGreen}
          />
          <View style={styles.gridRow}>
            <EntryCard
              icon="🧊"
              title="Coffees"
              desc="Hot, iced & cold brew"
              count={coffeeDrinks.length + ' drinks'}
              onPress={() => navigation.navigate('Drinks', { filterCategory: 'coffee' })}
              style={styles.cardHalf}
              countStyle={styles.countGreen}
            />
            <EntryCard
              icon="🍵"
              title="Teas"
              desc="Hot, iced & lattes"
              count={teaDrinks.length + ' drinks'}
              onPress={() => navigation.navigate('Drinks', { filterCategory: 'tea' })}
              style={styles.cardHalf}
              countStyle={styles.countGreen}
            />
          </View>
        </View>

        <SectionLabel text="Tools & Tips" />
        <View style={styles.grid}>
          <View style={styles.gridRow}>
            <EntryCard
              icon="🚨"
              title="Sugar Traps"
              desc="Hidden sugar to avoid"
              count="9 traps"
              onPress={() => navigation.navigate('HiddenSugar')}
              style={[styles.cardHalf, styles.cardWarn]}
              titleStyle={styles.titleWarn}
              countStyle={styles.countWarn}
            />
            <EntryCard
              icon="🧮"
              title="Calculator"
              desc="Build & estimate any drink"
              count="Estimate sugar"
              onPress={() => navigation.navigate('Calculator')}
              style={styles.cardHalf}
              countStyle={styles.countGreen}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 32 },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 18, paddingVertical: 12,
    backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  logoBadge: {
    width: 38, height: 38, borderRadius: 19, backgroundColor: colors.green,
    alignItems: 'center', justifyContent: 'center',
  },
  logoEmoji: { fontSize: 18 },
  brandSup: { fontSize: 9, fontWeight: '700', letterSpacing: 2, color: colors.green, textTransform: 'uppercase' },
  brandMain: { fontSize: 19, fontWeight: '800', color: colors.text, letterSpacing: -0.3 },
  searchBtn: {
    width: 36, height: 36, borderRadius: 18, backgroundColor: colors.greenPale,
    borderWidth: 1, borderColor: colors.greenBorder, alignItems: 'center', justifyContent: 'center',
  },
  searchBtnIcon: { fontSize: 16 },
  hero: {
    backgroundColor: colors.green, paddingHorizontal: 20, paddingTop: 20, paddingBottom: 24,
  },
  heroGreeting: { fontSize: 13, fontWeight: '700', color: 'rgba(255,255,255,0.72)', marginBottom: 4 },
  heroTitle: { fontSize: 23, fontWeight: '800', color: '#fff', lineHeight: 29, letterSpacing: -0.3, marginBottom: 8 },
  heroSubtitle: { fontSize: 13, color: 'rgba(255,255,255,0.72)', lineHeight: 20 },
  sectionLbl: {
    fontSize: 11, fontWeight: '700', letterSpacing: 1.5, textTransform: 'uppercase',
    color: colors.green, paddingHorizontal: 16, paddingTop: 20, paddingBottom: 10,
  },
  grid: { paddingHorizontal: 14, gap: 9 },
  gridRow: { flexDirection: 'row', gap: 9 },
  card: {
    flex: 1, backgroundColor: colors.surface, borderRadius: 16,
    borderWidth: 1, borderColor: colors.border, padding: 15,
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 3, shadowOffset: { width: 0, height: 1 }, elevation: 1,
  },
  cardHalf: { flex: 1 },
  cardFull: {
    backgroundColor: colors.surface, borderRadius: 16,
    borderWidth: 1, borderColor: colors.border, padding: 15,
    flexDirection: 'row', alignItems: 'center', gap: 14,
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 3, shadowOffset: { width: 0, height: 1 }, elevation: 1,
  },
  cardIcon: { fontSize: 28, marginBottom: 9 },
  cardIconFull: { fontSize: 30, marginBottom: 0 },
  cardTitle: { fontSize: 14, fontWeight: '700', color: colors.text, marginBottom: 3 },
  cardTitleFull: { fontSize: 16 },
  cardDesc: { fontSize: 11, color: colors.muted, lineHeight: 16 },
  cardCount: {
    marginTop: 7, fontSize: 10, fontWeight: '700', color: colors.green,
    backgroundColor: colors.greenPale, borderWidth: 1, borderColor: colors.greenBorder,
    borderRadius: 9, paddingHorizontal: 8, paddingVertical: 2, alignSelf: 'flex-start',
  },
  cardFavStyle: { backgroundColor: '#fff8f0', borderColor: '#fde8c8' },
  cardAllStyle: { backgroundColor: colors.greenPale, borderColor: colors.greenBorder },
  cardWarn:     { backgroundColor: colors.warnBg, borderColor: colors.warnBorder },
  countGreen:   { color: colors.green, backgroundColor: colors.greenPale, borderColor: colors.greenBorder },
  countFav:     { color: '#c07020', backgroundColor: '#fff0e0', borderColor: '#fdd9a8' },
  countWarn:    { color: colors.warn, backgroundColor: colors.warnBg, borderColor: colors.warnBorder },
  titleWarn:    { color: colors.warn },
});
