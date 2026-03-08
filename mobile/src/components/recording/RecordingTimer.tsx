import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors, Typography, Spacing } from '@/styles/tokens';

interface RecordingTimerProps {
  duration: number; // in seconds
  maxDuration?: number; // in seconds
  isRecording: boolean;
  isPaused: boolean;
  showWarning?: boolean;
}

export const RecordingTimer: React.FC<RecordingTimerProps> = ({
  duration,
  maxDuration = 3600,
  isRecording,
  isPaused,
  showWarning = false,
}) => {
  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getRemainingTime = (): string => {
    const remaining = maxDuration - duration;
    return formatTime(Math.max(0, remaining));
  };

  const getWarningColor = (): string => {
    if (showWarning) {
      return Colors.warning;
    }
    if (isPaused) {
      return Colors.warning;
    }
    if (isRecording) {
      return Colors.error;
    }
    return Colors.textSecondary;
  };

  return (
    <View style={styles.container}>
      <View style={styles.timeRow}>
        {isRecording && !isPaused && (
          <View style={[styles.recordingIndicator, { backgroundColor: Colors.error }]} />
        )}
        {isPaused && (
          <Icon name="pause-circle" size={20} color={Colors.warning} />
        )}
        <Text style={[styles.time, { color: getWarningColor() }]}>
          {formatTime(duration)}
        </Text>
      </View>

      {showWarning && (
        <Text style={styles.warning}>
          {getRemainingTime()} remaining
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: Spacing.md,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  time: {
    ...Typography.h2,
    fontVariant: ['tabular-nums'],
  },
  recordingIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  warning: {
    ...Typography.caption,
    color: Colors.warning,
    marginTop: Spacing.xs,
  },
});
