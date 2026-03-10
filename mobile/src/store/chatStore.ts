import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ChatMessage, ChatSession } from '@/types/chat';

interface ChatState {
  sessions: ChatSession[];
  activeSessionId: string | null;
  isTyping: boolean;
  error: string | null;

  createSession: () => string;
  setActiveSession: (sessionId: string) => void;
  addMessage: (sessionId: string, message: ChatMessage) => void;
  setTyping: (isTyping: boolean) => void;
  setError: (error: string | null) => void;
  deleteSession: (sessionId: string) => void;
  clearAllSessions: () => void;
  getActiveSession: () => ChatSession | null;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      sessions: [],
      activeSessionId: null,
      isTyping: false,
      error: null,

      createSession: () => {
        const id = `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        const session: ChatSession = {
          id,
          title: 'New Conversation',
          messages: [],
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        set(state => ({
          sessions: [session, ...state.sessions],
          activeSessionId: id,
        }));
        return id;
      },

      setActiveSession: (sessionId) => {
        set({ activeSessionId: sessionId });
      },

      addMessage: (sessionId, message) => {
        set(state => ({
          sessions: state.sessions.map(s => {
            if (s.id !== sessionId) return s;
            const messages = [...s.messages, message];
            // Auto-title from first user message
            const title = s.title === 'New Conversation' && message.role === 'user'
              ? message.content.substring(0, 50) + (message.content.length > 50 ? '...' : '')
              : s.title;
            return { ...s, messages, title, updatedAt: Date.now() };
          }),
        }));
      },

      setTyping: (isTyping) => set({ isTyping }),

      setError: (error) => set({ error }),

      deleteSession: (sessionId) => {
        set(state => ({
          sessions: state.sessions.filter(s => s.id !== sessionId),
          activeSessionId: state.activeSessionId === sessionId ? null : state.activeSessionId,
        }));
      },

      clearAllSessions: () => {
        set({ sessions: [], activeSessionId: null });
      },

      getActiveSession: () => {
        const { sessions, activeSessionId } = get();
        return sessions.find(s => s.id === activeSessionId) || null;
      },
    }),
    {
      name: 'chat-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        sessions: state.sessions,
        activeSessionId: state.activeSessionId,
      }),
    }
  )
);
