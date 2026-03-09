import React, { useState, useEffect } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  SafeAreaView,
  RefreshControl,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { VideoCard } from '@/components/story/VideoCard';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { VideoMetadata, GRIOT_VIDEOS, getFeaturedVideos, getVideosByTag, getVideosByPerson, getVideosByFamilyMembers } from '@/data/videos';
import { TAGS, PEOPLE, getPopularTags, getFamilyMembers } from '@/data/filters';
import { Colors, Spacing, Typography, BorderRadius } from '@/styles/tokens';

type FilterType = 'all' | 'featured' | 'family' | 'tag' | 'person';

/**
 * DiscoveryScreen
 *
 * Browse and discover public stories from the community
 */
export const DiscoveryScreen = () => {
  const navigation = useNavigation();
  const [videos, setVideos] = useState<VideoMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<FilterType>('all');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedPerson, setSelectedPerson] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Load initial videos
  useEffect(() => {
    loadVideos();
  }, [filter, selectedTag, selectedPerson, searchQuery]);

  const loadVideos = async () => {
    setLoading(true);
    try {
      // Simulate API call delay for realism
      await new Promise(resolve => setTimeout(resolve, 400));

      let filteredVideos: VideoMetadata[] = [];

      // Apply filter
      switch (filter) {
        case 'featured':
          filteredVideos = getFeaturedVideos();
          break;
        case 'tag':
          if (selectedTag) {
            filteredVideos = getVideosByTag(selectedTag);
          } else {
            filteredVideos = GRIOT_VIDEOS;
          }
          break;
        case 'family':
          filteredVideos = getVideosByFamilyMembers(getFamilyMembers());
          break;
        case 'person':
          if (selectedPerson) {
            filteredVideos = getVideosByPerson(selectedPerson);
          } else {
            filteredVideos = GRIOT_VIDEOS;
          }
          break;
        default:
          // All videos, sorted by date (most recent first)
          filteredVideos = [...GRIOT_VIDEOS].sort((a, b) =>
            new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime()
          );
      }

      // Apply search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filteredVideos = filteredVideos.filter(video =>
          video.title.toLowerCase().includes(query) ||
          video.interviewees.some(i => i.toLowerCase().includes(query)) ||
          video.description.toLowerCase().includes(query) ||
          video.tags.some(t => t.toLowerCase().includes(query)) ||
          video.people.some(p => p.toLowerCase().includes(query))
        );
      }

      setVideos(filteredVideos);
    } catch (error) {
      console.error('Failed to load videos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadVideos();
    setRefreshing(false);
  };

  const handleVideoPress = (video: VideoMetadata) => {
    navigation.navigate('VideoDetail' as never, { videoId: video.id } as never);
  };

  const handleFilterPress = (newFilter: FilterType) => {
    setFilter(newFilter);
    if (newFilter !== 'tag') setSelectedTag(null);
    if (newFilter !== 'person') setSelectedPerson(null);
  };

  const handleTagPress = (tag: string) => {
    setSelectedTag(tag);
    setFilter('tag');
  };

  const handlePersonPress = (person: string) => {
    setSelectedPerson(person);
    setFilter('person');
  };

  const renderFilterButton = (type: FilterType, label: string, icon: string) => (
    <TouchableOpacity
      style={[styles.filterButton, filter === type && styles.filterButtonActive]}
      onPress={() => handleFilterPress(type)}
    >
      <Icon
        name={icon}
        size={18}
        color={filter === type ? Colors.white : Colors.textSecondary}
      />
      <Text
        style={[
          styles.filterButtonText,
          filter === type && styles.filterButtonTextActive,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  const handleSearchSubmit = () => {
    setSearchQuery(searchInput);
  };

  const handleClearSearch = () => {
    setSearchInput('');
    setSearchQuery('');
  };

  const renderHeader = () => (
    <View style={styles.header}>
      {/* Main Filters */}
      <View style={styles.filters}>
        {renderFilterButton('all', 'All Stories', 'view-grid-outline')}
        {renderFilterButton('family', 'Family', 'account-group')}
        {renderFilterButton('featured', 'Featured', 'star')}
      </View>

      {/* Popular Tags */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Popular Topics</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.tagFilters}>
            {getPopularTags(0.8).map((tag) => (
              <TouchableOpacity
                key={tag.name}
                style={[
                  styles.tagFilter,
                  selectedTag === tag.name && styles.tagFilterActive,
                ]}
                onPress={() => handleTagPress(tag.name)}
              >
                <Text
                  style={[
                    styles.tagFilterText,
                    selectedTag === tag.name && styles.tagFilterTextActive,
                  ]}
                >
                  {tag.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Result Count */}
      {!loading && (
        <View style={styles.resultCount}>
          <Icon name="video-outline" size={16} color={Colors.textSecondary} />
          <Text style={styles.resultCountText}>
            {videos.length} {videos.length === 1 ? 'story' : 'stories'}
            {filter === 'family' && ' · My Family'}
            {selectedTag && ` · ${selectedTag}`}
            {selectedPerson && ` · ${selectedPerson}`}
          </Text>
        </View>
      )}
    </View>
  );

  const renderEmpty = () => {
    if (loading) {
      return <LoadingSpinner message="Loading stories..." />;
    }
    return (
      <View style={styles.emptyContainer}>
        <Icon name="video-outline" size={64} color={Colors.textSecondary} />
        <Text style={styles.emptyTitle}>No Stories Found</Text>
        <Text style={styles.emptyText}>
          Try selecting different filters to explore more stories
        </Text>
      </View>
    );
  };

  const renderSearchBar = () => (
    <View style={styles.searchRow}>
      <View style={styles.searchContainer}>
        <Icon name="magnify" size={20} color={Colors.textSecondary} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search stories, people, or topics..."
          placeholderTextColor={Colors.textSecondary}
          value={searchInput}
          onChangeText={setSearchInput}
          onSubmitEditing={handleSearchSubmit}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
        />
        {searchInput.length > 0 && (
          <TouchableOpacity onPress={handleClearSearch} style={styles.clearButton}>
            <Icon name="close-circle" size={18} color={Colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {renderSearchBar()}
      <FlatList
        data={loading ? [] : videos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <VideoCard video={item} onPress={handleVideoPress} showFeaturedBadge />
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
    paddingTop: Spacing.md,
    paddingBottom: Spacing.md,
  },
  searchRow: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.medium,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.sm,
  },
  searchIcon: {
    marginRight: Spacing.xs,
  },
  searchInput: {
    flex: 1,
    ...Typography.body,
    color: Colors.textPrimary,
    paddingVertical: Spacing.sm,
  },
  clearButton: {
    padding: Spacing.xs,
  },
  filters: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 20,
    backgroundColor: Colors.white,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  filterButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterButtonText: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    fontWeight: '700',
  },
  filterButtonTextActive: {
    color: Colors.white,
  },
  section: {
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    ...Typography.h4,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  tagFilters: {
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  tagFilter: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.small,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.accent2,
  },
  tagFilterActive: {
    backgroundColor: Colors.secondary,
    borderColor: Colors.secondary,
  },
  tagFilterText: {
    ...Typography.bodySmall,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  tagFilterTextActive: {
    color: Colors.white,
  },
  resultCount: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.sm,
  },
  resultCountText: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    fontWeight: '600',
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
