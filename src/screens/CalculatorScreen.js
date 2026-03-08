import React, { useState, useMemo, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  StatusBar, FlatList, Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../data/theme';
import { useDrinks } from '../context/DrinksContext';
import { BASES, MILKS, SYRUPS, EXTRAS, SIZES, getSugarLevel } from '../data/calculator';
import ScreenHeader from '../components/ScreenHeader';

// ─── Small stepper ────────────────────────────────────────────────────────────
function Stepper({ value, min, max, onChange }) {
  return (
    <View style={st.stepper}>
      <TouchableOpacity
        style={[st.stepBtn, value <= min && st.stepBtnDisabled]}
        onPress={() => value > min && onChange(value - 1)}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Text style={st.stepIcon}>−</Text>
      </TouchableOpacity>
      <Text style={st.stepVal}>{value}</Text>
      <TouchableOpacity
        style={[st.stepBtn, value >= max && st.stepBtnDisabled]}
        onPress={() => value < max && onChange(value + 1)}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Text style={st.stepIcon}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

// ─── Section header ───────────────────────────────────────────────────────────
function SectionHead({ label }) {
  return <Text style={st.sectionHead}>{label}</Text>;
}

// ─── Selectable pill ─────────────────────────────────────────────────────────
function Pill({ label, emoji, selected, onPress }) {
  return (
    <TouchableOpacity
      style={[st.pill, selected && st.pillSelected]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={st.pillEmoji}>{emoji}</Text>
      <Text style={[st.pillLabel, selected && st.pillLabelSelected]}>{label}</Text>
    </TouchableOpacity>
  );
}

// ─── Drink picker modal ───────────────────────────────────────────────────────
function DrinkPickerModal({ visible, onClose, onSelect }) {
  const { allDrinks } = useDrinks();
  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView style={st.modalSafe} edges={['top']}>
        <View style={st.modalNav}>
          <Text style={st.modalTitle}>Start from a drink</Text>
          <TouchableOpacity onPress={onClose}>
            <Text style={st.modalClose}>Done</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={allDrinks}
          keyExtractor={(d) => d.id}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={st.drinkPickRow}
              onPress={() => { onSelect(item); onClose(); }}
              activeOpacity={0.7}
            >
              <Text style={st.drinkPickEmoji}>{item.emoji}</Text>
              <View style={{ flex: 1 }}>
                <Text style={st.drinkPickName}>{item.name}</Text>
                <Text style={st.drinkPickDesc} numberOfLines={1}>{item.desc}</Text>
              </View>
              <Text style={{ color: colors.green, fontSize: 20 }}>›</Text>
            </TouchableOpacity>
          )}
        />
      </SafeAreaView>
    </Modal>
  );
}

// ─── Main screen ─────────────────────────────────────────────────────────────
export default function CalculatorScreen({ navigation }) {
  const [selectedBase, setSelectedBase] = useState(BASES[0]);
  const [baseQty, setBaseQty] = useState(BASES[0].defaultQty);
  const [selectedMilk, setSelectedMilk] = useState(MILKS[0]);
  const [selectedSyrups, setSelectedSyrups] = useState([]);
  const [syrupPumps, setSyrupPumps] = useState({});
  const [selectedExtras, setSelectedExtras] = useState([]);
  const [selectedSize, setSelectedSize] = useState(SIZES[1]); // Default Grande
  const [pickerVisible, setPickerVisible] = useState(false);
  const [sourceDrink, setSourceDrink] = useState(null);

  const toggleSyrup = useCallback((syrup) => {
    setSelectedSyrups((prev) => {
      const exists = prev.find((s) => s.id === syrup.id);
      if (exists) {
        setSyrupPumps((p) => { const n = { ...p }; delete n[syrup.id]; return n; });
        return prev.filter((s) => s.id !== syrup.id);
      }
      setSyrupPumps((p) => ({ ...p, [syrup.id]: 2 }));
      return [...prev, syrup];
    });
  }, []);

  const toggleExtra = useCallback((extra) => {
    setSelectedExtras((prev) =>
      prev.find((e) => e.id === extra.id)
        ? prev.filter((e) => e.id !== extra.id)
        : [...prev, extra]
    );
  }, []);

  const handleDrinkSelect = useCallback((drink) => {
    setSourceDrink(drink);
    // Map drink tags to sensible defaults
    const isIced = drink.tags.includes('c');
    const base = drink.tags.includes('h') || isIced
      ? (drink.id.startsWith('cb') ? BASES.find((b) => b.id === 'cold_brew') : BASES[0])
      : BASES[0];
    setSelectedBase(base);
    setBaseQty(base.defaultQty);

    // Default milk from drink data
    if (drink.milkNote && drink.milkNote.includes('almond')) {
      setSelectedMilk(MILKS.find((m) => m.id === 'almond_milk'));
    } else if (drink.milkNote && drink.milkNote.includes('heavy cream')) {
      setSelectedMilk(MILKS.find((m) => m.id === 'heavy_cream'));
    } else {
      setSelectedMilk(MILKS[0]);
    }

    // Sugar-free syrups
    if (drink.order.toLowerCase().includes('sugar-free vanilla')) {
      const sf = SYRUPS.find((s) => s.id === 'sf_vanilla');
      setSelectedSyrups([sf]);
      setSyrupPumps({ sf_vanilla: 2 });
    } else if (drink.order.toLowerCase().includes('sugar-free caramel')) {
      const sf = SYRUPS.find((s) => s.id === 'sf_caramel');
      setSelectedSyrups([sf]);
      setSyrupPumps({ sf_caramel: 2 });
    } else {
      setSelectedSyrups([]);
      setSyrupPumps({});
    }
    setSelectedExtras([]);
  }, []);

  const reset = useCallback(() => {
    setSelectedBase(BASES[0]);
    setBaseQty(BASES[0].defaultQty);
    setSelectedMilk(MILKS[0]);
    setSelectedSyrups([]);
    setSyrupPumps({});
    setSelectedExtras([]);
    setSourceDrink(null);
  }, []);

  const totalSugar = useMemo(() => {
    let total = selectedBase.sugarPer * baseQty;
    total += selectedMilk.sugarPer;
    selectedSyrups.forEach((s) => {
      total += s.sugarPer * (syrupPumps[s.id] || selectedSize.hotPumps);
    });
    selectedExtras.forEach((e) => { total += e.sugarPer; });
    return Math.round(total * 10) / 10;
  }, [selectedBase, baseQty, selectedMilk, selectedSyrups, syrupPumps, selectedExtras, selectedSize]);

  const level = getSugarLevel(totalSugar);

  // Sugar bar — max scale at 50g
  const barWidth = Math.min(totalSugar / 50, 1);

  return (
    <SafeAreaView style={st.safe} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.bg} />
      <ScreenHeader title="Calculator" onSearchPress={() => navigation.navigate('Search')} />

      <ScrollView contentContainerStyle={st.scroll} showsVerticalScrollIndicator={false}>

        {/* Result card */}
        <View style={[st.resultCard, { borderColor: level.border, backgroundColor: level.bg }]}>
          <View style={st.resultTop}>
            <View>
              <Text style={st.resultLabel}>Estimated Sugar</Text>
              <Text style={[st.resultGrams, { color: level.color }]}>{totalSugar}g</Text>
            </View>
            <View style={[st.levelBadge, { backgroundColor: level.bg, borderColor: level.border }]}>
              <Text style={[st.levelText, { color: level.color }]}>{level.label}</Text>
            </View>
          </View>
          {/* Sugar bar */}
          <View style={st.barTrack}>
            <View style={[st.barFill, { width: `${barWidth * 100}%`, backgroundColor: level.color }]} />
          </View>
          <Text style={st.barNote}>vs. avg Starbucks drink: ~40g sugar</Text>
        </View>

        {/* Source drink banner */}
        {sourceDrink && (
          <View style={st.sourceBanner}>
            <Text style={st.sourceBannerText}>
              Based on: <Text style={st.sourceBannerName}>{sourceDrink.emoji} {sourceDrink.name}</Text>
            </Text>
            <TouchableOpacity onPress={reset}>
              <Text style={st.sourceClear}>Clear</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Start from a drink */}
        <TouchableOpacity style={st.startFromBtn} onPress={() => setPickerVisible(true)} activeOpacity={0.8}>
          <Text style={st.startFromIcon}>🔄</Text>
          <Text style={st.startFromText}>Start from an existing drink</Text>
          <Text style={st.startFromChevron}>›</Text>
        </TouchableOpacity>

        {/* Size */}
        <SectionHead label="Drink Size" />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={st.pillRow}>
          {SIZES.map((sz) => (
            <Pill
              key={sz.id}
              label={sz.label}
              emoji={sz.oz}
              selected={selectedSize.id === sz.id}
              onPress={() => setSelectedSize(sz)}
            />
          ))}
        </ScrollView>
        <View style={st.sizeNote}>
          <Text style={st.sizeNoteText}>
            🍬 Default {selectedSize.hotPumps} syrup pump{selectedSize.hotPumps !== 1 ? 's' : ''} for this size = {selectedSize.hotPumps * 5}g added sugar from regular syrup
          </Text>
        </View>

        {/* Base */}
        <SectionHead label="Base" />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={st.pillRow}>
          {BASES.map((b) => (
            <Pill
              key={b.id}
              label={b.label}
              emoji={b.emoji}
              selected={selectedBase.id === b.id}
              onPress={() => { setSelectedBase(b); setBaseQty(b.defaultQty); }}
            />
          ))}
        </ScrollView>
        {selectedBase.maxQty > 1 && (
          <View style={st.stepperRow}>
            <Text style={st.stepperLabel}>{selectedBase.label} quantity ({selectedBase.unit})</Text>
            <Stepper value={baseQty} min={selectedBase.minQty} max={selectedBase.maxQty} onChange={setBaseQty} />
          </View>
        )}

        {/* Milk */}
        <SectionHead label="Milk" />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={st.pillRow}>
          {MILKS.map((m) => (
            <Pill
              key={m.id}
              label={m.label}
              emoji={m.emoji}
              selected={selectedMilk.id === m.id}
              onPress={() => setSelectedMilk(m)}
            />
          ))}
        </ScrollView>
        {selectedMilk.id !== 'none' && (
          <View style={st.milkNote}>
            <Text style={st.milkNoteText}>🍬 {selectedMilk.note}</Text>
          </View>
        )}

        {/* Syrups */}
        <SectionHead label="Syrups & Sauce" />
        <View style={st.syrupGrid}>
          {SYRUPS.map((s) => {
            const sel = !!selectedSyrups.find((x) => x.id === s.id);
            return (
              <View key={s.id}>
                <TouchableOpacity
                  style={[st.syrupRow, sel && st.syrupRowSelected, s.type === 'sf' && st.syrupRowSF]}
                  onPress={() => toggleSyrup(s)}
                  activeOpacity={0.7}
                >
                  <Text style={st.syrupEmoji}>{s.emoji}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={[st.syrupLabel, sel && st.syrupLabelSelected]}>{s.label}</Text>
                    <Text style={st.syrupNote}>{s.note}</Text>
                  </View>
                  {s.type === 'sf' && <Text style={st.sfBadge}>SF</Text>}
                  <View style={[st.checkbox, sel && st.checkboxSelected]}>
                    {sel && <Text style={st.checkmark}>✓</Text>}
                  </View>
                </TouchableOpacity>
                {sel && (
                  <View style={st.pumpRow}>
                    <Text style={st.pumpLabel}>Pumps</Text>
                    <Stepper
                      value={syrupPumps[s.id] || 2}
                      min={1}
                      max={6}
                      onChange={(v) => setSyrupPumps((p) => ({ ...p, [s.id]: v }))}
                    />
                  </View>
                )}
              </View>
            );
          })}
        </View>

        {/* Extras */}
        <SectionHead label="Extras & Toppings" />
        <View style={st.syrupGrid}>
          {EXTRAS.map((e) => {
            const sel = !!selectedExtras.find((x) => x.id === e.id);
            return (
              <TouchableOpacity
                key={e.id}
                style={[st.syrupRow, sel && st.syrupRowSelected]}
                onPress={() => toggleExtra(e)}
                activeOpacity={0.7}
              >
                <Text style={st.syrupEmoji}>{e.emoji}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={[st.syrupLabel, sel && st.syrupLabelSelected]}>{e.label}</Text>
                  <Text style={st.syrupNote}>{e.note}</Text>
                </View>
                <View style={[st.checkbox, sel && st.checkboxSelected]}>
                  {sel && <Text style={st.checkmark}>✓</Text>}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Reset */}
        <TouchableOpacity style={st.resetBtn} onPress={reset} activeOpacity={0.7}>
          <Text style={st.resetText}>Reset Calculator</Text>
        </TouchableOpacity>

      </ScrollView>

      <DrinkPickerModal
        visible={pickerVisible}
        onClose={() => setPickerVisible(false)}
        onSelect={handleDrinkSelect}
      />
    </SafeAreaView>
  );
}

const st = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scroll: { paddingHorizontal: 16, paddingBottom: 48 },

  // Result card
  resultCard: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 18,
    marginTop: 16,
    marginBottom: 12,
  },
  resultTop: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 },
  resultLabel: { fontSize: 12, fontWeight: '600', color: colors.muted, letterSpacing: 0.5, marginBottom: 4 },
  resultGrams: { fontSize: 48, fontWeight: '700', letterSpacing: -1 },
  levelBadge: { borderWidth: 1, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5 },
  levelText: { fontSize: 12, fontWeight: '700' },
  barTrack: { height: 6, backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 3, marginBottom: 8 },
  barFill: { height: 6, borderRadius: 3 },
  barNote: { fontSize: 11, color: colors.muted },

  // Source banner
  sourceBanner: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10, marginBottom: 12,
  },
  sourceBannerText: { fontSize: 13, color: colors.muted },
  sourceBannerName: { color: colors.text, fontWeight: '600' },
  sourceClear: { fontSize: 13, color: colors.green, fontWeight: '600' },

  // Start from drink button
  startFromBtn: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border,
    borderRadius: 14, padding: 14, marginBottom: 8,
  },
  startFromIcon: { fontSize: 20, marginRight: 10 },
  startFromText: { flex: 1, fontSize: 15, fontWeight: '600', color: colors.green },
  startFromChevron: { fontSize: 20, color: colors.muted },

  // Section heads
  sectionHead: {
    fontSize: 11, fontWeight: '700', letterSpacing: 1.2,
    textTransform: 'uppercase', color: colors.green,
    marginTop: 20, marginBottom: 10,
  },

  // Pills
  pillRow: { paddingBottom: 4 },
  pill: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border,
    borderRadius: 20, paddingHorizontal: 12, paddingVertical: 8, marginRight: 8,
  },
  pillSelected: { backgroundColor: colors.green, borderColor: colors.green },
  pillEmoji: { fontSize: 14, marginRight: 5 },
  pillLabel: { fontSize: 13, fontWeight: '500', color: colors.muted },
  pillLabelSelected: { color: '#000', fontWeight: '700' },

  // Stepper
  stepperRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10, marginTop: 8,
  },
  stepperLabel: { fontSize: 13, color: colors.muted, flex: 1 },
  stepper: { flexDirection: 'row', alignItems: 'center' },
  stepBtn: {
    width: 32, height: 32, borderRadius: 16, backgroundColor: colors.card,
    borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center',
  },
  stepBtnDisabled: { opacity: 0.3 },
  stepIcon: { fontSize: 18, color: colors.text, lineHeight: 22 },
  stepVal: { fontSize: 16, fontWeight: '700', color: colors.text, minWidth: 28, textAlign: 'center' },

  // Size note
  sizeNote: {
    backgroundColor: 'rgba(255,180,0,0.07)', borderWidth: 1,
    borderColor: 'rgba(255,180,0,0.2)', borderRadius: 10,
    paddingHorizontal: 12, paddingVertical: 8, marginTop: 8,
  },
  sizeNoteText: { fontSize: 12, color: '#ffc94d' },

  // Milk note
  milkNote: {
    backgroundColor: 'rgba(0,168,98,0.07)', borderWidth: 1,
    borderColor: 'rgba(0,168,98,0.2)', borderRadius: 10,
    paddingHorizontal: 12, paddingVertical: 8, marginTop: 8,
  },
  milkNoteText: { fontSize: 12, color: colors.muted },

  // Syrup rows
  syrupGrid: {
    backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border,
    borderRadius: 14, overflow: 'hidden',
  },
  syrupRow: {
    flexDirection: 'row', alignItems: 'center',
    padding: 14, borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  syrupRowSelected: { backgroundColor: 'rgba(0,168,98,0.07)' },
  syrupRowSF: {},
  syrupEmoji: { fontSize: 18, marginRight: 12, width: 24, textAlign: 'center' },
  syrupLabel: { fontSize: 14, fontWeight: '500', color: colors.text, marginBottom: 2 },
  syrupLabelSelected: { color: colors.green },
  syrupNote: { fontSize: 11, color: colors.muted },
  sfBadge: {
    fontSize: 10, fontWeight: '800', color: colors.green,
    backgroundColor: 'rgba(0,201,117,0.15)', borderWidth: 1,
    borderColor: 'rgba(0,201,117,0.3)', borderRadius: 6,
    paddingHorizontal: 5, paddingVertical: 1, marginRight: 8,
  },
  checkbox: {
    width: 22, height: 22, borderRadius: 11, borderWidth: 1.5,
    borderColor: colors.muted, alignItems: 'center', justifyContent: 'center',
  },
  checkboxSelected: { backgroundColor: colors.green, borderColor: colors.green },
  checkmark: { fontSize: 12, color: '#000', fontWeight: '800' },

  // Pump row
  pumpRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 14, paddingVertical: 10,
    backgroundColor: 'rgba(0,168,98,0.05)',
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  pumpLabel: { fontSize: 13, color: colors.muted },

  // Reset
  resetBtn: {
    marginTop: 24, borderWidth: 1, borderColor: colors.border,
    borderRadius: 14, paddingVertical: 14, alignItems: 'center',
  },
  resetText: { fontSize: 15, color: colors.muted, fontWeight: '500' },

  // Drink picker modal
  modalSafe: { flex: 1, backgroundColor: colors.bg },
  modalNav: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingVertical: 16,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  modalTitle: { fontSize: 18, fontWeight: '700', color: colors.text },
  modalClose: { fontSize: 16, color: colors.green, fontWeight: '600' },
  drinkPickRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border,
    borderRadius: 14, padding: 14, marginBottom: 8,
  },
  drinkPickEmoji: { fontSize: 26, marginRight: 12, width: 36, textAlign: 'center' },
  drinkPickName: { fontSize: 15, fontWeight: '600', color: colors.text, marginBottom: 3 },
  drinkPickDesc: { fontSize: 12, color: colors.muted },
});
