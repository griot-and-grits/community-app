import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Share,
  Linking,
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { YouTubePlayer } from '@/components/video/YouTubePlayer';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { VideoMetadata, getVideoById } from '@/data/videos';
import { Colors, Typography, Spacing, BorderRadius } from '@/styles/tokens';

type VideoDetailRouteProp = RouteProp<{
  VideoDetail: { videoId: string };
}, 'VideoDetail'>;

/**
 * VideoDetailScreen
 *
 * View full story with video playback using real Griot & Grits data
 */
export const VideoDetailScreen = () => {
  const route = useRoute<VideoDetailRouteProp>();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { videoId } = route.params;

  const [video, setVideo] = useState<VideoMetadata | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadVideo();
  }, [videoId]);

  const loadVideo = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));

      const videoData = getVideoById(videoId);
      setVideo(videoData || null);
    } catch (error) {
      console.error('Failed to load video:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    if (!video) return;

    try {
      await Share.share({
        message: `${video.title}\n\nWatch on Griot & Grits: ${video.videoUrl}`,
        title: video.title,
        url: video.videoUrl,
      });
    } catch (error) {
      console.error('Failed to share:', error);
    }
  };

  const handleOpenYouTube = () => {
    if (video?.videoUrl) {
      Linking.openURL(video.videoUrl);
    }
  };

  const handleOpenPodcast = () => {
    if (video?.podcastUrl) {
      Linking.openURL(video.podcastUrl);
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <LoadingSpinner message="Loading story..." />
      </SafeAreaView>
    );
  }

  if (!video) {
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
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: insets.bottom + Spacing.lg }}>
        {/* Video Player */}
        <YouTubePlayer videoUrl={video.videoUrl} />

        {/* Story Info */}
        <View style={styles.content}>
          {/* Featured Badge */}
          {video.featured && (
            <View style={styles.featuredHeader}>
              <Icon name="star" size={20} color={Colors.tertiary} />
              <Text style={styles.featuredText}>Featured Story</Text>
            </View>
          )}

          {/* Title */}
          <Text style={styles.title}>{video.title}</Text>

          {/* Interviewees */}
          <View style={styles.intervieweesRow}>
            <Icon name="account-voice" size={20} color={Colors.primary} />
            <Text style={styles.intervieweesText}>
              {video.interviewees.join(', ')}
            </Text>
          </View>

          {/* Meta Row */}
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Icon name="clock-outline" size={16} color={Colors.textSecondary} />
              <Text style={styles.metaText}>{video.duration}</Text>
            </View>
            <Text style={styles.metaSeparator}>•</Text>
            <View style={styles.metaItem}>
              <Icon name="calendar-outline" size={16} color={Colors.textSecondary} />
              <Text style={styles.metaText}>{formatDate(video.createdDate)}</Text>
            </View>
          </View>

          {/* Actions */}
          <View style={styles.actions}>
            <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
              <Icon name="share-variant" size={24} color={Colors.primary} />
              <Text style={styles.actionText}>Share</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton} onPress={handleOpenYouTube}>
              <Icon name="youtube" size={24} color="#FF0000" />
              <Text style={styles.actionText}>YouTube</Text>
            </TouchableOpacity>

            {video.podcastUrl && (
              <TouchableOpacity style={styles.actionButton} onPress={handleOpenPodcast}>
                <Icon name="spotify" size={24} color="#1DB954" />
                <Text style={styles.actionText}>Podcast</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.divider} />

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About This Story</Text>
            <Text style={styles.description}>{video.description}</Text>
          </View>

          {/* Historical Context */}
          {video.historicalContext && video.historicalContext.length > 0 && (
            <>
              <View style={styles.divider} />
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Historical Context</Text>
                {video.historicalContext.map((context, index) => (
                  <View key={index} style={styles.contextItem}>
                    {context.year && (
                      <View style={styles.contextRow}>
                        <Icon name="calendar" size={18} color={Colors.primary} />
                        <Text style={styles.contextText}>Year: {context.year}</Text>
                      </View>
                    )}
                    <View style={styles.contextRow}>
                      <Icon name="map-marker" size={18} color={Colors.primary} />
                      <Text style={styles.contextText}>{context.location.name}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </>
          )}

          {/* Tags */}
          {video.tags && video.tags.length > 0 && (
            <>
              <View style={styles.divider} />
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Topics</Text>
                <View style={styles.tags}>
                  {video.tags.map((tag, index) => (
                    <View key={index} style={styles.tag}>
                      <Text style={styles.tagText}>{tag}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </>
          )}

          {/* People Featured */}
          {video.people && video.people.length > 0 && (
            <>
              <View style={styles.divider} />
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>People Featured</Text>
                <View style={styles.peopleList}>
                  {video.people.map((person, index) => (
                    <View key={index} style={styles.personItem}>
                      <Icon name="account-circle" size={20} color={Colors.primary} />
                      <Text style={styles.personText}>{person}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </>
          )}
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
  content: {
    padding: Spacing.lg,
  },
  featuredHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginBottom: Spacing.md,
    backgroundColor: Colors.cream,
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.small,
  },
  featuredText: {
    ...Typography.bodySmall,
    color: Colors.secondary,
    fontWeight: '700',
  },
  title: {
    ...Typography.h2,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
    lineHeight: 32,
  },
  intervieweesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  intervieweesText: {
    ...Typography.h4,
    color: Colors.primary,
    flex: 1,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  metaSeparator: {
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
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: Spacing.lg,
  },
  section: {
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    ...Typography.h4,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  description: {
    ...Typography.body,
    color: Colors.textSecondary,
    lineHeight: 24,
  },
  contextItem: {
    marginBottom: Spacing.md,
  },
  contextRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  contextText: {
    ...Typography.body,
    color: Colors.textPrimary,
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
    borderWidth: 1,
    borderColor: Colors.accent2,
  },
  tagText: {
    ...Typography.bodySmall,
    color: Colors.secondary,
    fontWeight: '600',
  },
  peopleList: {
    gap: Spacing.sm,
  },
  personItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  personText: {
    ...Typography.body,
    color: Colors.textPrimary,
    fontWeight: '600',
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
