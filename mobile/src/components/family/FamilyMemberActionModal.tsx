import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { FamilyMember } from '@/data/familyTree';
import { VideoMetadata, getVideoById } from '@/data/videos';
import { Colors, Typography, Spacing, BorderRadius } from '@/styles/tokens';

interface FamilyMemberActionModalProps {
  visible: boolean;
  member: FamilyMember | null;
  onClose: () => void;
  onRecord: (member: FamilyMember) => void;
  onEdit: (member: FamilyMember) => void;
  onWatchStory: (videoId: string) => void;
}

export const FamilyMemberActionModal: React.FC<FamilyMemberActionModalProps> = ({
  visible,
  member,
  onClose,
  onRecord,
  onEdit,
  onWatchStory,
}) => {
  if (!member) return null;

  const hasStories = member.hasStory && member.storyVideoIds.length > 0;
  const hasMultipleStories = member.storyVideoIds.length > 1;

  const getVideoTitle = (videoId: string): string => {
    const video = getVideoById(videoId);
    return video?.title || 'Untitled Story';
  };

  const getVideoDuration = (videoId: string): string => {
    const video = getVideoById(videoId);
    return video?.duration || '';
  };

  const renderNoStoriesContent = () => (
    <>
      <View style={styles.iconContainer}>
        <Icon name="book-open-page-variant" size={48} color={Colors.primary} />
      </View>

      <Text style={styles.memberName}>{member.name}</Text>
      <Text style={styles.memberRelationship}>{member.relationship}</Text>

      <View style={styles.messageBox}>
        <Text style={styles.messageText}>
          Every person carries stories that deserve to be remembered. {member.name}'s
          experiences, wisdom, and memories are a treasure that future generations
          should never lose.
        </Text>
        <Text style={styles.messageHighlight}>
          Would you like to record their story before it's too late?
        </Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.primaryAction}
          onPress={() => onRecord(member)}
        >
          <Icon name="microphone" size={22} color={Colors.white} />
          <Text style={styles.primaryActionText}>Record Their Story</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryAction}
          onPress={() => onEdit(member)}
        >
          <Icon name="pencil-outline" size={20} color={Colors.primary} />
          <Text style={styles.secondaryActionText}>Edit Family Member</Text>
        </TouchableOpacity>
      </View>
    </>
  );

  const renderHasStoriesContent = () => (
    <>
      <View style={styles.iconContainer}>
        <View style={styles.avatarWithStory}>
          <Icon name="account" size={32} color={Colors.white} />
          <View style={styles.playBadge}>
            <Icon name="play-circle" size={18} color={Colors.primary} />
          </View>
        </View>
      </View>

      <Text style={styles.memberName}>{member.name}</Text>
      <Text style={styles.memberRelationship}>{member.relationship}</Text>
      <Text style={styles.storyCount}>
        {member.storyVideoIds.length} {member.storyVideoIds.length === 1 ? 'story' : 'stories'} recorded
      </Text>

      {hasMultipleStories ? (
        <View style={styles.storyList}>
          <Text style={styles.storyListTitle}>Choose a story to watch:</Text>
          {member.storyVideoIds.map((videoId, index) => (
            <TouchableOpacity
              key={videoId}
              style={styles.storyItem}
              onPress={() => onWatchStory(videoId)}
            >
              <View style={styles.storyItemLeft}>
                <Icon name="play-circle-outline" size={24} color={Colors.primary} />
                <View style={styles.storyItemContent}>
                  <Text style={styles.storyItemTitle} numberOfLines={2}>
                    {getVideoTitle(videoId)}
                  </Text>
                  {getVideoDuration(videoId) ? (
                    <Text style={styles.storyItemDuration}>{getVideoDuration(videoId)}</Text>
                  ) : null}
                </View>
              </View>
              <Icon name="chevron-right" size={20} color={Colors.textSecondary} />
            </TouchableOpacity>
          ))}
        </View>
      ) : (
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.primaryAction}
            onPress={() => onWatchStory(member.storyVideoIds[0])}
          >
            <Icon name="play" size={22} color={Colors.white} />
            <Text style={styles.primaryActionText}>Watch Their Story</Text>
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity
        style={styles.secondaryAction}
        onPress={() => onEdit(member)}
      >
        <Icon name="pencil-outline" size={20} color={Colors.primary} />
        <Text style={styles.secondaryActionText}>Edit Family Member</Text>
      </TouchableOpacity>
    </>
  );

  return (
    <Modal visible={visible} transparent animationType="fade">
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <TouchableOpacity style={styles.modal} activeOpacity={1}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Icon name="close" size={24} color={Colors.textSecondary} />
          </TouchableOpacity>

          {hasStories ? renderHasStoriesContent() : renderNoStoriesContent()}
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.lg,
  },
  modal: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.large,
    padding: Spacing.xl,
    width: '100%',
    maxWidth: 400,
    ...Colors.elevation.medium,
  },
  closeButton: {
    position: 'absolute',
    top: Spacing.md,
    right: Spacing.md,
    zIndex: 1,
    padding: Spacing.xs,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: Spacing.md,
    marginTop: Spacing.sm,
  },
  avatarWithStory: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: Colors.white,
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  memberName: {
    ...Typography.h3,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  memberRelationship: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  storyCount: {
    ...Typography.bodySmall,
    color: Colors.primary,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  messageBox: {
    backgroundColor: Colors.cream,
    borderRadius: BorderRadius.medium,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  messageText: {
    ...Typography.body,
    color: Colors.textSecondary,
    lineHeight: 24,
    marginBottom: Spacing.md,
  },
  messageHighlight: {
    ...Typography.body,
    color: Colors.textPrimary,
    fontWeight: '700',
    lineHeight: 24,
  },
  actions: {
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  primaryAction: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.large,
  },
  primaryActionText: {
    ...Typography.button,
    color: Colors.white,
  },
  secondaryAction: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.md,
    borderWidth: 2,
    borderColor: Colors.primary,
    borderRadius: BorderRadius.large,
    marginBottom: Spacing.xs,
  },
  secondaryActionText: {
    ...Typography.button,
    color: Colors.primary,
  },
  storyList: {
    marginBottom: Spacing.md,
  },
  storyListTitle: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    fontWeight: '600',
    marginBottom: Spacing.sm,
  },
  storyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.md,
    backgroundColor: Colors.cream,
    borderRadius: BorderRadius.medium,
    marginBottom: Spacing.xs,
  },
  storyItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    flex: 1,
  },
  storyItemContent: {
    flex: 1,
  },
  storyItemTitle: {
    ...Typography.bodySmall,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  storyItemDuration: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontSize: 11,
    marginTop: 2,
  },
});
