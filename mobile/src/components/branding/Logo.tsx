import React from 'react';
import { View, Image, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors, Typography, Spacing } from '@/styles/tokens';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  style?: ViewStyle;
  showTitle?: boolean;
  showTagline?: boolean;
}

/**
 * Griot & Grits Logo Component
 *
 * Official brand logo from griotandgrits.org
 */
export const Logo: React.FC<LogoProps> = ({
  size = 'medium',
  style,
  showTitle = false,
  showTagline = false,
}) => {
  // Use full logo for medium/large, icon for small
  const logoSource = size === 'small'
    ? require('@/assets/images/griot-grits-icon.png')
    : require('@/assets/images/griot-grits-logo.png');

  const sizes = {
    small: { width: 50, height: 50 },      // Icon only
    medium: { width: 220, height: 80 },    // Full logo
    large: { width: 300, height: 110 },    // Full logo larger
  };

  const currentSize = sizes[size];

  return (
    <View style={[styles.container, style]}>
      <Image
        source={logoSource}
        style={[styles.logo, currentSize]}
        resizeMode="contain"
      />

      {showTitle && (
        <Text style={[styles.title, size === 'large' && styles.titleLarge]}>
          Griot & Grits
        </Text>
      )}

      {showTagline && (
        <Text style={styles.tagline}>
          Preserving Family Stories, One Voice at a Time
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    // Size is set dynamically via props
  },
  title: {
    ...Typography.h3,
    color: Colors.primary,
    marginTop: Spacing.md,
    textAlign: 'center',
    fontWeight: '700',
  },
  titleLarge: {
    ...Typography.h1,
  },
  tagline: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
    fontStyle: 'italic',
    textAlign: 'center',
    maxWidth: 280,
  },
});
