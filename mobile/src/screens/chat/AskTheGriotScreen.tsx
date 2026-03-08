import React, { useEffect, useRef, useCallback } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  SafeAreaView,
  Text,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { ChatBubble } from '@/components/chat/ChatBubble';
import { ChatInput } from '@/components/chat/ChatInput';
import { TypingIndicator } from '@/components/chat/TypingIndicator';
import { SuggestedQuestions } from '@/components/chat/SuggestedQuestions';
import { useChatStore } from '@/store/chatStore';
import { griotChatService } from '@/services/chat/GriotChatService';
import { GRIOT_WELCOME_MESSAGE, SUGGESTED_QUESTIONS } from '@/data/griotResponses';
import { ChatMessage, SourceCitation, SuggestedQuestion } from '@/types/chat';
import { Colors, Typography, Spacing } from '@/styles/tokens';

type NavigationProp = NativeStackNavigationProp<any>;

export const AskTheGriotScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const flatListRef = useRef<FlatList>(null);

  const {
    activeSessionId,
    isTyping,
    error,
    createSession,
    addMessage,
    setTyping,
    setError,
    getActiveSession,
  } = useChatStore();

  // Ensure an active session exists
  useEffect(() => {
    if (!activeSessionId) {
      createSession();
    }
  }, [activeSessionId, createSession]);

  const session = getActiveSession();
  const messages = session?.messages || [];
  const isNewSession = messages.length === 0;

  const handleSend = useCallback(async (text: string) => {
    const sessionId = activeSessionId || createSession();

    const userMessage: ChatMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      sessionId,
      role: 'user',
      content: text,
      timestamp: Date.now(),
    };

    addMessage(sessionId, userMessage);
    setError(null);
    setTyping(true);

    try {
      const response = await griotChatService.sendMessage(sessionId, text);
      addMessage(sessionId, response);
    } catch (err) {
      setError('The Griot could not respond. Please try again.');
    } finally {
      setTyping(false);
    }
  }, [activeSessionId, createSession, addMessage, setError, setTyping]);

  const handleSuggestedQuestion = useCallback((question: SuggestedQuestion) => {
    handleSend(question.text);
  }, [handleSend]);

  const handleCitationPress = useCallback((citation: SourceCitation) => {
    navigation.navigate('VideoDetail', { videoId: citation.videoId });
  }, [navigation]);

  // Build the list data with welcome message prepended
  const welcomeMessage: ChatMessage = {
    id: 'welcome',
    sessionId: activeSessionId || '',
    role: 'griot',
    content: GRIOT_WELCOME_MESSAGE,
    timestamp: Date.now(),
  };

  const listData = [welcomeMessage, ...messages];

  const renderMessage = useCallback(({ item }: { item: ChatMessage }) => (
    <ChatBubble message={item} onCitationPress={handleCitationPress} />
  ), [handleCitationPress]);

  const keyExtractor = useCallback((item: ChatMessage) => item.id, []);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <FlatList
          ref={flatListRef}
          data={listData}
          renderItem={renderMessage}
          keyExtractor={keyExtractor}
          contentContainerStyle={styles.messageList}
          ListHeaderComponent={
            <View style={styles.header}>
              <Icon name="book-open-variant" size={40} color={Colors.primary} />
              <Text style={styles.headerTitle}>Ask the Griot</Text>
              <Text style={styles.headerSubtitle}>
                Your family's storyteller and historian
              </Text>
            </View>
          }
          ListFooterComponent={
            <>
              {isNewSession && (
                <SuggestedQuestions
                  questions={SUGGESTED_QUESTIONS}
                  onSelect={handleSuggestedQuestion}
                />
              )}
              {isTyping && <TypingIndicator />}
              {error && (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              )}
            </>
          }
          onContentSizeChange={() => {
            if (messages.length > 0) {
              flatListRef.current?.scrollToEnd({ animated: true });
            }
          }}
        />
        <ChatInput
          onSend={handleSend}
          disabled={isTyping}
          placeholder={isNewSession ? 'Ask about your family history...' : 'Ask a follow-up question...'}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  messageList: {
    paddingBottom: Spacing.md,
  },
  header: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.md,
  },
  headerTitle: {
    ...Typography.h3,
    color: Colors.textPrimary,
    marginTop: Spacing.sm,
  },
  headerSubtitle: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  errorContainer: {
    marginHorizontal: Spacing.md,
    marginTop: Spacing.sm,
    padding: Spacing.md,
    backgroundColor: '#fef2f2',
    borderRadius: 8,
  },
  errorText: {
    ...Typography.bodySmall,
    color: Colors.error,
    textAlign: 'center',
  },
});
