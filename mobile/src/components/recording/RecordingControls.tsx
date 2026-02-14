import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors, Spacing } from '@/styles/tokens';

interface RecordingControlsProps {
  isRecording: boolean;
  isPaused: boolean;
  onStartPress: () => void;
  onPausePress: () => void;
  onResumePress: () => void;
  onStopPress: () => void;
  disabled?: boolean;
}

export const RecordingControls: React.FC<RecordingControlsProps> = ({
  isRecording,
  isPaused,
  onStartPress,
  onPausePress,
  onResumePress,
  onStopPress,
  disabled = false,
}) => {
  if (!isRecording) {
    // Show start button
    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={[styles.recordButton, disabled && styles.disabled]}
          onPress={onStartPress}
          disabled={disabled}
        >
          <View style={styles.recordButtonInner} />
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Stop button */}
      <TouchableOpacity
        style={[styles.controlButton, disabled && styles.disabled]}
        onPress={onStopPress}
        disabled={disabled}
      >
        <Icon name="stop" size={32} color={Colors.white} />
      </TouchableOpacity>

      {/* Pause/Resume button */}
      <TouchableOpacity
        style={[styles.controlButton, styles.pauseButton, disabled && styles.disabled]}
        onPress={isPaused ? onResumePress : onPausePress}
        disabled={disabled}
      >
        <Icon name={isPaused ? 'play' : 'pause'} size={32} color={Colors.white} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xl,
  },
  recordButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.error,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: Colors.white,
  },
  recordButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.error,
  },
  controlButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pauseButton: {
    backgroundColor: Colors.warning,
  },
  disabled: {
    opacity: 0.5,
  },
});
