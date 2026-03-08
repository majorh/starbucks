import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  Dimensions, StatusBar, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '../data/theme';
import { setupLocationFeature } from '../services/locationService';

const { width: SCREEN_W } = Dimensions.get('window');
export const ONBOARDING_KEY = 'onboarding_complete_v2';

// ─── Individual slide content ─────────────────────────────────────────────────

const slides = [
  {
    key: 'welcome',
    accentColor: colors.green,
    iconBg: colors.greenPale,
    iconBorder: colors.greenBorder,
    icon: '☕',
    eyebrow: 'Welcome',
    eyebrowColor: colors.green,
    title: 'Your guide to\nzero-sugar Starbucks',
    body: 'Starbucks has dozens of drinks you can enjoy with little or no sugar — if you know how to order them. This app shows you exactly how.',
  },
  {
    key: 'howItWorks',
    accentColor: colors.green,
    iconBg: colors.warnBg,
    iconBorder: colors.warnBorder,
    icon: '🧭',
    eyebrow: 'How It Works',
    eyebrowColor: colors.green,
    title: 'Browse, calculate,\nand order smarter',
    features: [
      { icon: '☕', title: 'Browse all zero-sugar drinks', desc: 'Filter by type, sugar level, or caffeine content' },
      { icon: '🧮', title: 'Calculate sugar for any drink', desc: 'Build a custom order and see the exact sugar estimate' },
      { icon: '❤️', title: 'Save your favourites', desc: 'One tap to save, always on your home screen' },
    ],
  },
  {
    key: 'noClassic',
    accentColor: colors.red,
    iconBg: colors.redBg,
    iconBorder: colors.redBorder,
    icon: '🚨',
    eyebrow: 'Key Tip',
    eyebrowColor: colors.red,
    title: 'Always say\n"no classic syrup"',
    body: 'Starbucks adds Classic syrup automatically to iced coffees and teas — that\'s 20g of hidden sugar in a Grande before you\'ve added anything.',
    tipTitle: 'Every time you order iced coffee or iced tea:',
    tipLines: [
      { label: 'Say', value: '"no classic syrup"' },
      { label: 'Or ask for', value: '"sugar-free vanilla"' },
    ],
  },
  {
    key: 'location',
    accentColor: '#4a6fa5',
    iconBg: '#e8f0ff',
    iconBorder: '#c0d0f0',
    icon: '📍',
    eyebrow: 'Optional Feature',
    eyebrowColor: '#4a6fa5',
    title: 'Get a nudge when\nyou\'re at Starbucks',
    body: "When you arrive at a Starbucks, we'll send a quick reminder with your favourite zero-sugar order — so you never forget to ask for it right.",
    notifPreview: {
      title: "You're at Starbucks! ☕",
      body: 'Your go-to: Iced SF Vanilla Latte, no classic syrup.',
    },
    disclaimer: '📍 Only used to detect Starbucks locations.\nNever shared. You can turn this off anytime in Settings.',
  },
];

// ─── Dot indicator ────────────────────────────────────────────────────────────

function Dots({ total, current }) {
  return (
    <View style={styles.dots}>
      {Array.from({ length: total }).map((_, i) => (
        <View
          key={i}
          style={[styles.dot, i === current && styles.dotActive]}
        />
      ))}
    </View>
  );
}

// ─── Feature row (slide 2) ────────────────────────────────────────────────────

