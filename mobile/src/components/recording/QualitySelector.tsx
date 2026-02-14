import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { VideoQuality } from '@/services/recording/VideoRecordingService';
import { Colors, Typography, Spacing, BorderRadius } from '@/styles/tokens';

interface QualitySelectorProps {
  selected: VideoQuality;
  onSelect: (quality: VideoQuality) => void;
  disabled?: boolean;
}

const QUALITY_OPTIONS: { value: VideoQuality; label: string; description: string }[] = [
  { value: 'low', label: '240p', description: 'Small file size' },
  { value: 'medium', label: '480p', description: 'Balanced' },
  { value: 'high', label: '720p', description: 'Recommended' },
  { value: 'max', label: '1080p', description: 'Best quality' },
];

export const QualitySelector: React.FC<QualitySelectorProps> = ({
  selected,
  onSelect,
  disabled = false,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Video Quality</Text>
      <View style={styles.options}>
        {QUALITY_OPTIONS.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.option,
              selected === option.value && styles.optionSelected,
              disabled && styles.optionDisabled,
            ]}
            onPress={() => onSelect(option.value)}
            disabled={disabled}
          >
            <Text style={[
              styles.optionLabel,
              selected === option.value && styles.optionLabelSelected,
            ]}>
              {option.label}
            </Text>
            <Text style={[
              styles.optionDescription,
              selected === option.value && styles.optionDescriptionSelected,
            ]}>
              {option.description}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: Spacing.md,
  },
  label: {
    ...Typography.label,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  options: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  option: {
    flex: 1,
    backgroundColor: Colors.white,
    borderWidth: 2,
    borderColor: Colors.border,
    borderRadius: BorderRadius.small,
    padding: Spacing.sm,
    alignItems: 'center',
  },
  optionSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight,
  },
  optionDisabled: {
    opacity: 0.5,
  },
  optionLabel: {
    ...Typography.bodyBold,
    color: Colors.textPrimary,
  },
  optionLabelSelected: {
    color: Colors.primary,
  },
  optionDescription: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  optionDescriptionSelected: {
    color: Colors.primary,
  },
});
