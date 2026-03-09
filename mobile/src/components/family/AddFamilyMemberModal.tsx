import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors, Typography, Spacing, BorderRadius } from '@/styles/tokens';

interface AddFamilyMemberModalProps {
  visible: boolean;
  onClose: () => void;
  onInvite: () => void;
  onAddManually: () => void;
  onImportAncestry: () => void;
}

export const AddFamilyMemberModal: React.FC<AddFamilyMemberModalProps> = ({
  visible,
  onClose,
  onInvite,
  onAddManually,
  onImportAncestry,
}) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <TouchableOpacity style={styles.modal} activeOpacity={1}>
          <View style={styles.header}>
            <Icon name="account-plus" size={40} color={Colors.primary} />
            <Text style={styles.title}>Add Family Member</Text>
            <Text style={styles.subtitle}>
              Grow your family tree and preserve more stories together.
            </Text>
          </View>

          <View style={styles.options}>
            <TouchableOpacity style={styles.option} onPress={onInvite}>
              <View style={[styles.optionIcon, { backgroundColor: '#E8F5E9' }]}>
                <Icon name="email-outline" size={24} color="#2E7D32" />
              </View>
              <View style={styles.optionContent}>
                <Text style={styles.optionTitle}>Invite Family Members</Text>
                <Text style={styles.optionDescription}>
                  Send an invitation to one or more family members to join and share their stories.
                </Text>
              </View>
              <Icon name="chevron-right" size={24} color={Colors.textSecondary} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.option} onPress={onAddManually}>
              <View style={[styles.optionIcon, { backgroundColor: '#E3F2FD' }]}>
                <Icon name="account-edit" size={24} color="#1565C0" />
              </View>
              <View style={styles.optionContent}>
                <Text style={styles.optionTitle}>Add Manually</Text>
                <Text style={styles.optionDescription}>
                  Enter a family member's name and relationship to add them to your tree.
                </Text>
              </View>
              <Icon name="chevron-right" size={24} color={Colors.textSecondary} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.option} onPress={onImportAncestry}>
              <View style={[styles.optionIcon, { backgroundColor: '#FFF3E0' }]}>
                <Icon name="file-tree" size={24} color="#E65100" />
              </View>
              <View style={styles.optionContent}>
                <Text style={styles.optionTitle}>Import from Ancestry.com</Text>
                <Text style={styles.optionDescription}>
                  Connect your Ancestry.com account to import your existing family tree.
                </Text>
              </View>
              <Icon name="chevron-right" size={24} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      </TouchableOpacity>
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
  header: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  title: {
    ...Typography.h3,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginTop: Spacing.md,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  options: {
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    backgroundColor: Colors.cream,
    borderRadius: BorderRadius.medium,
    gap: Spacing.md,
  },
  optionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    ...Typography.bodySmall,
    color: Colors.textPrimary,
    fontWeight: '700',
    marginBottom: 2,
  },
  optionDescription: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontSize: 11,
    lineHeight: 16,
  },
  cancelButton: {
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  cancelText: {
    ...Typography.body,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
});
