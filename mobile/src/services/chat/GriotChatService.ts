import { ChatMessage } from '@/types/chat';
import { generateMockResponse } from '@/data/griotResponses';

class GriotChatService {
  private static instance: GriotChatService;

  private constructor() {}

  static getInstance(): GriotChatService {
    if (!GriotChatService.instance) {
      GriotChatService.instance = new GriotChatService();
    }
    return GriotChatService.instance;
  }

  async sendMessage(sessionId: string, message: string): Promise<ChatMessage> {
    // Simulate AI thinking time
    const delay = 1000 + Math.random() * 1500;
    await new Promise(resolve => setTimeout(resolve, delay));

    const { content, citations } = generateMockResponse(message);

    return {
      id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      sessionId,
      role: 'griot',
      content,
      citations: citations.length > 0 ? citations : undefined,
      timestamp: Date.now(),
    };
  }
}

export const griotChatService = GriotChatService.getInstance();
