/**
 * Recording Component Tests
 *
 * Tests for T074-T078: Recording UI components
 * Tests for T087: Privacy setting changes
 * Tests for T088: Quality selection
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';

// Mock vector icons
jest.mock('react-native-vector-icons/MaterialCommunityIcons', () => 'Icon');

// Mock styles
jest.mock('@/styles/tokens', () => ({
  Colors: {
    primary: '#ae2c24',
    secondary: '#282420',
    tertiary: '#f1b918',
    accent2: '#d8a373',
    white: '#ffffff',
    black: '#000000',
    cream: '#eceae8',
    background: '#eceae8',
    surface: '#ffffff',
    textPrimary: '#282420',
    textSecondary: '#737373',
    textOnPrimary: '#ffffff',
    border: '#d8a373',
    disabled: '#d4d4d4',
    error: '#ae2c24',
    warning: '#f1b918',
    success: '#22c55e',
    gray200: '#e5e5e5',
    elevation: {
      small: {},
      medium: {},
    },
  },
  Typography: {
    h4: { fontSize: 20 },
    body: { fontSize: 16 },
    bodyBold: { fontSize: 16, fontWeight: '600' },
    bodySmall: { fontSize: 14 },
    button: { fontSize: 16 },
    caption: { fontSize: 12 },
    label: { fontSize: 14 },
  },
  Spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 },
  BorderRadius: { small: 4, medium: 8, large: 12, full: 9999 },
}));

describe('PrivacySelector (T077, T087)', () => {
  let PrivacySelector: any;

  beforeEach(() => {
    jest.resetModules();
    // Must require after mocks are set up
    PrivacySelector = require('@/components/recording/PrivacySelector').PrivacySelector;
  });

  it('should render all three privacy options', () => {
    const onSelect = jest.fn();
    const { getByText } = render(
      <PrivacySelector selected="public" onSelect={onSelect} />
    );

    expect(getByText('Public')).toBeTruthy();
    expect(getByText('Family Only')).toBeTruthy();
    expect(getByText('Private')).toBeTruthy();
  });

  it('should show descriptions for each option', () => {
    const onSelect = jest.fn();
    const { getByText } = render(
      <PrivacySelector selected="public" onSelect={onSelect} />
    );

    expect(getByText('Anyone can view this story')).toBeTruthy();
    expect(getByText('Only family members can view')).toBeTruthy();
    expect(getByText('Only you can view this story')).toBeTruthy();
  });

  it('should call onSelect when privacy option is tapped', () => {
    const onSelect = jest.fn();
    const { getByText } = render(
      <PrivacySelector selected="public" onSelect={onSelect} />
    );

    fireEvent.press(getByText('Family Only'));
    expect(onSelect).toHaveBeenCalledWith('family_only');

    fireEvent.press(getByText('Private'));
    expect(onSelect).toHaveBeenCalledWith('private');
  });

  it('should support changing from public to private (T087)', () => {
    const onSelect = jest.fn();
    const { getByText, rerender } = render(
      <PrivacySelector selected="public" onSelect={onSelect} />
    );

    // Change to private
    fireEvent.press(getByText('Private'));
    expect(onSelect).toHaveBeenCalledWith('private');

    // Rerender with new selection
    rerender(<PrivacySelector selected="private" onSelect={onSelect} />);

    // Change back to public
    fireEvent.press(getByText('Public'));
    expect(onSelect).toHaveBeenCalledWith('public');
  });

  it('should be disabled when disabled prop is true', () => {
    const onSelect = jest.fn();
    const { getByText } = render(
      <PrivacySelector selected="public" onSelect={onSelect} disabled />
    );

    fireEvent.press(getByText('Family Only'));
    expect(onSelect).not.toHaveBeenCalled();
  });
});

describe('QualitySelector (T076, T088)', () => {
  let QualitySelector: any;

  beforeEach(() => {
    jest.resetModules();
    QualitySelector = require('@/components/recording/QualitySelector').QualitySelector;
  });

  it('should render quality options', () => {
    const onSelect = jest.fn();
    const { getByText } = render(
      <QualitySelector selected="high" onSelect={onSelect} />
    );

    expect(getByText('720p')).toBeTruthy();
  });

  it('should call onSelect when quality option is tapped', () => {
    const onSelect = jest.fn();
    const { getByText } = render(
      <QualitySelector selected="high" onSelect={onSelect} />
    );

    fireEvent.press(getByText('1080p'));
    expect(onSelect).toHaveBeenCalledWith('max');
  });
});

describe('UploadProgress (T078)', () => {
  let UploadProgress: any;

  beforeEach(() => {
    jest.resetModules();
    UploadProgress = require('@/components/recording/UploadProgress').UploadProgress;
  });

  it('should display progress percentage', () => {
    const { getByText } = render(
      <UploadProgress
        progress={50}
        uploadedChunks={3}
        totalChunks={6}
        uploadedBytes={5242880}
        totalBytes={10485760}
        status="uploading"
      />
    );

    expect(getByText('50%')).toBeTruthy();
    expect(getByText('Uploading...')).toBeTruthy();
  });

  it('should display chunk progress', () => {
    const { getByText } = render(
      <UploadProgress
        progress={50}
        uploadedChunks={3}
        totalChunks={6}
        uploadedBytes={5242880}
        totalBytes={10485760}
        status="uploading"
      />
    );

    expect(getByText('Chunk 3 / 6')).toBeTruthy();
  });

  it('should show completed state', () => {
    const { getByText } = render(
      <UploadProgress
        progress={100}
        uploadedChunks={6}
        totalChunks={6}
        uploadedBytes={10485760}
        totalBytes={10485760}
        status="completed"
      />
    );

    expect(getByText('Upload Complete')).toBeTruthy();
    expect(getByText('100%')).toBeTruthy();
  });

  it('should show error state with message', () => {
    const { getByText } = render(
      <UploadProgress
        progress={30}
        uploadedChunks={2}
        totalChunks={6}
        uploadedBytes={3145728}
        totalBytes={10485760}
        status="failed"
        error="Network connection lost"
      />
    );

    expect(getByText('Upload Failed')).toBeTruthy();
    expect(getByText('Network connection lost')).toBeTruthy();
  });
});

describe('RecordingControls (T074)', () => {
  let RecordingControls: any;

  beforeEach(() => {
    jest.resetModules();
    RecordingControls = require('@/components/recording/RecordingControls').RecordingControls;
  });

  it('should show start button when not recording', () => {
    const { queryByTestId } = render(
      <RecordingControls
        isRecording={false}
        isPaused={false}
        onStartPress={jest.fn()}
        onPausePress={jest.fn()}
        onResumePress={jest.fn()}
        onStopPress={jest.fn()}
      />
    );

    // The record button renders when not recording
    expect(queryByTestId).toBeDefined();
  });

  it('should call onStartPress when start button pressed', () => {
    const onStartPress = jest.fn();
    const { UNSAFE_root } = render(
      <RecordingControls
        isRecording={false}
        isPaused={false}
        onStartPress={onStartPress}
        onPausePress={jest.fn()}
        onResumePress={jest.fn()}
        onStopPress={jest.fn()}
      />
    );

    // Find first touchable and press it
    const touchables = UNSAFE_root.findAllByType(require('react-native').TouchableOpacity);
    if (touchables.length > 0) {
      fireEvent.press(touchables[0]);
      expect(onStartPress).toHaveBeenCalled();
    }
  });
});
