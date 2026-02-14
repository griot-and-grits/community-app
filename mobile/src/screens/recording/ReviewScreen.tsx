import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, ScrollView, Alert } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import Video from 'react-native-video';
import { Input } from '@/components/common/Input';
import { PrimaryButton } from '@/components/common/PrimaryButton';
import { SecondaryButton } from '@/components/common/SecondaryButton';
import { PrivacySelector } from '@/components/recording/PrivacySelector';
import { UploadProgress } from '@/components/recording/UploadProgress';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { useRecordingStore } from '@/store/recordingStore';
import { useUploadQueueStore } from '@/store/uploadQueueStore';
import { useAuthStore } from '@/store/authStore';
import { storyService } from '@/services/story/StoryService';
import { connectivityMonitor } from '@/services/sync/ConnectivityMonitor';
import { PrivacyLevel } from '@/database/dao/StoryDAO';
import { Colors, Spacing } from '@/styles/tokens';

type ReviewScreenRouteProp = RouteProp<{
  Review: { videoPath: string };
}, 'Review'>;

/**
 * ReviewScreen
 *
 * Review recorded video, set metadata, and upload
 */
export const ReviewScreen = () => {
  const route = useRoute<ReviewScreenRouteProp>();
  const navigation = useNavigation();
  const { videoPath } = route.params;

  const { user } = useAuthStore();
  const { duration, quality, reset: resetRecording } = useRecordingStore();
  const { queue } = useUploadQueueStore();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [privacy, setPrivacy] = useState<PrivacyLevel>('public');
  const [isUploading, setIsUploading] = useState(false);
  const [storyId, setStoryId] = useState<string | null>(null);

  const handleSaveAndUpload = async () => {
    if (!user) {
      Alert.alert('Error', 'Please log in to upload stories.');
      return;
    }

    if (!title.trim()) {
      Alert.alert('Missing Title', 'Please enter a title for your story.');
      return;
    }

    setIsUploading(true);

    try {
      // Create story
      const newStoryId = await storyService.createStory({
        userId: user.id,
        title: title.trim(),
        description: description.trim(),
        videoLocalPath: videoPath,
        durationSeconds: duration,
        quality,
        privacy,
      });

      setStoryId(newStoryId);

      // Check connectivity
      if (!connectivityMonitor.isConnected()) {
        Alert.alert(
          'Saved Offline',
          'Your story has been saved and will upload automatically when you have an internet connection.',
          [
            {
              text: 'OK',
              onPress: () => {
                resetRecording();
                navigation.navigate('Home' as never);
              },
            },
          ]
        );
        return;
      }

      // Upload story
      await storyService.uploadStory({
        storyId: newStoryId,
        onProgress: (progress) => {
          console.log(`Upload progress: ${progress}%`);
        },
        onComplete: () => {
          setIsUploading(false);
          Alert.alert(
            'Upload Started',
            'Your story is being uploaded. You can continue using the app.',
            [
              {
                text: 'OK',
                onPress: () => {
                  resetRecording();
                  navigation.navigate('Home' as never);
                },
              },
            ]
          );
        },
        onError: (error) => {
          setIsUploading(false);
          Alert.alert(
            'Upload Failed',
            'Your story has been saved and will be retried automatically.',
            [{ text: 'OK' }]
          );
        },
      });
    } catch (error) {
      setIsUploading(false);
      console.error('Failed to save story:', error);
      Alert.alert('Error', 'Failed to save story. Please try again.');
    }
  };

  const handleDiscard = () => {
    Alert.alert(
      'Discard Recording',
      'Are you sure you want to discard this recording? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Discard',
          style: 'destructive',
          onPress: () => {
            resetRecording();
            navigation.goBack();
          },
        },
      ]
    );
  };

  // Get current upload if exists
  const currentUpload = storyId
    ? queue.find((u) => u.fileName.includes(storyId))
    : null;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {/* Video Preview */}
        <View style={styles.videoContainer}>
          <Video
            source={{ uri: videoPath }}
            style={styles.video}
            controls
            resizeMode="contain"
            paused={false}
          />
        </View>

        {/* Metadata Form */}
        <View style={styles.form}>
          <Input
            label="Title *"
            value={title}
            onChangeText={setTitle}
            placeholder="Enter a title for your story"
            maxLength={100}
            editable={!isUploading}
          />

          <Input
            label="Description"
            value={description}
            onChangeText={setDescription}
            placeholder="Add a description (optional)"
            multiline
            numberOfLines={4}
            maxLength={500}
            editable={!isUploading}
          />

          <PrivacySelector
            selected={privacy}
            onSelect={setPrivacy}
            disabled={isUploading}
          />
        </View>

        {/* Upload Progress */}
        {currentUpload && (
          <UploadProgress
            progress={currentUpload.progress}
            uploadedChunks={currentUpload.uploadedChunks}
            totalChunks={currentUpload.totalChunks}
            uploadedBytes={currentUpload.uploadedBytes}
            totalBytes={currentUpload.fileSize}
            status={currentUpload.status}
            error={currentUpload.error}
          />
        )}

        {/* Actions */}
        <View style={styles.actions}>
          {isUploading ? (
            <LoadingSpinner message="Saving story..." />
          ) : (
            <>
              <PrimaryButton
                title="Save & Upload"
                onPress={handleSaveAndUpload}
              />
              <SecondaryButton
                title="Discard"
                onPress={handleDiscard}
              />
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
  videoContainer: {
    aspectRatio: 16 / 9,
    backgroundColor: Colors.black,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: Spacing.lg,
  },
  video: {
    flex: 1,
  },
  form: {
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  actions: {
    gap: Spacing.md,
    marginTop: Spacing.xl,
  },
});
