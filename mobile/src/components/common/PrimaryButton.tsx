import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  View,
} from 'react-native';
import { Colors, Typography, Spacing, BorderRadius } from '@/styles/tokens';

interface PrimaryButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

/**
 * Primary Button Component
 *
 * Solid color button for primary actions (e.g., Record, Upload, Login)
 */
export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  title,
  onPress,
  disabled = false,
  loading = false,
  style,
  textStyle,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      style={[
        styles.container,
        disabled && styles.containerDisabled,
        style,
      ]}
    >
      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator color={Colors.textOnPrimary} />
        ) : (
          <Text style={[styles.text, textStyle]}>{title}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: BorderRadius.large,
    backgroundColor: Colors.primary,
    overflow: 'hidden',
  },
  containerDisabled: {
    backgroundColor: Colors.disabled,
  },
  content: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
  },
  text: {
    ...Typography.button,
    color: Colors.textOnPrimary,
  },
});
