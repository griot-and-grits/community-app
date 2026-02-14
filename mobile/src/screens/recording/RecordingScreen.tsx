import React, { useRef, useState, useEffect } from 'react';
import { View, StyleSheet, SafeAreaView, Alert, Text } from 'react-native';
import { Camera, useCameraDevice, useCameraPermission } from 'react-native-vision-camera';
import { useNavigation } from '@react-navigation/native';
import { RecordingControls } from '@/components/recording/RecordingControls';
import { RecordingTimer } from '@/components/recording/RecordingTimer';
import { QualitySelector } from '@/components/recording/QualitySelector';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { useRecordingStore } from '@/store/recordingStore';
import { videoRecordingService, VideoQuality } from '@/services/recording/VideoRecordingService';
import { Colors, Spacing } from '@/styles/tokens';

/**
 * RecordingScreen
 *
 * Main recording screen with camera preview and controls
 */
export const RecordingScreen = () => {
  const navigation = useNavigation();
  const cameraRef = useRef<Camera>(null);
  const device = useCameraDevice('back');
  const { hasPermission, requestPermission } = useCameraPermission();

  const [showWarning, setShowWarning] = useState(false);
  const [cameraActive, setCameraActive] = useState(true);

  const {
    isRecording,
    isPaused,
    duration,
    quality,
    startRecording,
    pauseRecording,
    resumeRecording,
    stopRecording,
    setQuality,
    filePath,
  } = useRecordingStore();

  // Set camera reference on mount and keep it updated
  useEffect(() => {
    videoRecordingService.setCameraRef(cameraRef);
  }, [cameraRef]);

  // Request permissions on mount
  useEffect(() => {
    if (!hasPermission) {
      requestPermission();
    }
  }, [hasPermission, requestPermission]);

  // Check for duration warning (55 minutes)
  useEffect(() => {
    if (duration >= 3300 && duration < 3600) {
      setShowWarning(true);
    } else {
      setShowWarning(false);
    }
  }, [duration]);

  // Handle cleanup on unmount only
  useEffect(() => {
    return () => {
      // Cleanup on unmount - deactivate camera
      // Don't stop recording here - let the service handle it via app state
      setCameraActive(false);
    };
  }, []);

  const handleStart = async () => {
    try {
      console.log('[RecordingScreen] Starting recording...');

      // Ensure camera ref is set
      if (!cameraRef.current) {
        console.error('[RecordingScreen] Camera ref is null');
        Alert.alert('Error', 'Camera not ready. Please try again.');
        return;
      }

      console.log('[RecordingScreen] Camera ref is set, device:', device);

      // Ensure camera ref is set in service
      videoRecordingService.setCameraRef(cameraRef);

      // Start recording in store with temporary path (will be updated when recording finishes)
      startRecording(`recording-${Date.now()}`);
      console.log('[RecordingScreen] Store updated, calling service.startRecording...');

      // Start actual camera recording
      await videoRecordingService.startRecording({
        quality,
        maxDuration: 3600,
        onDurationUpdate: (newDuration) => {
          // Duration is managed by store
        },
        onWarning: (warningType) => {
          if (warningType === 'approaching_limit') {
            Alert.alert(
              'Recording Time Limit',
              'You have 5 minutes remaining. The recording will stop automatically at 60 minutes.',
              [{ text: 'OK' }]
            );
          } else if (warningType === 'limit_reached') {
            Alert.alert(
              'Recording Complete',
              'Maximum recording time of 60 minutes reached.',
              [{ text: 'OK' }]
            );
            handleStop();
          }
        },
        onInterruption: (reason) => {
          if (reason === 'background') {
            Alert.alert(
              'Recording Paused',
              'Recording was paused because the app was backgrounded.',
              [{ text: 'OK' }]
            );
          }
        },
      });

      console.log('[RecordingScreen] Recording started successfully');
    } catch (error) {
      console.error('[RecordingScreen] Failed to start recording:', error);
      Alert.alert('Error', `Failed to start recording: ${error.message || error}`);
    }
  };

  const handlePause = async () => {
    try {
      pauseRecording();
      await videoRecordingService.pauseRecording();
    } catch (error) {
      console.error('Failed to pause recording:', error);
      Alert.alert('Error', 'Failed to pause recording.');
    }
  };

  const handleResume = async () => {
    try {
      resumeRecording();
      await videoRecordingService.resumeRecording();
    } catch (error) {
      console.error('Failed to resume recording:', error);
      Alert.alert('Error', 'Failed to resume recording.');
    }
  };

  const handleStop = async () => {
    try {
      await videoRecordingService.stopRecording();
      stopRecording();

      // Navigate to review screen
      if (filePath) {
        navigation.navigate('Review' as never, { videoPath: filePath } as never);
      }
    } catch (error) {
      console.error('Failed to stop recording:', error);
      Alert.alert('Error', 'Failed to stop recording.');
    }
  };

  const handleQualityChange = (newQuality: VideoQuality) => {
    if (!isRecording) {
      setQuality(newQuality);
    }
  };

  // Show permission request
  if (!hasPermission) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.permissionContainer}>
          <LoadingSpinner message="Requesting camera permissions..." />
        </View>
      </SafeAreaView>
    );
  }

  // Show device not found
  if (!device) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Camera not available</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.cameraContainer}>
        <Camera
          ref={cameraRef}
          style={StyleSheet.absoluteFill}
          device={device}
          isActive={cameraActive}
          video={true}
          audio={true}
        />

        {/* Overlay UI */}
        <View style={styles.overlay}>
          {/* Timer */}
          <View style={styles.topSection}>
            <RecordingTimer
              duration={duration}
              maxDuration={3600}
              isRecording={isRecording}
              isPaused={isPaused}
              showWarning={showWarning}
            />
          </View>

          {/* Controls */}
          <View style={styles.bottomSection}>
            {!isRecording && (
              <View style={styles.qualityContainer}>
                <QualitySelector
                  selected={quality}
                  onSelect={handleQualityChange}
                  disabled={isRecording}
                />
              </View>
            )}

            <View style={styles.controlsContainer}>
              <RecordingControls
                isRecording={isRecording}
                isPaused={isPaused}
                onStartPress={handleStart}
                onPausePress={handlePause}
                onResumePress={handleResume}
                onStopPress={handleStop}
              />
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
  },
  cameraContainer: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
  },
  topSection: {
    paddingTop: Spacing.lg,
    alignItems: 'center',
  },
  bottomSection: {
    paddingBottom: Spacing.xl,
  },
  qualityContainer: {
    marginBottom: Spacing.lg,
  },
  controlsContainer: {
    paddingHorizontal: Spacing.lg,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: Colors.error,
    fontSize: 16,
  },
});
