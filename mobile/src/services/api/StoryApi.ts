import { apiClient } from './ApiClient';
import { Story } from '@/database/models/Story';
import { PrivacyLevel } from '@/database/dao/StoryDAO';

export interface CreateStoryRequest {
  title: string;
  description?: string;
  duration_seconds: number;
  quality: string;
  privacy: PrivacyLevel;
}

export interface CreateStoryResponse {
  id: string;
  upload_url: string;
  etag: string;
}

export interface UpdateStoryRequest {
  title?: string;
  description?: string;
  privacy?: PrivacyLevel;
}

export interface GetStoriesResponse {
  stories: Story[];
  cursor?: string;
  has_more: boolean;
}

/**
 * StoryApi
 *
 * API client for story-related endpoints
 */
class StoryApi {
  private static instance: StoryApi;

  private constructor() {}

  public static getInstance(): StoryApi {
    if (!StoryApi.instance) {
      StoryApi.instance = new StoryApi();
    }
    return StoryApi.instance;
  }

  /**
   * Create a new story (get upload URL)
   */
  async createStory(data: CreateStoryRequest): Promise<CreateStoryResponse> {
    console.log('[StoryApi] Creating story...');

    try {
      const response = await apiClient.post<CreateStoryResponse>('/api/stories', data);
      return response.data;
    } catch (error) {
      console.error('[StoryApi] Create story failed:', error);
      throw error;
    }
  }

  /**
   * Update story metadata
   */
  async updateStory(storyId: string, data: UpdateStoryRequest): Promise<Story> {
    console.log(`[StoryApi] Updating story: ${storyId}`);

    try {
      const response = await apiClient.patch<Story>(`/api/stories/${storyId}`, data);
      return response.data;
    } catch (error) {
      console.error('[StoryApi] Update story failed:', error);
      throw error;
    }
  }

  /**
   * Get story by ID
   */
  async getStory(storyId: string): Promise<Story> {
    console.log(`[StoryApi] Getting story: ${storyId}`);

    try {
      const response = await apiClient.get<Story>(`/api/stories/${storyId}`);
      return response.data;
    } catch (error) {
      console.error('[StoryApi] Get story failed:', error);
      throw error;
    }
  }

  /**
   * Get user's stories
   */
  async getUserStories(userId: string, cursor?: string, limit: number = 20): Promise<GetStoriesResponse> {
    console.log(`[StoryApi] Getting stories for user: ${userId}`);

    try {
      const params: any = { limit };
      if (cursor) {
        params.cursor = cursor;
      }

      const response = await apiClient.get<GetStoriesResponse>(`/api/users/${userId}/stories`, { params });
      return response.data;
    } catch (error) {
      console.error('[StoryApi] Get user stories failed:', error);
      throw error;
    }
  }

  /**
   * Delete story
   */
  async deleteStory(storyId: string): Promise<void> {
    console.log(`[StoryApi] Deleting story: ${storyId}`);

    try {
      await apiClient.delete(`/api/stories/${storyId}`);
    } catch (error) {
      console.error('[StoryApi] Delete story failed:', error);
      throw error;
    }
  }

  /**
   * Update story privacy
   */
  async updatePrivacy(storyId: string, privacy: PrivacyLevel): Promise<Story> {
    console.log(`[StoryApi] Updating privacy for story: ${storyId} to ${privacy}`);

    try {
      const response = await apiClient.patch<Story>(`/api/stories/${storyId}/privacy`, { privacy });
      return response.data;
    } catch (error) {
      console.error('[StoryApi] Update privacy failed:', error);
      throw error;
    }
  }

  /**
   * Confirm upload completion
   */
  async confirmUpload(storyId: string): Promise<Story> {
    console.log(`[StoryApi] Confirming upload for story: ${storyId}`);

    try {
      const response = await apiClient.post<Story>(`/api/stories/${storyId}/confirm-upload`);
      return response.data;
    } catch (error) {
      console.error('[StoryApi] Confirm upload failed:', error);
      throw error;
    }
  }
}

export const storyApi = StoryApi.getInstance();
export default storyApi;
