import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  Share,
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import Video from 'react-native-video';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Story } from '@/database/models/Story';
import { mockDataGenerator } from '@/services/mock/MockDataGenerator';
import { Colors, Typography, Spacing, BorderRadius } from '@/styles/tokens';

type StoryDetailRouteProp = RouteProp<{
  StoryDetail: { storyId: string };
}, 'StoryDetail'>;

const { width: SCREEN_WIDTH } = Dimensions.get('window');

/**
 * StoryDetailScreen
 *
 * View full story with video playback and details
 */
export const StoryDetailScreen = () => {
  const route = useRoute<StoryDetailRouteProp>();
  const navigation = useNavigation();
  const { storyId } = route.params;

  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  useEffect(() => {
    loadStory();
  }, [storyId]);

  const loadStory = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      // Generate mock story (in real app, fetch from API/database)
      const mockStory = mockDataGenerator.generateStory(storyId);
      setStory(mockStory);
      setLikeCount(mockStory.likeCount || 0);
    } catch (error) {
      console.error('Failed to load story:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  const handleShare = async () => {
    if (!story) return;

    try {
      await Share.share({
        message: `Check out this story: ${story.title} by ${story.userName}`,
        title: story.title,
      });
    } catch (error) {
      console.error('Failed to share:', error);
    }
  };

  const handleAuthorPress = () => {
    if (!story) return;
    navigation.navigate('Profile' as never, { userId: story.userId } as never);
  };

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatViewCount = (count: number): string => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <LoadingSpinner message="Loading story..." />
      </SafeAreaView>
    );
  }

  if (!story) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Icon name="alert-circle-outline" size={64} color={Colors.error} />
          <Text style={styles.errorTitle}>Story Not Found</Text>
          <Text style={styles.errorText}>
            This story may have been removed or is no longer available.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Video Player */}
        <View style={styles.videoContainer}>
          <Video
            source={{ uri: story.videoUrl || 'https://www.w3schools.com/html/mov_bbb.mp4' }}
            style={styles.video}
            controls
            resizeMode="contain"
            paused={false}
          />
        </View>

        {/* Story Info */}
        <View style={styles.content}>
          {/* Title and Stats */}
          <View style={styles.header}>
            <Text style={styles.title}>{story.title}</Text>
            <View style={styles.statsRow}>
              <Icon name="eye-outline" size={16} color={Colors.textSecondary} />
              <Text style={styles.statText}>{formatViewCount(story.viewCount || 0)} views</Text>
              <Text style={styles.statSeparator}>•</Text>
              <Text style={styles.statText}>{formatDate(story.uploadedAt || story.createdAt)}</Text>
            </View>
          </View>

          {/* Actions */}
          <View style={styles.actions}>
            <TouchableOpacity style={styles.actionButton} onPress={handleLike}>
              <Icon
                name={isLiked ? 'heart' : 'heart-outline'}
                size={24}
                color={isLiked ? Colors.error : Colors.textSecondary}
              />
              <Text style={styles.actionText}>{formatViewCount(likeCount)}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
              <Icon name="share-outline" size={24} color={Colors.textSecondary} />
              <Text style={styles.actionText}>Share</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton}>
              <Icon name="download-outline" size={24} color={Colors.textSecondary} />
              <Text style={styles.actionText}>Save</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.divider} />

          {/* Author Info */}
          <TouchableOpacity style={styles.authorSection} onPress={handleAuthorPress}>
            <View style={styles.authorAvatar}>
              <Icon name="account" size={24} color={Colors.white} />
            </View>
            <View style={styles.authorInfo}>
              <Text style={styles.authorName}>{story.userName}</Text>
              {story.location && (
                <View style={styles.locationRow}>
                  <Icon name="map-marker-outline" size={14} color={Colors.textSecondary} />
                  <Text style={styles.locationText}>{story.location}</Text>
                </View>
              )}
            </View>
            <Icon name="chevron-right" size={24} color={Colors.textSecondary} />
          </TouchableOpacity>

          {/* Description */}
          {story.description && (
            <>
              <View style={styles.divider} />
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>About This Story</Text>
                <Text style={styles.description}>{story.description}</Text>
              </View>
            </>
          )}

          {/* Tags */}
          {story.tags && story.tags.length > 0 && (
            <>
              <View style={styles.divider} />
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Topics</Text>
                <View style={styles.tags}>
                  {story.tags.map((tag, index) => (
                    <View key={index} style={styles.tag}>
                      <Text style={styles.tagText}>#{tag}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </>
          )}

          {/* Details */}
          <View style={styles.divider} />
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Details</Text>
            <View style={styles.detailRow}>
              <Icon name="clock-outline" size={18} color={Colors.textSecondary} />
              <Text style={styles.detailLabel}>Duration:</Text>
              <Text style={styles.detailValue}>{formatDuration(story.durationSeconds)}</Text>
            </View>
            <View style={styles.detailRow}>
              <Icon name="calendar-outline" size={18} color={Colors.textSecondary} />
              <Text style={styles.detailLabel}>Recorded:</Text>
              <Text style={styles.detailValue}>{formatDate(story.recordedAt)}</Text>
            </View>
            {story.privacy !== 'public' && (
              <View style={styles.detailRow}>
                <Icon
                  name={story.privacy === 'private' ? 'lock' : 'account-group'}
                  size={18}
                  color={Colors.textSecondary}
                />
                <Text style={styles.detailLabel}>Privacy:</Text>
                <Text style={styles.detailValue}>
                  {story.privacy === 'private' ? 'Private' : 'Family Only'}
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  videoContainer: {
    width: SCREEN_WIDTH,
    aspectRatio: 16 / 9,
    backgroundColor: Colors.black,
  },
  video: {
    flex: 1,
  },
  content: {
    padding: Spacing.lg,
  },
  header: {
    marginBottom: Spacing.md,
  },
  title: {
    ...Typography.h2,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  statText: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
  },
  statSeparator: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: Spacing.md,
  },
  actionButton: {
    alignItems: 'center',
    gap: Spacing.xs,
  },
  actionText: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: Spacing.lg,
  },
  authorSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  authorAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  authorInfo: {
    flex: 1,
  },
  authorName: {
    ...Typography.bodyBold,
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
  },
  section: {
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    ...Typography.h4,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  description: {
    ...Typography.body,
    color: Colors.textSecondary,
    lineHeight: 24,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  tag: {
    backgroundColor: Colors.cream,
    borderRadius: BorderRadius.small,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  tagText: {
    ...Typography.bodySmall,
    color: Colors.primary,
    fontWeight: '600',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  detailLabel: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  detailValue: {
    ...Typography.bodyBold,
    color: Colors.textPrimary,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  errorTitle: {
    ...Typography.h3,
    color: Colors.textPrimary,
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  errorText: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});
