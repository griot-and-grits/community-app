import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Story } from '@/database/models/Story';
import { Colors, Typography, Spacing, BorderRadius } from '@/styles/tokens';

interface StoryCardProps {
  story: Story;
  onPress: (story: Story) => void;
}

/**
 * StoryCard Component
 *
 * Displays a story preview card in the discovery feed
 */
export const StoryCard: React.FC<StoryCardProps> = ({ story, onPress }) => {
  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const formatViewCount = (count: number): string => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  const formatTimeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)}mo ago`;
    return `${Math.floor(diffInSeconds / 31536000)}y ago`;
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(story)}
      activeOpacity={0.7}
    >
      {/* Thumbnail */}
      <View style={styles.thumbnailContainer}>
        <Image
          source={{ uri: story.thumbnailUrl || 'https://via.placeholder.com/400x300' }}
          style={styles.thumbnail}
          resizeMode="cover"
        />
        <View style={styles.durationBadge}>
          <Icon name="clock-outline" size={12} color={Colors.white} />
          <Text style={styles.durationText}>{formatDuration(story.durationSeconds)}</Text>
        </View>
        {story.privacy !== 'public' && (
          <View style={styles.privacyBadge}>
            <Icon
              name={story.privacy === 'private' ? 'lock' : 'account-group'}
              size={14}
              color={Colors.white}
            />
          </View>
        )}
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Title */}
        <Text style={styles.title} numberOfLines={2}>
          {story.title}
        </Text>

        {/* Author and Location */}
        <View style={styles.metadata}>
          <Text style={styles.author}>{story.userName}</Text>
          {story.location && (
            <>
              <Text style={styles.metadataSeparator}>•</Text>
              <Icon name="map-marker-outline" size={14} color={Colors.textSecondary} />
              <Text style={styles.location} numberOfLines={1}>
                {story.location}
              </Text>
            </>
          )}
        </View>

        {/* Description */}
        {story.description && (
          <Text style={styles.description} numberOfLines={2}>
            {story.description}
          </Text>
        )}

        {/* Tags */}
        {story.tags && story.tags.length > 0 && (
          <View style={styles.tags}>
            {story.tags.slice(0, 3).map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>#{tag}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Stats */}
        <View style={styles.stats}>
          <View style={styles.stat}>
            <Icon name="eye-outline" size={16} color={Colors.textSecondary} />
            <Text style={styles.statText}>{formatViewCount(story.viewCount || 0)}</Text>
          </View>
          <View style={styles.stat}>
            <Icon name="heart-outline" size={16} color={Colors.textSecondary} />
            <Text style={styles.statText}>{formatViewCount(story.likeCount || 0)}</Text>
          </View>
          <View style={styles.stat}>
            <Icon name="share-outline" size={16} color={Colors.textSecondary} />
            <Text style={styles.statText}>{formatViewCount(story.shareCount || 0)}</Text>
          </View>
          <View style={styles.statSpacer} />
          <Text style={styles.timeAgo}>{formatTimeAgo(story.uploadedAt || story.createdAt)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.medium,
    marginBottom: Spacing.md,
    overflow: 'hidden',
    ...Colors.elevation.small,
  },
  thumbnailContainer: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: Colors.gray200,
    position: 'relative',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  durationBadge: {
    position: 'absolute',
    bottom: Spacing.sm,
    right: Spacing.sm,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: BorderRadius.small,
    paddingHorizontal: Spacing.xs,
    paddingVertical: 2,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  durationText: {
    ...Typography.caption,
    color: Colors.white,
    fontWeight: '600',
  },
  privacyBadge: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: BorderRadius.full,
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: Spacing.md,
  },
  title: {
    ...Typography.h4,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  metadata: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
    flexWrap: 'wrap',
  },
  author: {
    ...Typography.bodySmall,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  metadataSeparator: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    marginHorizontal: Spacing.xs,
  },
  location: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    flex: 1,
    marginLeft: 2,
  },
  description: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
    lineHeight: 20,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
    marginBottom: Spacing.sm,
  },
  tag: {
    backgroundColor: Colors.cream,
    borderRadius: BorderRadius.small,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
  },
  tagText: {
    ...Typography.caption,
    color: Colors.primary,
    fontWeight: '600',
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  statSpacer: {
    flex: 1,
  },
  timeAgo: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
});
