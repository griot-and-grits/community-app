import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { SuggestedQuestion } from '@/types/chat';
import { Colors, Typography, Spacing, BorderRadius } from '@/styles/tokens';

interface SuggestedQuestionsProps {
  questions: SuggestedQuestion[];
  onSelect: (question: SuggestedQuestion) => void;
}

export const SuggestedQuestions: React.FC<SuggestedQuestionsProps> = ({ questions, onSelect }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Try asking...</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {questions.map(q => (
          <TouchableOpacity
            key={q.id}
            style={styles.chip}
            onPress={() => onSelect(q)}
            activeOpacity={0.7}
          >
            <Icon name={q.icon} size={16} color={Colors.primary} style={styles.chipIcon} />
            <Text style={styles.chipText}>{q.text}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: Spacing.md,
  },
  label: {
    ...Typography.label,
    color: Colors.textSecondary,
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
  },
  scrollContent: {
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.accent2,
    borderRadius: BorderRadius.xlarge,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    maxWidth: 250,
  },
  chipIcon: {
    marginRight: Spacing.sm,
  },
  chipText: {
    ...Typography.bodySmall,
    color: Colors.textPrimary,
    flexShrink: 1,
  },
});
