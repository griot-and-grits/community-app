import RNFS from 'react-native-fs';
import { storyDAO, PrivacyLevel } from '@/database/dao/StoryDAO';
import { EncryptionService } from '../encryption/EncryptionService';
import { useUploadQueueStore } from '@/store/uploadQueueStore';
import { uploadQueueManager } from '../upload/UploadQueueManager';
import { Story } from '@/database/models/Story';

export interface CreateStoryData {
  userId: string;
  title?: string;
  description?: string;
  videoLocalPath: string;
  thumbnailPath?: string;
  durationSeconds: number;
  quality: string;
  privacy: PrivacyLevel;
}

export interface UploadStoryOptions {
  storyId: string;
  onProgress?: (progress: number) => void;
  onComplete?: () => void;
  onError?: (error: string) => void;
}

/**
 * StoryService
 *
 * Handles story creation, encryption, and upload coordination
 */
class StoryService {
  private static instance: StoryService;
  private encryptionService: EncryptionService;

  private constructor() {
    this.encryptionService = EncryptionService.getInstance();
  }

  public static getInstance(): StoryService {
    if (!StoryService.instance) {
      StoryService.instance = new StoryService();
    }
    return StoryService.instance;
  }

  /**
   * Create a new story with video file
   */
  async createStory(data: CreateStoryData): Promise<string> {
    console.log('[StoryService] Creating story...');

    try {
      // Verify video file exists
      const videoExists = await RNFS.exists(data.videoLocalPath);
      if (!videoExists) {
        throw new Error(`Video file not found: ${data.videoLocalPath}`);
      }

      // Get video file size
      const stats = await RNFS.stat(data.videoLocalPath);
      const fileSize = parseInt(stats.size, 10);

      console.log(`[StoryService] Video size: ${(fileSize / 1024 / 1024).toFixed(2)} MB`);

      // Encrypt video file
      const encryptedPath = await this.encryptVideoFile(data.videoLocalPath);

      // Create story record in database
      const storyId = await storyDAO.create({
        user_id: data.userId,
        title: data.title || '',
        description: data.description || '',
        video_local_path: encryptedPath,
        duration_seconds: data.durationSeconds,
        quality: data.quality,
        privacy: data.privacy,
        processing_status: 'pending',
        sync_status: 'pending',
      });

      console.log(`[StoryService] Story created: ${storyId}`);

      return storyId;
    } catch (error) {
      console.error('[StoryService] Failed to create story:', error);
      throw error;
    }
  }

  /**
   * Encrypt video file
   */
  private async encryptVideoFile(videoPath: string): Promise<string> {
    console.log('[StoryService] Encrypting video file...');

    try {
      const encryptedPath = `${videoPath}.encrypted`;

      await this.encryptionService.encryptFile(videoPath, encryptedPath);

      // Delete original unencrypted file
      await RNFS.unlink(videoPath);

      console.log('[StoryService] Video encrypted successfully');

      return encryptedPath;
    } catch (error) {
      console.error('[StoryService] Video encryption failed:', error);
      throw error;
    }
  }

  /**
   * Update story metadata
   */
  async updateStory(storyId: string, updates: Partial<Story>): Promise<void> {
    console.log(`[StoryService] Updating story: ${storyId}`);

    try {
      await storyDAO.update(storyId, updates);

      // If privacy or metadata changed, mark for re-sync
      if (updates.privacy || updates.description || updates.title) {
        await storyDAO.updateSyncStatus(storyId, 'pending');
      }

      console.log(`[StoryService] Story updated: ${storyId}`);
    } catch (error) {
      console.error('[StoryService] Failed to update story:', error);
      throw error;
    }
  }

  /**
   * Update story privacy
   */
  async updatePrivacy(storyId: string, privacy: PrivacyLevel): Promise<void> {
    console.log(`[StoryService] Updating privacy for story: ${storyId} to ${privacy}`);

    try {
      await storyDAO.updatePrivacy(storyId, privacy);

      // Mark for re-sync to update server
      await storyDAO.updateSyncStatus(storyId, 'pending');

      console.log(`[StoryService] Privacy updated: ${storyId}`);
    } catch (error) {
      console.error('[StoryService] Failed to update privacy:', error);
      throw error;
    }
  }

