import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { PrivacyLevel } from '@/database/dao/StoryDAO';
import { Colors, Typography, Spacing, BorderRadius } from '@/styles/tokens';

interface PrivacySelectorProps {
  selected: PrivacyLevel;
  onSelect: (privacy: PrivacyLevel) => void;
  disabled?: boolean;
}

const PRIVACY_OPTIONS: {
  value: PrivacyLevel;
  label: string;
  icon: string;
  description: string;
}[] = [
  {
    value: 'public',
    label: 'Public',
    icon: 'earth',
    description: 'Anyone can view this story',
  },
  {
    value: 'family_only',
    label: 'Family Only',
    icon: 'account-group',
    description: 'Only family members can view',
  },
  {
    value: 'private',
    label: 'Private',
    icon: 'lock',
    description: 'Only you can view this story',
  },
];

export const PrivacySelector: React.FC<PrivacySelectorProps> = ({
  selected,
  onSelect,
  disabled = false,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Privacy</Text>
      <View style={styles.options}>
        {PRIVACY_OPTIONS.map((option) => (
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
            <Icon
              name={option.icon}
              size={24}
              color={selected === option.value ? Colors.primary : Colors.textSecondary}
            />
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
    gap: Spacing.sm,
  },
  option: {
    backgroundColor: Colors.white,
    borderWidth: 2,
    borderColor: Colors.border,
    borderRadius: BorderRadius.small,
    padding: Spacing.md,
    alignItems: 'center',
  },
  optionSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.surface,
  },
  optionDisabled: {
    opacity: 0.5,
  },
  optionLabel: {
    ...Typography.bodyBold,
    color: Colors.textPrimary,
    marginTop: Spacing.sm,
  },
  optionLabelSelected: {
    color: Colors.primary,
  },
  optionDescription: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
    textAlign: 'center',
  },
  optionDescriptionSelected: {
    color: Colors.primary,
  },
});
