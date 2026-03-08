export interface SourceCitation {
  videoId: string;
  title: string;
  interviewee: string;
  relevantExcerpt: string;
}

export interface ChatMessage {
  id: string;
  sessionId: string;
  role: 'user' | 'griot';
  content: string;
  citations?: SourceCitation[];
  timestamp: number;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: number;
  updatedAt: number;
}

export interface SuggestedQuestion {
  id: string;
  text: string;
  icon: string;
}
