import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { StoryCard } from '@/components/story/StoryCard';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { PrimaryButton } from '@/components/common/PrimaryButton';
import { Story } from '@/database/models/Story';
import { useAuthStore } from '@/store/authStore';
import { mockDataGenerator } from '@/services/mock/MockDataGenerator';
import { Colors, Typography, Spacing, BorderRadius } from '@/styles/tokens';

type ProfileScreenRouteProp = RouteProp<{
  Profile: { userId?: string };
}, 'Profile'>;

type TabType = 'stories' | 'family' | 'saved';

/**
 * ProfileScreen
 *
 * View user profile with their stories and family connections
 */
export const ProfileScreen = () => {
  const route = useRoute<ProfileScreenRouteProp>();
  const navigation = useNavigation();
  const { user } = useAuthStore();

  const userId = route.params?.userId || user?.id || 'current-user';
  const isOwnProfile = !route.params?.userId || userId === user?.id;

  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('stories');
  const [isFollowing, setIsFollowing] = useState(false);

  // Mock user data
  const profileUser = {
    id: userId,
    name: isOwnProfile ? (user?.name || 'Your Name') : 'Community Member',
    location: 'Atlanta, Georgia',
    bio: 'Preserving family stories and traditions for future generations.',
    storyCount: 12,
    followerCount: 248,
    followingCount: 156,
    joinedDate: 'Joined January 2024',
  };

  useEffect(() => {
    loadUserStories();
  }, [userId, activeTab]);

  const loadUserStories = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 600));

      let userStories: Story[] = [];

      if (activeTab === 'stories') {
        // Load user's stories
        userStories = mockDataGenerator.generateUserStories(userId, 10);
      } else if (activeTab === 'saved') {
        // Load saved stories (only for own profile)
        if (isOwnProfile) {
          userStories = mockDataGenerator.generateStories(8);
        }
      } else if (activeTab === 'family') {
        // Load family stories
        userStories = mockDataGenerator.generateStories(6);
      }

      setStories(userStories);
    } catch (error) {
      console.error('Failed to load stories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadUserStories();
    setRefreshing(false);
  };

  const handleStoryPress = (story: Story) => {
    navigation.navigate('StoryDetail' as never, { storyId: story.id } as never);
  };

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
  };

  const handleEditProfile = () => {
    // Navigate to edit profile screen
    console.log('Edit profile');
  };

  const handleRecordStory = () => {
    navigation.navigate('Recording' as never);
  };

  const renderTab = (tab: TabType, label: string, icon: string) => (
    <TouchableOpacity
      style={[styles.tab, activeTab === tab && styles.tabActive]}
      onPress={() => setActiveTab(tab)}
    >
      <Icon
        name={icon}
        size={20}
        color={activeTab === tab ? Colors.primary : Colors.textSecondary}
      />
      <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      {/* Profile Info */}
      <View style={styles.profileSection}>
        <View style={styles.avatar}>
          <Icon name="account" size={48} color={Colors.white} />
        </View>

        <Text style={styles.name}>{profileUser.name}</Text>

        <View style={styles.locationRow}>
          <Icon name="map-marker-outline" size={16} color={Colors.textSecondary} />
          <Text style={styles.location}>{profileUser.location}</Text>
        </View>

        {profileUser.bio && (
          <Text style={styles.bio}>{profileUser.bio}</Text>
        )}

        {/* Stats */}
        <View style={styles.stats}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{profileUser.storyCount}</Text>
            <Text style={styles.statLabel}>Stories</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{profileUser.followerCount}</Text>
            <Text style={styles.statLabel}>Followers</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{profileUser.followingCount}</Text>
            <Text style={styles.statLabel}>Following</Text>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          {isOwnProfile ? (
            <>
              <PrimaryButton
                title="Record Story"
                onPress={handleRecordStory}
              />
              <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
                <Icon name="pencil-outline" size={20} color={Colors.primary} />
                <Text style={styles.editButtonText}>Edit Profile</Text>
              </TouchableOpacity>
            </>
          ) : (
            <PrimaryButton
              title={isFollowing ? 'Following' : 'Follow'}
              onPress={handleFollow}
            />
          )}
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        {renderTab('stories', 'Stories', 'video-outline')}
        {renderTab('family', 'Family', 'account-group-outline')}
        {isOwnProfile && renderTab('saved', 'Saved', 'bookmark-outline')}
      </View>
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Icon
        name={activeTab === 'stories' ? 'video-outline' : 'bookmark-outline'}
        size={64}
        color={Colors.textSecondary}
      />
      <Text style={styles.emptyTitle}>
        {activeTab === 'stories' ? 'No Stories Yet' : 'No Saved Stories'}
      </Text>
      <Text style={styles.emptyText}>
        {activeTab === 'stories'
          ? 'Start recording to share your family\'s oral history.'
          : 'Stories you save will appear here.'}
      </Text>
    </View>
  );

  if (loading && !refreshing && stories.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        {renderHeader()}
        <LoadingSpinner message="Loading profile..." />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={stories}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <StoryCard story={item} onPress={handleStoryPress} />
        )}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={Colors.primary}
            colors={[Colors.primary]}
          />
        }
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  list: {
    padding: Spacing.md,
    paddingTop: 0,
  },
  header: {
    paddingBottom: Spacing.lg,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: Spacing.lg,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  name: {
    ...Typography.h2,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: Spacing.sm,
  },
  location: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  bio: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    maxWidth: 300,
    marginBottom: Spacing.lg,
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  statItem: {
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
  },
  statValue: {
    ...Typography.h3,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  statLabel: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: Colors.border,
  },
  actions: {
    width: '100%',
    gap: Spacing.sm,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.md,
    borderWidth: 2,
    borderColor: Colors.primary,
    borderRadius: BorderRadius.large,
  },
  editButtonText: {
    ...Typography.button,
    color: Colors.primary,
  },
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.md,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: Colors.primary,
  },
  tabText: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  tabTextActive: {
    color: Colors.primary,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xxxl,
  },
  emptyTitle: {
    ...Typography.h3,
    color: Colors.textPrimary,
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  emptyText: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    maxWidth: 280,
  },
});
