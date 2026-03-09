import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { GriotQuestion } from '@/data/griotQuestions';
import { Colors, Typography, Spacing, BorderRadius } from '@/styles/tokens';

interface QuestionOverlayProps {
  question: GriotQuestion;
  currentIndex: number;
  totalQuestions: number;
  minimized: boolean;
  onNext: () => void;
  onPrevious: () => void;
  onMinimize: () => void;
  onRestore: () => void;
}

export const QuestionOverlay: React.FC<QuestionOverlayProps> = ({
  question,
  currentIndex,
  totalQuestions,
  minimized,
  onNext,
  onPrevious,
  onMinimize,
  onRestore,
}) => {
  if (minimized) {
    return (
      <TouchableOpacity style={styles.minimizedButton} onPress={onRestore} activeOpacity={0.8}>
        <Icon name="book-open-variant" size={20} color={Colors.white} />
        <Text style={styles.minimizedText}>Show Guide</Text>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header row: category + progress + minimize */}
      <View style={styles.header}>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{question.category}</Text>
        </View>
        <Text style={styles.progress}>
          {currentIndex + 1} of {totalQuestions}
        </Text>
        <TouchableOpacity onPress={onMinimize} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
          <Icon name="chevron-down" size={24} color={Colors.white} />
        </TouchableOpacity>
      </View>

      {/* Question with nav arrows */}
      <View style={styles.questionRow}>
        <TouchableOpacity
          onPress={onPrevious}
          style={styles.navButton}
          disabled={currentIndex === 0}
          activeOpacity={0.7}
        >
          <Icon
            name="chevron-left"
            size={32}
            color={currentIndex === 0 ? 'rgba(255,255,255,0.3)' : Colors.white}
          />
        </TouchableOpacity>

        <View style={styles.questionContainer}>
          <Text style={styles.questionText}>{question.question}</Text>
          {question.followUp && (
            <Text style={styles.followUpText}>{question.followUp}</Text>
          )}
        </View>

        <TouchableOpacity
          onPress={onNext}
          style={styles.navButton}
          disabled={currentIndex === totalQuestions - 1}
          activeOpacity={0.7}
        >
          <Icon
            name="chevron-right"
            size={32}
            color={currentIndex === totalQuestions - 1 ? 'rgba(255,255,255,0.3)' : Colors.white}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: Spacing.md,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: BorderRadius.large,
    padding: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  categoryBadge: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.small,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
  },
  categoryText: {
    ...Typography.caption,
    color: Colors.white,
    fontWeight: '700',
    fontSize: 11,
  },
  progress: {
    ...Typography.caption,
    color: 'rgba(255, 255, 255, 0.7)',
    flex: 1,
    textAlign: 'center',
  },
  questionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  navButton: {
    padding: Spacing.xs,
  },
  questionContainer: {
    flex: 1,
    paddingHorizontal: Spacing.xs,
  },
  questionText: {
    ...Typography.body,
    color: Colors.white,
    textAlign: 'center',
    fontWeight: '600',
    lineHeight: 24,
  },
  followUpText: {
    ...Typography.caption,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
    marginTop: Spacing.xs,
    fontStyle: 'italic',
  },
  minimizedButton: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  minimizedText: {
    ...Typography.caption,
    color: Colors.white,
    fontWeight: '600',
  },
});
