import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Circle, Path, Line, Ellipse, G } from 'react-native-svg';
import { colors } from '../data/theme';

// A minimal custom coffee-leaf logo — circular badge with a stylised
// coffee bean inside a laurel ring, rendered in Starbucks green.
export default function AppLogo({ size = 40 }) {
  const r = size / 2;
  return (
    <View style={[styles.wrap, { width: size, height: size, borderRadius: r }]}>
      <Svg width={size} height={size} viewBox="0 0 40 40">
        {/* Outer ring */}
        <Circle
          cx="20" cy="20" r="18"
          fill="none"
          stroke={colors.green}
          strokeWidth="1.5"
        />
        {/* Inner ring */}
        <Circle
          cx="20" cy="20" r="14"
          fill="none"
          stroke={colors.green}
          strokeWidth="0.75"
          opacity="0.5"
        />

        {/* Coffee bean body */}
        <Ellipse
          cx="20" cy="20" rx="7" ry="9"
          fill="none"
          stroke={colors.greenLight}
          strokeWidth="1.6"
        />
        {/* Bean centre crease */}
        <Path
          d="M20 11.5 Q24 20 20 28.5"
          fill="none"
          stroke={colors.greenLight}
          strokeWidth="1.2"
        />

        {/* Small leaf left */}
        <Path
          d="M9 16 Q13 13 13 20 Q9 20 9 16Z"
          fill={colors.green}
          opacity="0.7"
        />
        {/* Small leaf right */}
        <Path
          d="M31 16 Q27 13 27 20 Q31 20 31 16Z"
          fill={colors.green}
          opacity="0.7"
        />

        {/* Star dot top */}
        <Circle cx="20" cy="6" r="1.2" fill={colors.green} />
        {/* Star dot bottom */}
        <Circle cx="20" cy="34" r="1.2" fill={colors.green} />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,168,98,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(0,168,98,0.2)',
  },
});
