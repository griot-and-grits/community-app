import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius } from '@/styles/tokens';

interface UploadProgressProps {
  progress: number; // 0-100
  uploadedChunks: number;
  totalChunks: number;
  uploadedBytes: number;
  totalBytes: number;
  status: 'pending' | 'uploading' | 'completed' | 'failed';
  error?: string;
}

export const UploadProgress: React.FC<UploadProgressProps> = ({
  progress,
  uploadedChunks,
  totalChunks,
  uploadedBytes,
  totalBytes,
  status,
  error,
}) => {
  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
  };

  const getStatusColor = (): string => {
    switch (status) {
      case 'completed':
        return Colors.success;
      case 'failed':
        return Colors.error;
      case 'uploading':
        return Colors.primary;
      default:
        return Colors.textSecondary;
    }
  };

  const getStatusText = (): string => {
    switch (status) {
      case 'completed':
        return 'Upload Complete';
      case 'failed':
        return 'Upload Failed';
      case 'uploading':
        return 'Uploading...';
      default:
        return 'Preparing...';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.status, { color: getStatusColor() }]}>
          {getStatusText()}
        </Text>
        <Text style={styles.percentage}>
          {progress.toFixed(0)}%
        </Text>
      </View>

      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBar, { width: `${progress}%` }]} />
      </View>

      <View style={styles.details}>
        <Text style={styles.detailText}>
          {formatBytes(uploadedBytes)} / {formatBytes(totalBytes)}
        </Text>
        <Text style={styles.detailText}>
          Chunk {uploadedChunks} / {totalChunks}
        </Text>
      </View>

      {error && (
        <Text style={styles.error}>{error}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: Spacing.md,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.medium,
    ...Colors.elevation.small,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  status: {
    ...Typography.bodyBold,
  },
  percentage: {
    ...Typography.h4,
    color: Colors.primary,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: Colors.gray200,
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
    marginBottom: Spacing.sm,
  },
  progressBar: {
    height: '100%',
    backgroundColor: Colors.primary,
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailText: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  error: {
    ...Typography.caption,
    color: Colors.error,
    marginTop: Spacing.sm,
  },
});
