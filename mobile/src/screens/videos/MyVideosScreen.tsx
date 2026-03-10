import React, { useState, useEffect, useLayoutEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { VideoCard } from '@/components/story/VideoCard';
import { PrimaryButton } from '@/components/common/PrimaryButton';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { FamilyTreeView } from '@/components/family/FamilyTreeView';
import { AddFamilyMemberModal } from '@/components/family/AddFamilyMemberModal';
import { FamilyMemberActionModal } from '@/components/family/FamilyMemberActionModal';
import { VideoMetadata, getVideosByFamilyMembers } from '@/data/videos';
import { getFamilyMembers } from '@/data/filters';
import { FamilyMember } from '@/data/familyTree';
import { Colors, Typography, Spacing, BorderRadius } from '@/styles/tokens';

type TabType = 'stories' | 'tree';

export const MyVideosScreen = () => {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={headerButtonStyles.addButton}
          onPress={() => setShowAddMemberModal(true)}
        >
          <Icon name="account-plus" size={20} color={Colors.primary} />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const [activeTab, setActiveTab] = useState<TabType>('stories');
  const [familyVideos, setFamilyVideos] = useState<VideoMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [showMemberActionModal, setShowMemberActionModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(null);

  useEffect(() => {
    if (activeTab === 'stories') {
      loadFamilyStories();
    }
  }, [activeTab]);

  const loadFamilyStories = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 400));
      setFamilyVideos(getVideosByFamilyMembers(getFamilyMembers()));
    } catch (error) {
      console.error('Failed to load family stories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadFamilyStories();
    setRefreshing(false);
  };

  const handleVideoPress = (video: VideoMetadata) => {
    navigation.navigate('VideoDetail' as never, { videoId: video.id } as never);
  };

  const handleRecord = () => {
    navigation.navigate('Recording' as never);
  };

  const handleMemberPress = (member: FamilyMember) => {
    setSelectedMember(member);
    setShowMemberActionModal(true);
  };

  const handleMemberRecord = (member: FamilyMember) => {
    setShowMemberActionModal(false);
    navigation.navigate('Recording' as never);
  };

  const handleMemberEdit = (member: FamilyMember) => {
    setShowMemberActionModal(false);
    Alert.alert('Edit Family Member', `Editing ${member.name} coming soon.`);
  };

  const handleWatchStory = (videoId: string) => {
    setShowMemberActionModal(false);
    navigation.navigate('VideoDetail' as never, { videoId } as never);
  };

  const handleAddMember = () => {
    setShowAddMemberModal(true);
  };

  const handleInviteMembers = () => {
    setShowAddMemberModal(false);
    Alert.alert('Invite Family', 'Family invitation feature coming soon.');
  };

  const handleAddManually = () => {
    setShowAddMemberModal(false);
    Alert.alert('Add Manually', 'Manual family member entry coming soon.');
  };

  const handleImportAncestry = () => {
    setShowAddMemberModal(false);
    Alert.alert('Import from Ancestry', 'Ancestry.com import feature coming soon.');
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

  const renderTabs = () => (
    <View style={styles.tabs}>
      {renderTab('stories', 'Family Stories', 'video-outline')}
      {renderTab('tree', 'Family Tree', 'family-tree')}
    </View>
  );

  const renderEmpty = () => {
    if (loading) {
      return <LoadingSpinner message="Loading family stories..." />;
    }
    return (
      <View style={styles.emptyContainer}>
        <Icon name="video-outline" size={64} color={Colors.textSecondary} />
        <Text style={styles.emptyTitle}>No Family Stories Yet</Text>
        <Text style={styles.emptyText}>
          Stories from your family members will appear here.
        </Text>
      </View>
    );
  };

  const renderStoriesListHeader = () => (
    <View style={styles.storiesListHeader}>
      {!loading && familyVideos.length > 0 && (
        <View style={styles.resultCount}>
          <Icon name="video-outline" size={16} color={Colors.textSecondary} />
          <Text style={styles.resultCountText}>
            {familyVideos.length} {familyVideos.length === 1 ? 'story' : 'stories'}
          </Text>
        </View>
      )}
    </View>
  );

  const renderModals = () => (
    <>
      <AddFamilyMemberModal
        visible={showAddMemberModal}
        onClose={() => setShowAddMemberModal(false)}
        onInvite={handleInviteMembers}
        onAddManually={handleAddManually}
        onImportAncestry={handleImportAncestry}
      />
      <FamilyMemberActionModal
        visible={showMemberActionModal}
        member={selectedMember}
        onClose={() => setShowMemberActionModal(false)}
        onRecord={handleMemberRecord}
        onEdit={handleMemberEdit}
        onWatchStory={handleWatchStory}
      />
    </>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Record button — always visible above tabs */}
      <View style={styles.recordButtonContainer}>
        <PrimaryButton
          title="Record Family Story"
          onPress={handleRecord}
        />
      </View>

      {/* Tab bar */}
      {renderTabs()}

      {/* Tab content */}
      {activeTab === 'tree' ? (
        <View style={styles.treeContainer}>
          <FamilyTreeView onMemberPress={handleMemberPress} />
        </View>
      ) : (
        <FlatList
          data={loading ? [] : familyVideos}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <VideoCard video={item} onPress={handleVideoPress} />
          )}
          ListHeaderComponent={renderStoriesListHeader}
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
      )}

      {renderModals()}
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
  storiesListHeader: {
    paddingTop: Spacing.sm,
  },
  treeContainer: {
    flex: 1,
    overflow: 'hidden',
  },
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.surface,
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
  recordButtonContainer: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
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

const headerButtonStyles = StyleSheet.create({
  addButton: {
    padding: Spacing.sm,
    marginRight: Spacing.xs,
  },
});
