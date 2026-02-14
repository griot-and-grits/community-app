import { Camera, CameraDevice, VideoFile } from 'react-native-vision-camera';
import { AppState, AppStateStatus } from 'react-native';
import RNFS from 'react-native-fs';
import { permissionManager } from '@/utils/permissions/PermissionManager';
import { useRecordingStore } from '@/store/recordingStore';

export type VideoQuality = 'low' | 'medium' | 'high' | 'max';

export interface RecordingConfig {
  quality: VideoQuality;
  maxDuration?: number; // in seconds, default 3600 (60 minutes)
  onDurationUpdate?: (duration: number) => void;
  onWarning?: (warningType: 'approaching_limit' | 'limit_reached') => void;
  onInterruption?: (reason: 'call' | 'background') => void;
}

export interface RecordingResult {
  filePath: string;
  duration: number;
  fileSize: number;
}

/**
 * VideoRecordingService
 *
 * Manages video recording with react-native-vision-camera
 * Handles permissions, interruptions, and quality settings
 */
class VideoRecordingService {
  private static instance: VideoRecordingService;
  private camera: React.RefObject<Camera> | null = null;
  private config: RecordingConfig | null = null;
  private durationInterval: NodeJS.Timeout | null = null;
  private appStateSubscription: any = null;
  private isCurrentlyRecording: boolean = false;
  private readonly MAX_DURATION_DEFAULT = 3600; // 60 minutes
  private readonly WARNING_THRESHOLD = 3300; // 55 minutes

  private constructor() {
    this.setupAppStateListener();
  }

  public static getInstance(): VideoRecordingService {
    if (!VideoRecordingService.instance) {
      VideoRecordingService.instance = new VideoRecordingService();
    }
    return VideoRecordingService.instance;
  }

  /**
   * Set camera reference
   */
  setCameraRef(ref: React.RefObject<Camera>): void {
    this.camera = ref;
  }

  /**
   * Check camera and microphone permissions
   */
  async checkPermissions(): Promise<boolean> {
    const cameraStatus = await permissionManager.checkPermission('camera');
    const micStatus = await permissionManager.checkPermission('microphone');

    return cameraStatus === 'granted' && micStatus === 'granted';
  }

  /**
   * Request camera and microphone permissions
   */
  async requestPermissions(): Promise<boolean> {
    console.log('[VideoRecordingService] Requesting permissions...');

    const permissions = await permissionManager.requestMultiplePermissions(['camera', 'microphone']);

    const granted = permissions.camera === 'granted' && permissions.microphone === 'granted';

    if (granted) {
      console.log('[VideoRecordingService] Permissions granted');
    } else {
      console.warn('[VideoRecordingService] Permissions denied:', permissions);
    }

    return granted;
  }

  /**
   * Start recording
   */
  async startRecording(config: RecordingConfig): Promise<void> {
    if (!this.camera?.current) {
      throw new Error('Camera reference not set');
    }

    // Check permissions
    const hasPermissions = await this.checkPermissions();
    if (!hasPermissions) {
      const granted = await this.requestPermissions();
      if (!granted) {
        throw new Error('Camera and microphone permissions required');
      }
    }

    this.config = config;
    const maxDuration = config.maxDuration || this.MAX_DURATION_DEFAULT;

    console.log(`[VideoRecordingService] Starting recording (max: ${maxDuration}s)`);

    try {
      // Set recording flag BEFORE starting
      this.isCurrentlyRecording = true;

      // Start recording with quality settings
      await this.camera.current.startRecording({
        flash: 'off',
        onRecordingFinished: (video: VideoFile) => {
          this.isCurrentlyRecording = false;
          this.handleRecordingFinished(video);
        },
        onRecordingError: (error: any) => {
          console.error('[VideoRecordingService] Recording error:', error);
          this.isCurrentlyRecording = false;
          this.stopDurationTracking();
        },
        videoBitRate: this.getVideoBitRate(config.quality),
        videoCodec: 'h264',
      });

      // Start duration tracking
      this.startDurationTracking(maxDuration);

      console.log('[VideoRecordingService] Recording started successfully');
    } catch (error) {
      console.error('[VideoRecordingService] Failed to start recording:', error);
      this.isCurrentlyRecording = false;
      throw error;
    }
  }

  /**
   * Pause recording
   */
  async pauseRecording(): Promise<void> {
    if (!this.isCurrentlyRecording) {
      console.warn('[VideoRecordingService] No active recording to pause');
      return;
    }

    console.log('[VideoRecordingService] Pausing recording');

    if (!this.camera?.current) {
      throw new Error('Camera reference not set');
    }

    try {
      await this.camera.current.pauseRecording();
      this.stopDurationTracking();
      console.log('[VideoRecordingService] Recording paused');
    } catch (error) {
      console.error('[VideoRecordingService] Failed to pause recording:', error);
      throw error;
    }
  }

