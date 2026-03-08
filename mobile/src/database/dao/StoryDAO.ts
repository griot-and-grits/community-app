import DatabaseManager from '../DatabaseManager';
import { Story } from '../models/Story';

export type SyncStatus = 'pending' | 'syncing' | 'synced' | 'failed';
export type PrivacyLevel = 'public' | 'family_only' | 'private';
export type ProcessingStatus = 'pending' | 'processing' | 'completed' | 'failed';

/**
 * StoryDAO
 *
 * Data Access Object for Story operations
 * Handles CRUD operations and sync status queries
 */
class StoryDAO {
  private static instance: StoryDAO;
  private db: DatabaseManager;

  private constructor() {
    this.db = DatabaseManager.getInstance();
  }

  public static getInstance(): StoryDAO {
    if (!StoryDAO.instance) {
      StoryDAO.instance = new StoryDAO();
    }
    return StoryDAO.instance;
  }

  /**
   * Create a new story
   */
  async create(story: Omit<Story, 'id' | 'created_at' | 'updated_at'>): Promise<string> {
    const id = `story-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
    const now = Date.now();

    this.db.execute(
      `INSERT INTO stories (
        id, user_id, title, description, video_url, video_local_path,
        thumbnail_url, duration_seconds, quality, privacy, processing_status,
        ai_metadata, sync_status, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        story.user_id,
        story.title || '',
        story.description || '',
        story.video_url || '',
        story.video_local_path || '',
        story.thumbnail_url || '',
        story.duration_seconds || 0,
        story.quality || 'high',
        story.privacy || 'public',
        story.processing_status || 'pending',
        story.ai_metadata || '{}',
        story.sync_status || 'pending',
        now,
        now,
      ]
    );

    console.log(`[StoryDAO] Created story: ${id}`);
    return id;
  }

  /**
   * Get story by ID
   */
  async getById(id: string): Promise<Story | null> {
    const results = this.db.executeQuery<Story>(
      `SELECT * FROM stories WHERE id = ?`,
      [id]
    );

    return results.length > 0 ? results[0] : null;
  }

  /**
   * Get all stories for a user
   */
  async getByUserId(userId: string, privacy?: PrivacyLevel): Promise<Story[]> {
    let query = `SELECT * FROM stories WHERE user_id = ?`;
    const params: any[] = [userId];

    if (privacy) {
      query += ` AND privacy = ?`;
      params.push(privacy);
    }

    query += ` ORDER BY created_at DESC`;

    return this.db.executeQuery<Story>(query, params);
  }

  /**
   * Update story
   */
  async update(id: string, updates: Partial<Story>): Promise<void> {
    const fields: string[] = [];
    const values: any[] = [];

    // Build dynamic update query
    Object.entries(updates).forEach(([key, value]) => {
      if (key !== 'id' && key !== 'created_at') {
        fields.push(`${key} = ?`);
        values.push(value);
      }
    });

    if (fields.length === 0) {
      return;
    }

    // Always update updated_at
    fields.push('updated_at = ?');
    values.push(Date.now());

    // Add ID for WHERE clause
    values.push(id);

    const query = `UPDATE stories SET ${fields.join(', ')} WHERE id = ?`;
    this.db.execute(query, values);

    console.log(`[StoryDAO] Updated story: ${id}`);
  }

  /**
   * Delete story
   */
  async delete(id: string): Promise<void> {
    this.db.execute(`DELETE FROM stories WHERE id = ?`, [id]);
    console.log(`[StoryDAO] Deleted story: ${id}`);
  }

  /**
   * Get stories pending sync
   */
  async getPendingSync(): Promise<Story[]> {
    return this.db.executeQuery<Story>(
      `SELECT * FROM stories WHERE sync_status = 'pending' ORDER BY created_at ASC`
    );
  }

  /**
   * Get stories that failed sync
   */
  async getFailedSync(): Promise<Story[]> {
    return this.db.executeQuery<Story>(
      `SELECT * FROM stories WHERE sync_status = 'failed' ORDER BY created_at DESC`
    );
  }

  /**
   * Update sync status
   */
  async updateSyncStatus(id: string, status: SyncStatus, etag?: string): Promise<void> {
    const updates: Partial<Story> = {
      sync_status: status,
      updated_at: Date.now(),
    };

    if (status === 'synced' && etag) {
      updates.etag = etag;
      updates.uploaded_at = Date.now();
    }

    await this.update(id, updates);
  }

  /**
   * Update processing status
   */
  async updateProcessingStatus(id: string, status: ProcessingStatus): Promise<void> {
    await this.update(id, {
      processing_status: status,
    });
  }

  /**
   * Update privacy level
   */
  async updatePrivacy(id: string, privacy: PrivacyLevel): Promise<void> {
    await this.update(id, {
      privacy,
    });
  }

  /**
   * Set AI metadata
   */
  async setAIMetadata(id: string, metadata: any): Promise<void> {
    await this.update(id, {
      ai_metadata: JSON.stringify(metadata),
    });
  }

  /**
   * Get recent stories
   */
  async getRecent(limit: number = 10): Promise<Story[]> {
    return this.db.executeQuery<Story>(
      `SELECT * FROM stories ORDER BY created_at DESC LIMIT ?`,
      [limit]
    );
  }

  /**
   * Search stories by title or description
   */
  async search(query: string): Promise<Story[]> {
    const searchPattern = `%${query}%`;
    return this.db.executeQuery<Story>(
      `SELECT * FROM stories
       WHERE title LIKE ? OR description LIKE ?
       ORDER BY created_at DESC`,
      [searchPattern, searchPattern]
    );
  }

  /**
   * Get total count of stories for a user
   */
  async getCountByUserId(userId: string): Promise<number> {
    const result = this.db.executeQuery<{ count: number }>(
      `SELECT COUNT(*) as count FROM stories WHERE user_id = ?`,
      [userId]
    );
    return result[0]?.count || 0;
  }

  /**
   * Get total storage used by user's stories
   */
  async getStorageUsedByUserId(userId: string): Promise<number> {
    // This would calculate based on file sizes stored in metadata
    // For now, return 0 as placeholder
    return 0;
  }
}

export const storyDAO = StoryDAO.getInstance();
export default storyDAO;
