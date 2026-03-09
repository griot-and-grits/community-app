import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { FamilyMember } from '@/data/familyTree';
import { Colors, Typography, Spacing, BorderRadius } from '@/styles/tokens';

interface FamilyMemberNodeProps {
  member: FamilyMember;
  onPress?: (member: FamilyMember) => void;
}

export const NODE_WIDTH = 140;
export const NODE_HEIGHT = 160;

export const FamilyMemberNode: React.FC<FamilyMemberNodeProps> = ({ member, onPress }) => {
  const handlePress = () => {
    if (onPress) {
      onPress(member);
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.card,
        member.hasStory ? styles.cardWithStory : styles.cardNoStory,
      ]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      {/* Avatar */}
      <View style={[styles.avatar, member.hasStory ? styles.avatarWithStory : styles.avatarNoStory]}>
        <Icon
          name="account"
          size={28}
          color={member.hasStory ? Colors.white : Colors.textSecondary}
        />
        {member.hasStory && (
          <View style={styles.storyBadge}>
            <Icon name="play-circle" size={16} color={Colors.primary} />
          </View>
        )}
      </View>

      {/* Name */}
      <Text style={[styles.name, !member.hasStory && styles.nameNoStory]} numberOfLines={2}>
        {member.name}
      </Text>

      {/* Relationship */}
      <Text style={styles.relationship}>{member.relationship}</Text>

      {/* Birth year */}
      {member.birthYear && (
        <Text style={styles.birthYear}>b. {member.birthYear}</Text>
      )}

      {/* Story indicator */}
      {member.hasStory ? (
        <View style={styles.storyIndicator}>
          <Icon name="video-outline" size={12} color={Colors.primary} />
          <Text style={styles.storyText}>
            {member.storyVideoIds.length} {member.storyVideoIds.length === 1 ? 'story' : 'stories'}
          </Text>
        </View>
      ) : (
        <Text style={styles.noStoryText}>No stories yet</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: NODE_WIDTH,
    height: NODE_HEIGHT,
    borderRadius: BorderRadius.medium,
    padding: Spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardWithStory: {
    backgroundColor: Colors.white,
    borderWidth: 2,
    borderColor: Colors.primary,
    ...Colors.elevation.small,
  },
  cardNoStory: {
    backgroundColor: Colors.cream,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xs,
    position: 'relative',
  },
  avatarWithStory: {
    backgroundColor: Colors.primary,
  },
  avatarNoStory: {
    backgroundColor: Colors.gray200,
  },
  storyBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: Colors.white,
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    ...Typography.caption,
    color: Colors.textPrimary,
    fontWeight: '700',
    textAlign: 'center',
    fontSize: 11,
    lineHeight: 14,
    marginBottom: 2,
  },
  nameNoStory: {
    color: Colors.textSecondary,
  },
  relationship: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontSize: 10,
    marginBottom: 2,
  },
  birthYear: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontSize: 9,
    marginBottom: 4,
  },
  storyIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  storyText: {
    ...Typography.caption,
    color: Colors.primary,
    fontWeight: '600',
    fontSize: 10,
  },
  noStoryText: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontStyle: 'italic',
    fontSize: 9,
  },
});