function FeatureRow({ icon, title, desc }) {
  return (
    <View style={styles.featureRow}>
      <View style={styles.featureIcon}>
        <Text style={styles.featureIconText}>{icon}</Text>
      </View>
      <View style={styles.featureBody}>
        <Text style={styles.featureTitle}>{title}</Text>
        <Text style={styles.featureDesc}>{desc}</Text>
      </View>
    </View>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function OnboardingScreen({ onComplete }) {
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);
  const slide = slides[current];
  const isLast = current === slides.length - 1;

  const goTo = (index) => {
    scrollRef.current?.scrollTo({ x: index * SCREEN_W, animated: true });
    setCurrent(index);
  };

  const handleNext = () => {
    if (!isLast) { goTo(current + 1); return; }
    handleFinish(false);
  };

  const handleSkip = () => { handleFinish(false); };

  const handleEnableLocation = async () => {
    setLoading(true);
    try {
      await setupLocationFeature();
    } catch (_) {}
    setLoading(false);
    handleFinish(true);
  };

  const handleFinish = async (locationEnabled) => {
    await AsyncStorage.setItem(ONBOARDING_KEY, JSON.stringify({ done: true, locationEnabled }));
    onComplete?.();
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Skip button */}
      <View style={styles.skipRow}>
        {current < slides.length - 1 ? (
          <TouchableOpacity onPress={handleSkip} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        ) : (
          <View style={{ width: 40 }} />
        )}
      </View>

      {/* Slides */}
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
        style={styles.slider}
      >
        {slides.map((s, i) => (
          <View key={s.key} style={styles.slide}>

            {/* Icon circle */}
            <View style={[styles.iconCircle, { backgroundColor: s.iconBg, borderColor: s.iconBorder }]}>
              <Text style={styles.iconEmoji}>{s.icon}</Text>
            </View>

            {/* Eyebrow */}
            <Text style={[styles.eyebrow, { color: s.eyebrowColor }]}>{s.eyebrow}</Text>

            {/* Title */}
            <Text style={styles.title}>{s.title}</Text>

            {/* Slide-specific content */}
            {s.body && !s.features && !s.tipLines && (
              <Text style={styles.body}>{s.body}</Text>
            )}

            {/* Slide 2: feature list */}
            {s.features && (
              <View style={styles.featureList}>
                {s.features.map((f) => (
                  <FeatureRow key={f.title} {...f} />
                ))}
              </View>
            )}

            {/* Slide 3: no classic syrup tip */}
            {s.tipLines && (
              <>
                <Text style={styles.body}>{s.body}</Text>
                <View style={[styles.tipCard, { backgroundColor: colors.redBg, borderColor: colors.redBorder }]}>
                  <Text style={[styles.tipCardTitle, { color: colors.red }]}>{s.tipTitle}</Text>
                  {s.tipLines.map((t) => (
                    <Text key={t.value} style={styles.tipLine}>
                      → {t.label}{' '}
                      <Text style={[styles.tipLineValue, { color: colors.green }]}>{t.value}</Text>
                    </Text>
                  ))}
                </View>
              </>
            )}

            {/* Slide 4: location */}
            {s.notifPreview && (
              <>
                <Text style={styles.body}>{s.body}</Text>

                {/* Notification preview */}
                <View style={styles.notifPreviewBox}>
                  <Text style={styles.notifPreviewLabel}>Preview</Text>
                  <View style={styles.notifBubble}>
                    <View style={styles.notifAppIcon}>
                      <Text style={{ fontSize: 14 }}>☕</Text>
                    </View>
                    <View style={styles.notifContent}>
                      <Text style={styles.notifTitle}>{s.notifPreview.title}</Text>
                      <Text style={styles.notifBody}>{s.notifPreview.body}</Text>
                    </View>
                  </View>
                </View>

                <Text style={styles.disclaimer}>{s.disclaimer}</Text>
              </>
            )}

          </View>
        ))}
      </ScrollView>

      {/* Dots */}
      <Dots total={slides.length} current={current} />

      {/* CTA buttons */}
      <View style={styles.ctaArea}>
        {isLast ? (
          <>
            <TouchableOpacity
              style={[styles.btnPrimary, loading && styles.btnDisabled]}
              onPress={handleEnableLocation}
              activeOpacity={0.85}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.btnPrimaryText}>📍  Enable Location & Let's Go</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnSecondary} onPress={() => handleFinish(false)} activeOpacity={0.7}>
              <Text style={styles.btnSecondaryText}>Skip for now</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity style={styles.btnPrimary} onPress={handleNext} activeOpacity={0.85}>
            <Text style={styles.btnPrimaryText}>Next →</Text>
          </TouchableOpacity>
        )}
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:    { flex: 1, backgroundColor: '#fff' },
  skipRow: { alignItems: 'flex-end', paddingHorizontal: 20, paddingTop: 6, paddingBottom: 4 },
  skipText: { fontSize: 15, fontWeight: '600', color: colors.muted2 },

  slider: { flex: 1 },
  slide: {
    width: SCREEN_W,
    paddingHorizontal: 28,
    paddingTop: 10,
    alignItems: 'center',
  },

  iconCircle: {
    width: 130, height: 130, borderRadius: 65,
    borderWidth: 2,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 24,
  },
  iconEmoji: { fontSize: 64 },

  eyebrow: {
    fontSize: 11, fontWeight: '700', letterSpacing: 2,
    textTransform: 'uppercase', marginBottom: 10,
  },
  title: {
    fontSize: 26, fontWeight: '800', color: colors.text,
    textAlign: 'center', lineHeight: 33, letterSpacing: -0.4,
    marginBottom: 14,
  },
  body: {
    fontSize: 15, color: colors.muted, lineHeight: 23,
    textAlign: 'center', marginBottom: 18,
  },

  // Feature list (slide 2)
  featureList: { alignSelf: 'stretch', gap: 14, marginTop: 4 },
  featureRow:  { flexDirection: 'row', alignItems: 'flex-start', gap: 13 },
  featureIcon: {
    width: 40, height: 40, borderRadius: 11,
    backgroundColor: colors.greenPale, borderWidth: 1, borderColor: colors.greenBorder,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  featureIconText: { fontSize: 20 },
  featureBody:  { flex: 1 },
  featureTitle: { fontSize: 14, fontWeight: '700', color: colors.text, marginBottom: 2 },
  featureDesc:  { fontSize: 12, color: colors.muted, lineHeight: 18 },

  // Tip card (slide 3)
  tipCard: {
    alignSelf: 'stretch', borderRadius: 14,
    borderWidth: 1, padding: 14, marginTop: 4,
  },
  tipCardTitle: { fontSize: 12, fontWeight: '700', marginBottom: 8 },
  tipLine: { fontSize: 14, fontWeight: '600', color: colors.text, lineHeight: 24 },
  tipLineValue: { fontWeight: '700' },

  // Notification preview (slide 4)
  notifPreviewBox: {
    alignSelf: 'stretch',
    backgroundColor: '#f5f5f7', borderRadius: 14,
    borderWidth: 1, borderColor: colors.border,
    padding: 13, marginBottom: 12,
  },
  notifPreviewLabel: {
    fontSize: 10, fontWeight: '700', letterSpacing: 1,
    textTransform: 'uppercase', color: colors.muted2, marginBottom: 9,
  },
  notifBubble: {
    backgroundColor: '#fff', borderRadius: 12,
    padding: 12, flexDirection: 'row', alignItems: 'flex-start',
    gap: 10, shadowColor: '#000', shadowOpacity: 0.08,
    shadowRadius: 6, shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  notifAppIcon: {
    width: 32, height: 32, borderRadius: 8,
    backgroundColor: colors.green, alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  notifContent: { flex: 1 },
  notifTitle:   { fontSize: 12, fontWeight: '700', color: colors.text, marginBottom: 2 },
  notifBody:    { fontSize: 12, color: '#444', lineHeight: 18 },
  disclaimer: {
    fontSize: 12, color: colors.muted2, textAlign: 'center',
    lineHeight: 18, marginTop: 4,
  },

  // Dots
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 7, marginBottom: 20 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#ddd' },
  dotActive: { width: 22, backgroundColor: colors.green },

  // CTA
  ctaArea:       { paddingHorizontal: 24, paddingBottom: 16, gap: 10 },
  btnPrimary: {
    backgroundColor: colors.green, borderRadius: 14,
    paddingVertical: 16, alignItems: 'center',
    shadowColor: colors.green, shadowOpacity: 0.3,
    shadowRadius: 8, shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  btnPrimaryText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  btnDisabled:    { opacity: 0.6 },
  btnSecondary: {
    backgroundColor: '#fff', borderWidth: 1.5, borderColor: colors.border,
    borderRadius: 14, paddingVertical: 14, alignItems: 'center',
  },
  btnSecondaryText: { color: colors.muted, fontSize: 15, fontWeight: '600' },
});
