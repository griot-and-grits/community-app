import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { ChatMessage, SourceCitation } from '@/types/chat';
import { SourceCitationLink } from './SourceCitationLink';
import { Colors, Typography, Spacing, BorderRadius } from '@/styles/tokens';

interface ChatBubbleProps {
  message: ChatMessage;
  onCitationPress: (citation: SourceCitation) => void;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ message, onCitationPress }) => {
  const isUser = message.role === 'user';

  return (
    <View style={[styles.container, isUser ? styles.userContainer : styles.griotContainer]}>
      {!isUser && (
        <View style={styles.avatarContainer}>
          <Icon name="book-open-variant" size={18} color={Colors.primary} />
        </View>
      )}
      <View style={[styles.bubble, isUser ? styles.userBubble : styles.griotBubble]}>
        <Text style={[styles.messageText, isUser ? styles.userText : styles.griotText]}>
          {message.content}
        </Text>
        {message.citations && message.citations.length > 0 && (
          <View style={styles.citationsContainer}>
            {message.citations.map((citation, index) => (
              <SourceCitationLink
                key={`${citation.videoId}-${index}`}
                citation={citation}
                onPress={onCitationPress}
              />
            ))}
          </View>
        )}
        <Text style={[styles.timestamp, isUser ? styles.userTimestamp : styles.griotTimestamp]}>
          {formatTime(message.timestamp)}
        </Text>
      </View>
    </View>
  );
};

function formatTime(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginVertical: Spacing.xs,
    marginHorizontal: Spacing.md,
  },
  userContainer: {
    justifyContent: 'flex-end',
  },
  griotContainer: {
    justifyContent: 'flex-start',
  },
  avatarContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.cream,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
    marginTop: Spacing.xs,
  },
  bubble: {
    maxWidth: '80%',
    padding: Spacing.md,
    borderRadius: BorderRadius.xlarge,
  },
  userBubble: {
    backgroundColor: Colors.primary,
    borderBottomRightRadius: BorderRadius.small,
    marginLeft: 'auto',
  },
  griotBubble: {
    backgroundColor: Colors.surface,
    borderBottomLeftRadius: BorderRadius.small,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  messageText: {
    ...Typography.body,
    lineHeight: 22,
  },
  userText: {
    color: Colors.textOnPrimary,
  },
  griotText: {
    color: Colors.textPrimary,
  },
  citationsContainer: {
    marginTop: Spacing.sm,
  },
  timestamp: {
    ...Typography.caption,
    marginTop: Spacing.xs,
  },
  userTimestamp: {
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'right',
  },
  griotTimestamp: {
    color: Colors.textSecondary,
  },
});