  /**
   * Upload story to backend
   */
  async uploadStory(options: UploadStoryOptions): Promise<void> {
    const { storyId, onProgress, onComplete, onError } = options;

    console.log(`[StoryService] Uploading story: ${storyId}`);

    try {
      // Get story from database
      const story = await storyDAO.getById(storyId);
      if (!story) {
        throw new Error(`Story not found: ${storyId}`);
      }

      // Verify encrypted video file exists
      const videoExists = await RNFS.exists(story.video_local_path);
      if (!videoExists) {
        throw new Error(`Video file not found: ${story.video_local_path}`);
      }

      // Get file stats
      const stats = await RNFS.stat(story.video_local_path);
      const fileSize = parseInt(stats.size, 10);

      // Add to upload queue
      const uploadQueueStore = useUploadQueueStore.getState();
      const uploadId = uploadQueueStore.addToQueue({
        filePath: story.video_local_path,
        fileName: `story-${storyId}.mp4`,
        fileSize,
        mimeType: 'video/mp4',
        chunkSize: 5 * 1024 * 1024, // 5MB chunks
        totalChunks: Math.ceil(fileSize / (5 * 1024 * 1024)),
        maxRetries: 3,
      });

      // Mark story as syncing
      await storyDAO.updateSyncStatus(storyId, 'syncing');

      console.log(`[StoryService] Story added to upload queue: ${uploadId}`);

      // Trigger upload queue processing
      uploadQueueManager.processQueue();

      // TODO: Set up listeners for upload progress/completion
      // This will be wired up when we implement real-time upload tracking

      if (onComplete) {
        onComplete();
      }
    } catch (error) {
      console.error(`[StoryService] Upload failed for story: ${storyId}`, error);

      // Mark as failed
      await storyDAO.updateSyncStatus(storyId, 'failed');

      if (onError) {
        onError(String(error));
      }

      throw error;
    }
  }

  /**
   * Get story by ID
   */
  async getStory(storyId: string): Promise<Story | null> {
    return storyDAO.getById(storyId);
  }

  /**
   * Get user's stories
   */
  async getUserStories(userId: string, privacy?: PrivacyLevel): Promise<Story[]> {
    return storyDAO.getByUserId(userId, privacy);
  }

  /**
   * Delete story
   */
  async deleteStory(storyId: string): Promise<void> {
    console.log(`[StoryService] Deleting story: ${storyId}`);

    try {
      const story = await storyDAO.getById(storyId);
      if (!story) {
        throw new Error(`Story not found: ${storyId}`);
      }

      // Delete encrypted video file
      if (story.video_local_path) {
        const exists = await RNFS.exists(story.video_local_path);
        if (exists) {
          await this.encryptionService.secureDelete(story.video_local_path);
        }
      }

      // Delete thumbnail if exists
      if (story.thumbnail_url) {
        const thumbnailPath = story.thumbnail_url.replace('file://', '');
        const exists = await RNFS.exists(thumbnailPath);
        if (exists) {
          await RNFS.unlink(thumbnailPath);
        }
      }

      // Delete from database
      await storyDAO.delete(storyId);

      console.log(`[StoryService] Story deleted: ${storyId}`);
    } catch (error) {
      console.error('[StoryService] Failed to delete story:', error);
      throw error;
    }
  }

  /**
   * Get pending uploads
   */
  async getPendingUploads(): Promise<Story[]> {
    return storyDAO.getPendingSync();
  }

  /**
   * Retry failed upload
   */
  async retryUpload(storyId: string): Promise<void> {
    console.log(`[StoryService] Retrying upload for story: ${storyId}`);

    await storyDAO.updateSyncStatus(storyId, 'pending');

    await this.uploadStory({ storyId });
  }
}

export const storyService = StoryService.getInstance();
export default storyService;
