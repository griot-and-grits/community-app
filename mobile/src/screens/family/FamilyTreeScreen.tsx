import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { PrimaryButton } from '@/components/common/PrimaryButton';
import { Colors, Typography, Spacing, BorderRadius } from '@/styles/tokens';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const NODE_SIZE = 60;
const NODE_SPACING = 40;

interface FamilyMember {
  id: string;
  name: string;
  relationship: string;
  storyCount: number;
  generation: number;
  children?: string[];
}

/**
 * FamilyTreeScreen
 *
 * Interactive family tree with story connections
 */
export const FamilyTreeScreen = () => {
  const navigation = useNavigation();

  // Mock family tree data
  const [familyMembers] = useState<FamilyMember[]>([
    {
      id: '1',
      name: 'Grandma Rose',
      relationship: 'Grandmother',
      storyCount: 8,
      generation: 0,
      children: ['2', '3'],
    },
    {
      id: '2',
      name: 'Uncle James',
      relationship: 'Uncle',
      storyCount: 5,
      generation: 1,
      children: ['4'],
    },
    {
      id: '3',
      name: 'Mom Sarah',
      relationship: 'Mother',
      storyCount: 12,
      generation: 1,
      children: ['5'],
    },
    {
      id: '4',
      name: 'Cousin Marcus',
      relationship: 'Cousin',
      storyCount: 3,
      generation: 2,
    },
    {
      id: '5',
      name: 'You',
      relationship: 'Self',
      storyCount: 4,
      generation: 2,
    },
  ]);

  const handleMemberPress = (member: FamilyMember) => {
    // Navigate to member's profile or stories
    console.log('View member:', member.name);
  };

  const handleAddMember = () => {
    console.log('Add family member');
  };

  const renderFamilyNode = (member: FamilyMember) => (
    <TouchableOpacity
      key={member.id}
      style={styles.node}
      onPress={() => handleMemberPress(member)}
    >
      <View style={[styles.avatar, member.id === '5' && styles.avatarSelf]}>
        <Icon name="account" size={28} color={Colors.white} />
      </View>
      <Text style={styles.nodeName} numberOfLines={1}>
        {member.name}
      </Text>
      <Text style={styles.nodeRelation}>{member.relationship}</Text>
      {member.storyCount > 0 && (
        <View style={styles.storyBadge}>
          <Icon name="video" size={12} color={Colors.white} />
          <Text style={styles.storyBadgeText}>{member.storyCount}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const renderGeneration = (generation: number) => {
    const members = familyMembers.filter(m => m.generation === generation);

    return (
      <View key={generation} style={styles.generation}>
        <View style={styles.generationLabel}>
          <Text style={styles.generationText}>
            Generation {generation === 0 ? 'I' : generation === 1 ? 'II' : 'III'}
          </Text>
        </View>
        <View style={styles.generationMembers}>
          {members.map(member => renderFamilyNode(member))}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Family Tree</Text>
          <Text style={styles.subtitle}>
            Explore your family history and stories
          </Text>
        </View>

        {/* Tree Visualization */}
        <View style={styles.treeContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.tree}>
              {[0, 1, 2].map(generation => renderGeneration(generation))}
            </View>
          </ScrollView>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Icon name="account-group" size={32} color={Colors.primary} />
            <Text style={styles.statValue}>{familyMembers.length}</Text>
            <Text style={styles.statLabel}>Family Members</Text>
          </View>
          <View style={styles.statCard}>
            <Icon name="video" size={32} color={Colors.primary} />
            <Text style={styles.statValue}>
              {familyMembers.reduce((sum, m) => sum + m.storyCount, 0)}
            </Text>
            <Text style={styles.statLabel}>Total Stories</Text>
          </View>
          <View style={styles.statCard}>
            <Icon name="trophy" size={32} color={Colors.tertiary} />
            <Text style={styles.statValue}>3</Text>
            <Text style={styles.statLabel}>Generations</Text>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <PrimaryButton
            title="Add Family Member"
            onPress={handleAddMember}
          />
          <Text style={styles.helpText}>
            Build your family tree and connect stories to relatives
          </Text>
        </View>

        {/* Features */}
        <View style={styles.features}>
          <Text style={styles.featuresTitle}>Coming Soon</Text>
          <View style={styles.feature}>
            <Icon name="link-variant" size={24} color={Colors.textSecondary} />
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>Link Stories</Text>
              <Text style={styles.featureDescription}>
                Connect stories to family members
              </Text>
            </View>
          </View>
          <View style={styles.feature}>
            <Icon name="family-tree" size={24} color={Colors.textSecondary} />
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>Expand Tree</Text>
              <Text style={styles.featureDescription}>
                Add multiple generations and relationships
              </Text>
            </View>
          </View>
          <View style={styles.feature}>
            <Icon name="share-variant" size={24} color={Colors.textSecondary} />
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>Share with Family</Text>
              <Text style={styles.featureDescription}>
                Collaborate on your family tree together
              </Text>
            </View>
          </View>
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
  },
  header: {
    marginBottom: Spacing.xl,
  },
  title: {
    ...Typography.h2,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  treeContainer: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.medium,
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
    ...Colors.elevation.small,
  },
  tree: {
    minWidth: SCREEN_WIDTH - 64,
  },
  generation: {
    marginBottom: Spacing.xl,
  },
  generationLabel: {
    marginBottom: Spacing.md,
  },
  generationText: {
    ...Typography.label,
    color: Colors.textSecondary,
  },
  generationMembers: {
    flexDirection: 'row',
    gap: NODE_SPACING,
    flexWrap: 'wrap',
  },
  node: {
    width: NODE_SIZE * 1.5,
    alignItems: 'center',
  },
  avatar: {
    width: NODE_SIZE,
    height: NODE_SIZE,
    borderRadius: NODE_SIZE / 2,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xs,
    position: 'relative',
  },
  avatarSelf: {
    borderWidth: 3,
    borderColor: Colors.tertiary,
  },
  nodeName: {
    ...Typography.caption,
    color: Colors.textPrimary,
    fontWeight: '600',
    textAlign: 'center',
  },
  nodeRelation: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontSize: 10,
    textAlign: 'center',
  },
  storyBadge: {
    position: 'absolute',
    top: 0,
    right: 8,
    backgroundColor: Colors.tertiary,
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  storyBadgeText: {
    ...Typography.caption,
    color: Colors.white,
    fontSize: 10,
    fontWeight: '700',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.medium,
    padding: Spacing.md,
    alignItems: 'center',
    ...Colors.elevation.small,
  },
  statValue: {
    ...Typography.h3,
    color: Colors.textPrimary,
    marginTop: Spacing.xs,
  },
  statLabel: {
    ...Typography.caption,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
  },
  actions: {
    marginBottom: Spacing.xl,
  },
  helpText: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: Spacing.md,
  },
  features: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.medium,
    padding: Spacing.lg,
    ...Colors.elevation.small,
  },
  featuresTitle: {
    ...Typography.h4,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  feature: {
    flexDirection: 'row',
    gap: Spacing.md,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    ...Typography.bodyBold,
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  featureDescription: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
  },
});
