import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { StoryCard } from '@/components/story/StoryCard';
import { PrimaryButton } from '@/components/common/PrimaryButton';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Story } from '@/database/models/Story';
import { useAuthStore } from '@/store/authStore';
import { mockDataGenerator } from '@/services/mock/MockDataGenerator';
import { Colors, Typography, Spacing, BorderRadius } from '@/styles/tokens';

export const MyVideosScreen = () => {
  const navigation = useNavigation();
  const { user } = useAuthStore();

  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadStories();
  }, []);

  const loadStories = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      const userStories = mockDataGenerator.generateUserStories(user?.id || 'current-user', 8);
      setStories(userStories);
    } catch (error) {
      console.error('Failed to load stories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadStories();
    setRefreshing(false);
  };

  const handleRecord = () => {
    navigation.navigate('Recording' as never);
  };

  const handleStoryPress = (story: Story) => {
    navigation.navigate('StoryDetail' as never, { storyId: story.id } as never);
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <PrimaryButton
        title="Record Family Story"
        onPress={handleRecord}
        style={styles.recordButton}
      />
      <Text style={styles.sectionTitle}>
        {stories.length > 0 ? `My Stories (${stories.length})` : 'My Stories'}
      </Text>
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Icon name="video-outline" size={64} color={Colors.textSecondary} />
      <Text style={styles.emptyTitle}>No Stories Yet</Text>
      <Text style={styles.emptyText}>
        Start recording to preserve your family's oral history for future generations.
      </Text>
    </View>
  );

  if (loading && !refreshing && stories.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        {renderHeader()}
        <LoadingSpinner message="Loading your stories..." />
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
  },
  header: {
    marginBottom: Spacing.md,
  },
  recordButton: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    ...Typography.h3,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
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
