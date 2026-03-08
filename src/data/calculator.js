/**
 * Sugar calculator ingredient data
 * All sugar values in grams per standard serving
 */

export const BASES = [
  { id: 'espresso',       label: 'Espresso',          emoji: '⚡', sugarPer: 0,   unit: 'per shot',   defaultQty: 2, minQty: 1, maxQty: 6 },
  { id: 'drip',           label: 'Drip Coffee',        emoji: '☕', sugarPer: 0,   unit: 'per cup',    defaultQty: 1, minQty: 1, maxQty: 1 },
  { id: 'cold_brew',      label: 'Cold Brew',          emoji: '🌊', sugarPer: 0,   unit: 'per cup',    defaultQty: 1, minQty: 1, maxQty: 1 },
  { id: 'nitro',          label: 'Nitro Cold Brew',    emoji: '🫧', sugarPer: 0,   unit: 'per cup',    defaultQty: 1, minQty: 1, maxQty: 1 },
  { id: 'chai_tea',       label: 'Chai Tea (bag)',     emoji: '🌶️', sugarPer: 0,   unit: 'per bag',    defaultQty: 1, minQty: 1, maxQty: 2 },
  { id: 'green_tea',      label: 'Green Tea',          emoji: '🍵', sugarPer: 0,   unit: 'per bag',    defaultQty: 1, minQty: 1, maxQty: 2 },
  { id: 'black_tea',      label: 'Black Tea',          emoji: '🖤', sugarPer: 0,   unit: 'per bag',    defaultQty: 1, minQty: 1, maxQty: 2 },
  { id: 'passion_tango',  label: 'Passion Tango Tea',  emoji: '🌺', sugarPer: 0,   unit: 'per bag',    defaultQty: 1, minQty: 1, maxQty: 2 },
  { id: 'earl_grey',      label: 'Earl Grey Tea',      emoji: '🫖', sugarPer: 0,   unit: 'per bag',    defaultQty: 1, minQty: 1, maxQty: 2 },
];

export const MILKS = [
  { id: 'none',           label: 'No Milk',            emoji: '🚫', sugarPer: 0,    note: '0g sugar' },
  { id: 'heavy_cream',    label: 'Heavy Cream',        emoji: '🍶', sugarPer: 0.4,  note: '~0.4g per splash' },
  { id: 'half_half',      label: 'Half & Half',        emoji: '🥛', sugarPer: 1.3,  note: '~1.3g per 2 tbsp' },
  { id: 'whole_milk',     label: 'Whole Milk',         emoji: '🥛', sugarPer: 3.0,  note: '~3g per ¼ cup' },
  { id: 'two_percent',    label: '2% Milk',            emoji: '🥛', sugarPer: 3.0,  note: '~3g per ¼ cup' },
  { id: 'nonfat',         label: 'Nonfat Milk',        emoji: '🥛', sugarPer: 3.2,  note: '~3.2g per ¼ cup' },
  { id: 'oat_milk',       label: 'Oat Milk',           emoji: '🌾', sugarPer: 4.0,  note: '~4g per ¼ cup (added sugar)' },
  { id: 'almond_milk',    label: 'Almond Milk',        emoji: '🌰', sugarPer: 1.3,  note: '~1.3g per ¼ cup (added sugar)' },
  { id: 'coconut_milk',   label: 'Coconut Milk',       emoji: '🥥', sugarPer: 4.0,  note: '~4g per ¼ cup (added sugar)' },
  { id: 'soy_milk',       label: 'Soy Milk',           emoji: '🫘', sugarPer: 3.5,  note: '~3.5g per ¼ cup' },
];

export const SYRUPS = [
  // Sugar-free
  { id: 'sf_vanilla',     label: 'Sugar-Free Vanilla',  emoji: '✨', sugarPer: 0,   type: 'sf',  note: 'Sucralose sweetened' },
  { id: 'sf_caramel',     label: 'Sugar-Free Caramel',  emoji: '🍮', sugarPer: 0,   type: 'sf',  note: 'New Jan 2026 — verify availability' },
  // Regular syrups (for reference/comparison)
  { id: 'classic',        label: 'Classic Syrup',       emoji: '🍬', sugarPer: 5,   type: 'reg', note: '5g per pump' },
  { id: 'vanilla',        label: 'Vanilla Syrup',       emoji: '🍦', sugarPer: 5,   type: 'reg', note: '5g per pump' },
  { id: 'caramel',        label: 'Caramel Syrup',       emoji: '🍯', sugarPer: 5,   type: 'reg', note: '5g per pump' },
  { id: 'brown_sugar',    label: 'Brown Sugar Syrup',   emoji: '🟤', sugarPer: 6,   type: 'reg', note: '6g per pump' },
  { id: 'hazelnut',       label: 'Hazelnut Syrup',      emoji: '🌰', sugarPer: 5,   type: 'reg', note: '5g per pump' },
  { id: 'chai_conc',      label: 'Chai Concentrate',    emoji: '🌶️', sugarPer: 21,  type: 'reg', note: '~21g per 4 pumps (latte)' },
  { id: 'white_mocha',    label: 'White Mocha Sauce',   emoji: '⬜', sugarPer: 7.5, type: 'reg', note: '7.5g per pump' },
  { id: 'mocha',          label: 'Mocha Sauce',         emoji: '🍫', sugarPer: 5,   type: 'reg', note: '5g per pump' },
];

export const EXTRAS = [
  { id: 'cinnamon',       label: 'Cinnamon Powder',    emoji: '🟤', sugarPer: 0,   note: 'No sugar' },
  { id: 'cocoa',          label: 'Cocoa Powder',       emoji: '🍫', sugarPer: 0,   note: 'Unsweetened' },
  { id: 'vanilla_powder', label: 'Vanilla Powder',     emoji: '🤍', sugarPer: 0.5, note: '~0.5g per shake' },
  { id: 'whip',           label: 'Whipped Cream',      emoji: '☁️', sugarPer: 0.5, note: '~0.5g per dollop' },
];

// Sugar level thresholds for colour coding
export function getSugarLevel(grams) {
  if (grams === 0)  return { label: 'Zero Sugar', color: '#00c975', bg: 'rgba(0,201,117,0.15)', border: 'rgba(0,201,117,0.3)' };
  if (grams <= 5)   return { label: 'Very Low',   color: '#00c975', bg: 'rgba(0,201,117,0.12)', border: 'rgba(0,201,117,0.25)' };
  if (grams <= 15)  return { label: 'Low',        color: '#ffc94d', bg: 'rgba(255,180,0,0.12)', border: 'rgba(255,180,0,0.25)' };
  if (grams <= 30)  return { label: 'Moderate',   color: '#ff9f43', bg: 'rgba(255,159,67,0.12)', border: 'rgba(255,159,67,0.25)' };
  return            { label: 'High',              color: '#ff6b6b', bg: 'rgba(255,107,107,0.12)', border: 'rgba(255,107,107,0.25)' };
}

export const SIZES = [
  { id: 'tall',       label: 'Tall',         oz: '12oz', pumpMultiplier: 0.75, hotPumps: 3, icedPumps: 3 },
  { id: 'grande',     label: 'Grande',       oz: '16oz', pumpMultiplier: 1.0,  hotPumps: 4, icedPumps: 4 },
  { id: 'venti_hot',  label: 'Venti (Hot)',  oz: '20oz', pumpMultiplier: 1.25, hotPumps: 5, icedPumps: 5 },
  { id: 'venti_iced', label: 'Venti (Iced)', oz: '24oz', pumpMultiplier: 1.5,  hotPumps: 6, icedPumps: 6 },
];
