import React from 'react';
import { View, Text, StyleSheet, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { PrimaryButton } from '@/components/common/PrimaryButton';
import { SecondaryButton } from '@/components/common/SecondaryButton';
import { Colors, Typography, Spacing, BorderRadius } from '@/styles/tokens';

interface GriotPromptModalProps {
  visible: boolean;
  onGuideMe: () => void;
  onRecordAlone: () => void;
}

export const GriotPromptModal: React.FC<GriotPromptModalProps> = ({
  visible,
  onGuideMe,
  onRecordAlone,
}) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.iconContainer}>
            <Icon name="book-open-variant" size={56} color={Colors.primary} />
          </View>

          <Text style={styles.title}>Be Your Family's Griot</Text>

          <Text style={styles.message}>
            In West African tradition, the griot is the keeper of history — the one who ensures
            that the stories, wisdom, and voices of a family are never lost.
          </Text>

          <Text style={styles.message}>
            Today, you have the chance to be that person for your family. Every story you capture
            becomes a gift that future generations will treasure.
          </Text>

          <Text style={styles.prompt}>
            Would you like a guide to walk you through capturing your family's most important stories?
          </Text>

          <View style={styles.buttonContainer}>
            <PrimaryButton
              title="Guide Me"
              onPress={onGuideMe}
              style={styles.button}
            />
            <SecondaryButton
              title="I'll Record on My Own"
              onPress={onRecordAlone}
              style={styles.button}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.lg,
  },
  modal: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.large,
    padding: Spacing.xl,
    width: '100%',
    maxWidth: 400,
    ...Colors.elevation.medium,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  title: {
    ...Typography.h2,
    color: Colors.primary,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  message: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.md,
    lineHeight: 24,
  },
  prompt: {
    ...Typography.body,
    color: Colors.textPrimary,
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: Spacing.xl,
    lineHeight: 24,
  },
  buttonContainer: {
    gap: Spacing.md,
  },
  button: {
    width: '100%',
  },
});
