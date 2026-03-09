import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { VideoMetadata } from '@/data/videos';
import { Colors, Typography, Spacing, BorderRadius } from '@/styles/tokens';

interface VideoCardProps {
  video: VideoMetadata;
  onPress: (video: VideoMetadata) => void;
  showFeaturedBadge?: boolean;
}

/**
 * VideoCard Component
 *
 * Displays a video card matching the griotandgrits.org website design
 */
export const VideoCard: React.FC<VideoCardProps> = ({
  video,
  onPress,
  showFeaturedBadge = true
}) => {
  const formatCount = (count: number): string => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getHistoricalYear = (): string | null => {
    if (video.historicalContext && video.historicalContext.length > 0) {
      const firstContext = video.historicalContext[0];
      if (firstContext.year) {
        return firstContext.year.toString();
      }
    }
    return null;
  };

  const getLocationName = (): string | null => {
    if (video.historicalContext && video.historicalContext.length > 0) {
      return video.historicalContext[0].location.name;
    }
    return null;
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(video)}
      activeOpacity={0.9}
    >
      {/* Thumbnail */}
      <View style={styles.thumbnailContainer}>
        <Image
          source={{ uri: video.thumbnail }}
          style={styles.thumbnail}
          resizeMode="cover"
        />

        {/* Duration Badge */}
        <View style={styles.durationBadge}>
          <Text style={styles.durationText}>{video.duration}</Text>
        </View>

        {/* Featured Badge */}
        {showFeaturedBadge && video.featured && (
          <View style={styles.featuredBadge}>
            <Icon name="star" size={16} color={Colors.tertiary} />
            <Text style={styles.featuredText}>Featured</Text>
          </View>
        )}

        {/* Podcast Indicator */}
        {video.podcastUrl && (
          <View style={styles.podcastBadge}>
            <Icon name="spotify" size={16} color={Colors.white} />
          </View>
        )}
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Title */}
        <Text style={styles.title} numberOfLines={2}>
          {video.title}
        </Text>

        {/* Interviewees */}
        <View style={styles.intervieweesContainer}>
          <Icon name="account-voice" size={14} color={Colors.textSecondary} />
          <Text style={styles.interviewees} numberOfLines={1}>
            {video.interviewees.join(', ')}
          </Text>
        </View>

        {/* Historical Context */}
        {(getHistoricalYear() || getLocationName()) && (
          <View style={styles.contextContainer}>
            {getHistoricalYear() && (
              <View style={styles.contextItem}>
                <Icon name="calendar-outline" size={14} color={Colors.textSecondary} />
                <Text style={styles.contextText}>{getHistoricalYear()}</Text>
              </View>
            )}
            {getLocationName() && (
              <View style={styles.contextItem}>
                <Icon name="map-marker-outline" size={14} color={Colors.textSecondary} />
                <Text style={styles.contextText} numberOfLines={1}>
                  {getLocationName()}
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Description */}
        <Text style={styles.description} numberOfLines={3}>
          {video.description}
        </Text>

        {/* Tags */}
        <View style={styles.tags}>
          {video.tags.slice(0, 3).map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
          {video.tags.length > 3 && (
            <Text style={styles.moreTagsText}>+{video.tags.length - 3} more</Text>
          )}
        </View>

        {/* Stats */}
        <View style={styles.stats}>
          <View style={styles.stat}>
            <Icon name="eye-outline" size={16} color={Colors.textSecondary} />
            <Text style={styles.statText}>{formatCount(video.viewCount || 0)}</Text>
          </View>
          <View style={styles.stat}>
            <Icon name="heart-outline" size={16} color={Colors.textSecondary} />
            <Text style={styles.statText}>{formatCount(video.likeCount || 0)}</Text>
          </View>
          <View style={styles.stat}>
            <Icon name="share-outline" size={16} color={Colors.textSecondary} />
            <Text style={styles.statText}>{formatCount(video.shareCount || 0)}</Text>
          </View>
          <View style={styles.statSpacer} />
          <Text style={styles.uploadDate}>
            {formatDate(video.createdDate)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.medium,
    marginBottom: Spacing.lg,
    overflow: 'hidden',
    ...Colors.elevation.medium,
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
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    borderRadius: BorderRadius.small,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
  },
  durationText: {
    ...Typography.caption,
    color: Colors.white,
    fontWeight: '700',
    fontSize: 13,
  },
  featuredBadge: {
    position: 'absolute',
    top: Spacing.sm,
    left: Spacing.sm,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    borderRadius: BorderRadius.small,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  featuredText: {
    ...Typography.caption,
    color: Colors.white,
    fontWeight: '700',
    fontSize: 11,
  },
  podcastBadge: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    backgroundColor: '#1DB954',
    borderRadius: BorderRadius.full,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: Spacing.md,
  },
  title: {
    ...Typography.h4,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
    lineHeight: 24,
  },
  intervieweesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: Spacing.xs,
  },
  interviewees: {
    ...Typography.bodySmall,
    color: Colors.primary,
    fontWeight: '600',
    flex: 1,
  },
  contextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.sm,
    flexWrap: 'wrap',
  },
  contextItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  contextText: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  description: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
    lineHeight: 22,
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
    borderWidth: 1,
    borderColor: Colors.accent2,
  },
  tagText: {
    ...Typography.caption,
    color: Colors.secondary,
    fontWeight: '600',
    fontSize: 11,
  },
  moreTagsText: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontStyle: 'italic',
    alignSelf: 'center',
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
  uploadDate: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
});
