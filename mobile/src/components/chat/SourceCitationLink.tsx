import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { SourceCitation } from '@/types/chat';
import { Colors, Typography, Spacing, BorderRadius } from '@/styles/tokens';

interface SourceCitationLinkProps {
  citation: SourceCitation;
  onPress: (citation: SourceCitation) => void;
}

export const SourceCitationLink: React.FC<SourceCitationLinkProps> = ({ citation, onPress }) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress(citation)}
      activeOpacity={0.7}
    >
      <View style={styles.accentBar} />
      <View style={styles.iconContainer}>
        <Icon name="play-circle-outline" size={24} color={Colors.primary} />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title} numberOfLines={1}>{citation.title}</Text>
        <Text style={styles.interviewee} numberOfLines={1}>{citation.interviewee}</Text>
      </View>
      <Icon name="chevron-right" size={20} color={Colors.textSecondary} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cream,
    borderRadius: BorderRadius.medium,
    marginTop: Spacing.xs,
    overflow: 'hidden',
  },
  accentBar: {
    width: 4,
    alignSelf: 'stretch',
    backgroundColor: Colors.tertiary,
  },
  iconContainer: {
    paddingHorizontal: Spacing.sm,
  },
  textContainer: {
    flex: 1,
    paddingVertical: Spacing.sm,
  },
  title: {
    ...Typography.bodySmall,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  interviewee: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
});
