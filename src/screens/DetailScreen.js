import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  StatusBar, Share, Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../data/theme';
import { useFavorites } from '../context/FavoritesContext';
import Tag from '../components/Tag';
import SugarPill from '../components/SugarPill';

// Build a Starbucks app deep link for a given drink name.
// Falls back to opening the Starbucks app home if no specific URL is found.
function getStarbucksURL(drink) {
  // Starbucks supports a product search deep link
  const encoded = encodeURIComponent(drink.name);
  return `starbucks://app/menu/search?query=${encoded}`;
}

export default function DetailScreen({ route, navigation }) {
  const { drink } = route.params;
  const { isFavorite, toggleFavorite } = useFavorites();
  const fav = isFavorite(drink.id);

  const openStarbucks = async () => {
    const deepLink = getStarbucksURL(drink);
    const appHome = 'starbucks://';
    const appStore = 'https://apps.apple.com/us/app/starbucks/id331177714';

    try {
      const canDeepLink = await Linking.canOpenURL(deepLink);
      if (canDeepLink) {
        await Linking.openURL(deepLink);
        return;
      }
      const canOpenApp = await Linking.canOpenURL(appHome);
      await Linking.openURL(canOpenApp ? appHome : appStore);
    } catch {
      Linking.openURL(appStore);
    }
  };

  const shareOrder = () => {
    Share.share({
      title: `Zero Sugar Starbucks: ${drink.name}`,
      message: `☕ ${drink.name}\n\n${drink.desc}\n\nHow to order:\n${drink.order}\n\nIn the Starbucks app:\n${drink.app}`,
    });
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.bg} />

      {/* Nav bar */}
      <View style={styles.nav}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backArrow}>‹</Text>
          <Text style={styles.backLabel}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.heartBtn}
          onPress={() => toggleFavorite(drink.id)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={styles.heartIcon}>{fav ? '❤️' : '🤍'}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}
        <View style={styles.hero}>
          <Text style={styles.heroEmoji}>{drink.emoji}</Text>
          <Text style={[styles.heroName, drink.tags.includes('m') && styles.heroNameMod]}>
            {drink.name}
          </Text>
          <View style={styles.heroTags}>
            {drink.tags.map((t) => <Tag key={t} id={t} />)}
          </View>
          <SugarPill label={drink.sugarLabel} level={drink.sugarLevel} />
          <Text style={styles.desc}>{drink.desc}</Text>
        </View>

        {/* Milk note with link to guide */}
        {drink.milkNote && (
          <TouchableOpacity
            style={styles.milkBox}
            onPress={() => navigation.navigate('MilkGuide')}
            activeOpacity={0.75}
          >
            <View style={styles.milkBoxRow}>
              <Text style={styles.milkBoxText}>
                <Text style={styles.milkBoxBold}>🥛  Milk note: </Text>
                {drink.milkNote}
              </Text>
              <Text style={styles.milkBoxLink}>Guide ›</Text>
            </View>
          </TouchableOpacity>
        )}

        <Text style={styles.sectionLabel}>How to order</Text>
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>{drink.order}</Text>
        </View>

        <Text style={styles.sectionLabel}>In the Starbucks App</Text>
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>{drink.app}</Text>
        </View>

        {drink.note && (
          <View style={styles.warnBox}>
            <Text style={styles.warnText}>{drink.note}</Text>
          </View>
        )}

        <TouchableOpacity style={styles.btnPrimary} onPress={openStarbucks} activeOpacity={0.85}>
          <Text style={styles.btnPrimaryText}>☕  Open in Starbucks App</Text>
        </TouchableOpacity>
        <View style={styles.secondaryRow}>
          <TouchableOpacity style={styles.btnSecondary} onPress={shareOrder} activeOpacity={0.7}>
            <Text style={styles.btnSecondaryText}>📤  Share Order</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  nav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backBtn: { flexDirection: 'row', alignItems: 'center' },
  backArrow: { fontSize: 26, color: colors.green, marginRight: 4, lineHeight: 30 },
  backLabel: { fontSize: 17, color: colors.green, fontWeight: '600' },
  heartBtn: { padding: 4 },
  heartIcon: { fontSize: 24 },
  scroll: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 48 },
  hero: {
    alignItems: 'center',
    paddingBottom: 28,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    marginBottom: 28,
  },
  heroEmoji: { fontSize: 72, marginBottom: 16 },
  heroName: {
    fontSize: 28, fontWeight: '700', color: colors.cream,
    textAlign: 'center', lineHeight: 34, marginBottom: 12, letterSpacing: -0.3,
  },
  heroNameMod: { color: colors.greenLight },
  heroTags: {
    flexDirection: 'row', flexWrap: 'wrap',
    justifyContent: 'center', marginBottom: 10,
  },
  desc: {
    fontSize: 16, color: colors.muted, lineHeight: 24,
    marginTop: 14, textAlign: 'left', alignSelf: 'stretch',
  },
  milkBox: {
    backgroundColor: 'rgba(0,168,98,0.07)',
    borderWidth: 1, borderColor: 'rgba(0,168,98,0.2)',
    borderRadius: 14, padding: 14, marginBottom: 24,
  },
  milkBoxRow: { flexDirection: 'row', alignItems: 'flex-start' },
  milkBoxText: { flex: 1, fontSize: 15, color: colors.cream, lineHeight: 22 },
  milkBoxBold: { color: colors.greenLight, fontWeight: '700' },
  milkBoxLink: { fontSize: 13, color: colors.greenLight, fontWeight: '700', marginLeft: 8, marginTop: 2 },
  sectionLabel: {
    fontSize: 11, fontWeight: '700', letterSpacing: 1.2,
    textTransform: 'uppercase', color: colors.green, marginBottom: 10,
  },
  infoBox: {
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    borderRadius: 14, padding: 16, marginBottom: 24,
  },
  infoText: { fontSize: 16, color: colors.cream, lineHeight: 24 },
  warnBox: {
    backgroundColor: 'rgba(255,180,0,0.06)',
    borderLeftWidth: 3, borderLeftColor: 'rgba(255,180,0,0.5)',
    paddingVertical: 12, paddingHorizontal: 14, marginBottom: 24, borderRadius: 4,
  },
  warnText: { fontSize: 14, color: colors.muted, lineHeight: 21 },
  btnPrimary: {
    backgroundColor: colors.green, borderRadius: 14,
    paddingVertical: 16, alignItems: 'center', marginBottom: 12,
  },
  btnPrimaryText: { color: '#000', fontSize: 17, fontWeight: '700' },
  secondaryRow: { flexDirection: 'row' },
  btnSecondary: {
    flex: 1, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    borderRadius: 14, paddingVertical: 14, alignItems: 'center',
  },
  btnSecondaryText: { color: colors.cream, fontSize: 15, fontWeight: '500' },
});