  /**
   * Resume recording
   */
  async resumeRecording(): Promise<void> {
    console.log('[VideoRecordingService] Resuming recording');

    if (!this.camera?.current) {
      throw new Error('Camera reference not set');
    }

    try {
      await this.camera.current.resumeRecording();

      // Resume duration tracking
      if (this.config) {
        const maxDuration = this.config.maxDuration || this.MAX_DURATION_DEFAULT;
        this.startDurationTracking(maxDuration);
      }

      console.log('[VideoRecordingService] Recording resumed');
    } catch (error) {
      console.error('[VideoRecordingService] Failed to resume recording:', error);
      throw error;
    }
  }

  /**
   * Stop recording
   */
  async stopRecording(): Promise<void> {
    if (!this.isCurrentlyRecording) {
      console.warn('[VideoRecordingService] No active recording to stop');
      return;
    }

    console.log('[VideoRecordingService] Stopping recording');

    if (!this.camera?.current) {
      throw new Error('Camera reference not set');
    }

    try {
      await this.camera.current.stopRecording();
      this.stopDurationTracking();
      this.isCurrentlyRecording = false;
      console.log('[VideoRecordingService] Recording stopped');
    } catch (error) {
      console.error('[VideoRecordingService] Failed to stop recording:', error);
      this.isCurrentlyRecording = false;
      throw error;
    }
  }

  /**
   * Handle recording finished
   */
  private async handleRecordingFinished(video: VideoFile): Promise<void> {
    console.log('[VideoRecordingService] Recording finished:', video.path);

    try {
      // Get file stats
      const stats = await RNFS.stat(video.path);
      const fileSize = parseInt(stats.size, 10);

      // Get duration from recording store
      const recordingStore = useRecordingStore.getState();
      const duration = recordingStore.duration;

      console.log(`[VideoRecordingService] File size: ${(fileSize / 1024 / 1024).toFixed(2)} MB`);
      console.log(`[VideoRecordingService] Duration: ${duration}s`);

      // Update file path in recording store with actual path
      recordingStore.updateFilePath(video.path);

      // Stop recording in store (this sets isRecording to false)
      recordingStore.stopRecording();

    } catch (error) {
      console.error('[VideoRecordingService] Error processing finished recording:', error);
    }
  }

  /**
   * Start tracking recording duration
   */
  private startDurationTracking(maxDuration: number): void {
    if (this.durationInterval) {
      clearInterval(this.durationInterval);
    }

    this.durationInterval = setInterval(() => {
      // Get fresh state on each tick
      const recordingStore = useRecordingStore.getState();
      const currentDuration = recordingStore.duration;
      const newDuration = currentDuration + 1;

      // Update duration
      recordingStore.updateDuration(newDuration);

      if (this.config?.onDurationUpdate) {
        this.config.onDurationUpdate(newDuration);
      }

      // Check for warnings
      if (newDuration === this.WARNING_THRESHOLD && this.config?.onWarning) {
        this.config.onWarning('approaching_limit');
      }

      // Check for limit
      if (newDuration >= maxDuration) {
        console.warn('[VideoRecordingService] Max duration reached, stopping recording');
        if (this.config?.onWarning) {
          this.config.onWarning('limit_reached');
        }
        this.stopRecording();
      }
    }, 1000);
  }

  /**
   * Stop duration tracking
   */
  private stopDurationTracking(): void {
    if (this.durationInterval) {
      clearInterval(this.durationInterval);
      this.durationInterval = null;
    }
  }

  /**
   * Setup app state listener for interruption handling
   * Note: VisionCamera handles backgrounding automatically, so we just log it
   */
  private setupAppStateListener(): void {
    this.appStateSubscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
      const recordingStore = useRecordingStore.getState();

      if (recordingStore.isRecording && !recordingStore.isPaused) {
        if (nextAppState === 'background' || nextAppState === 'inactive') {
          console.log('[VideoRecordingService] App backgrounded - VisionCamera will handle recording pause');

          // Don't manually pause - VisionCamera handles this
          // Just notify the UI if callback is set
          if (this.config?.onInterruption) {
            this.config.onInterruption('background');
          }
        }
      }
    });
  }

  /**
   * Get video bit rate based on quality
   */
  private getVideoBitRate(quality: VideoQuality): number {
    switch (quality) {
      case 'low':
        return 1000000; // 1 Mbps (240p/480p)
      case 'medium':
        return 3000000; // 3 Mbps (480p/720p)
      case 'high':
        return 8000000; // 8 Mbps (720p/1080p)
      case 'max':
        return 15000000; // 15 Mbps (1080p/4K)
      default:
        return 8000000;
    }
  }

  /**
   * Get available camera devices
   */
  async getDevices(): Promise<CameraDevice[]> {
    const devices = await Camera.getAvailableCameraDevices();
    return devices;
  }

  /**
   * Get back camera device
   */
  async getBackCamera(): Promise<CameraDevice | null> {
    const devices = await this.getDevices();
    return devices.find(d => d.position === 'back') || null;
  }

  /**
   * Get front camera device
   */
  async getFrontCamera(): Promise<CameraDevice | null> {
    const devices = await this.getDevices();
    return devices.find(d => d.position === 'front') || null;
  }

  /**
   * Cleanup
   */
  cleanup(): void {
    this.stopDurationTracking();
    if (this.appStateSubscription) {
      this.appStateSubscription.remove();
    }
  }
}

export const videoRecordingService = VideoRecordingService.getInstance();
export default videoRecordingService;
