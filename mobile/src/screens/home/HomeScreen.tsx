import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { PrimaryButton } from '@/components/common/PrimaryButton';
import { SecondaryButton } from '@/components/common/SecondaryButton';
import { Logo } from '@/components/branding/Logo';
import { useAuthStore } from '@/store/authStore';
import { useUIStore } from '@/store/uiStore';
import { Colors, Typography, Spacing, BorderRadius } from '@/styles/tokens';

/**
 * Home Screen
 *
 * Main landing page for authenticated users
 * Shows welcome message, quick actions, and app status
 */
export const HomeScreen = () => {
  const navigation = useNavigation();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const networkStatus = useUIStore((state) => state.networkStatus);

  const handleRecord = () => {
    navigation.navigate('Recording' as never);
  };

  const handleAskGriot = () => {
    navigation.navigate('AskTheGriot' as never);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {/* Logo Header */}
        <View style={styles.logoSection}>
          <Logo size="large" />
          <Text style={styles.tagline}>Preserving African American Stories for Generations</Text>
        </View>

        {/* Welcome Section */}
        <View style={styles.section}>
          <Text style={styles.greeting}>Welcome back,</Text>
          <Text style={styles.userName}>{user?.name}!</Text>
        </View>

        {/* Network Status */}
        <View style={[styles.card, styles.statusCard]}>
          <Icon
            name={networkStatus === 'online' ? 'wifi' : 'wifi-off'}
            size={24}
            color={networkStatus === 'online' ? Colors.success : Colors.error}
          />
          <Text style={styles.statusText}>
            {networkStatus === 'online' ? 'Online' : 'Offline'}
            {networkStatus === 'offline' && ' - Recording available'}
          </Text>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            <View style={styles.actionCard}>
              <Icon name="video" size={40} color={Colors.primary} />
              <Text style={styles.actionCardTitle}>Record Story</Text>
              <Text style={styles.actionCardDescription}>
                Capture precious memories
              </Text>
              <PrimaryButton
                title="Record"
                onPress={handleRecord}
                style={styles.actionButton}
              />
            </View>
            <View style={styles.actionCard}>
              <Icon name="book-open-variant" size={40} color={Colors.primary} />
              <Text style={styles.actionCardTitle}>Ask the Griot</Text>
              <Text style={styles.actionCardDescription}>
                Explore your family history
              </Text>
              <SecondaryButton
                title="Ask"
                onPress={handleAskGriot}
                style={styles.actionButton}
              />
            </View>
          </View>
        </View>

        {/* Storage Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Info</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Membership:</Text>
              <Text style={styles.infoValue}>{user?.membershipTier?.toUpperCase()}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Storage Used:</Text>
              <Text style={styles.infoValue}>
                {((user?.storageUsed || 0) / 1073741824).toFixed(2)} GB / {' '}
                {((user?.storageQuota || 0) / 1073741824).toFixed(0)} GB
              </Text>
            </View>
          </View>
        </View>

        {/* Dev Actions */}
        <View style={styles.section}>
          <PrimaryButton
            title="Logout"
            onPress={logout}
            style={styles.logoutButton}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
    paddingTop: Spacing.md,
  },
  tagline: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: Spacing.md,
    fontStyle: 'italic',
  },
  section: {
    marginBottom: Spacing.xl,
  },
  greeting: {
    ...Typography.h3,
    color: Colors.textSecondary,
  },
  userName: {
    ...Typography.h1,
    color: Colors.textPrimary,
    marginTop: Spacing.xs,
  },
  sectionTitle: {
    ...Typography.h3,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  statusCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.medium,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    ...Colors.elevation.small,
  },
  statusText: {
    ...Typography.bodySmall,
    color: Colors.textPrimary,
  },
  actionsGrid: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  actionCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.medium,
    padding: Spacing.md,
    alignItems: 'center',
    ...Colors.elevation.small,
  },
  actionCardTitle: {
    ...Typography.h5,
    color: Colors.textPrimary,
    marginTop: Spacing.sm,
    marginBottom: Spacing.xs,
    textAlign: 'center',
  },
  actionCardDescription: {
    ...Typography.caption,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  actionButton: {
    width: '100%',
  },
  infoCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.medium,
    padding: Spacing.lg,
    ...Colors.elevation.small,
  },
  infoTitle: {
    ...Typography.h4,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  infoText: {
    ...Typography.body,
    color: Colors.textSecondary,
    lineHeight: 24,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  infoLabel: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  infoValue: {
    ...Typography.bodyBold,
    color: Colors.textPrimary,
  },
  logoutButton: {
    marginTop: Spacing.lg,
  },
});
