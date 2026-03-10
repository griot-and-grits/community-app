import { apiClient } from './ApiClient';

export interface ChatRequest {
  session_id: string;
  message: string;
}

export interface ChatResponse {
  message_id: string;
  content: string;
  citations: Array<{
    video_id: string;
    title: string;
    interviewee: string;
    relevant_excerpt: string;
  }>;
}

export interface SessionListResponse {
  sessions: Array<{
    id: string;
    title: string;
    created_at: string;
    updated_at: string;
    message_count: number;
  }>;
}

/**
 * GriotApi
 *
 * API client for Ask the Griot chat endpoints.
 * Stub implementation — will be wired up when the backend is ready.
 */
class GriotApi {
  private static instance: GriotApi;

  private constructor() {}

  static getInstance(): GriotApi {
    if (!GriotApi.instance) {
      GriotApi.instance = new GriotApi();
    }
    return GriotApi.instance;
  }

  // POST /api/griot/chat
  async sendMessage(_request: ChatRequest): Promise<ChatResponse> {
    throw new Error('GriotApi.sendMessage not implemented — using mock service');
  }

  // GET /api/griot/sessions
  async getSessions(): Promise<SessionListResponse> {
    throw new Error('GriotApi.getSessions not implemented — using mock service');
  }

  // GET /api/griot/sessions/:id
  async getSession(_sessionId: string): Promise<any> {
    throw new Error('GriotApi.getSession not implemented — using mock service');
  }

  // DELETE /api/griot/sessions/:id
  async deleteSession(_sessionId: string): Promise<void> {
    throw new Error('GriotApi.deleteSession not implemented — using mock service');
  }
}

export const griotApi = GriotApi.getInstance();
