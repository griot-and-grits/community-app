import React, { useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import {
  GestureHandlerRootView,
  PinchGestureHandler,
  PanGestureHandler,
  PinchGestureHandlerGestureEvent,
  PanGestureHandlerGestureEvent,
  State,
} from 'react-native-gesture-handler';
import { FamilyMemberNode, NODE_WIDTH, NODE_HEIGHT } from './FamilyMemberNode';
import {
  FamilyMember,
  getFamilyMembersByGeneration,
  getGenerationCount,
} from '@/data/familyTree';
import { Colors, Typography, Spacing } from '@/styles/tokens';

interface FamilyTreeViewProps {
  onMemberPress: (member: FamilyMember) => void;
}

const HORIZONTAL_GAP = 16;
const VERTICAL_GAP = 60;
const SPOUSE_GAP = 8;
const CONNECTOR_COLOR = Colors.accent2;
const GENERATION_LABELS = ['Grandparents', 'Parents', 'Children'];
const MIN_SCALE = 0.4;
const MAX_SCALE = 2.5;

function buildFamilyUnits(members: FamilyMember[]): FamilyMember[][] {
  const visited = new Set<string>();
  const units: FamilyMember[][] = [];

  for (const member of members) {
    if (visited.has(member.id)) continue;
    visited.add(member.id);

    if (member.spouseId) {
      const spouse = members.find(m => m.id === member.spouseId);
      if (spouse && !visited.has(spouse.id)) {
        visited.add(spouse.id);
        if (member.parentIds.length > 0) {
          units.push([member, spouse]);
        } else {
          units.push([spouse, member]);
        }
        continue;
      }
    }
    units.push([member]);
  }

  return units;
}

function getUnitWidth(unit: FamilyMember[]): number {
  if (unit.length === 2) {
    return NODE_WIDTH * 2 + SPOUSE_GAP;
  }
  return NODE_WIDTH;
}

export const FamilyTreeView: React.FC<FamilyTreeViewProps> = ({ onMemberPress }) => {
  const generationCount = getGenerationCount();

  // Use separate Animated.Values for base (accumulated) and live (during-gesture) offsets.
  // Combining them with Animated.add() avoids the jump when setOffset is called.
  const baseTranslateX = useRef(new Animated.Value(0)).current;
  const baseTranslateY = useRef(new Animated.Value(0)).current;
  const baseScale = useRef(new Animated.Value(1)).current;

  const liveTranslateX = useRef(new Animated.Value(0)).current;
  const liveTranslateY = useRef(new Animated.Value(0)).current;
  const liveScale = useRef(new Animated.Value(1)).current;

  const lastTranslateX = useRef(0);
  const lastTranslateY = useRef(0);
  const lastScale = useRef(1);

  const panRef = useRef(null);
  const pinchRef = useRef(null);

  const onPanEvent = Animated.event<PanGestureHandlerGestureEvent>(
    [{ nativeEvent: { translationX: liveTranslateX, translationY: liveTranslateY } }],
    { useNativeDriver: true }
  );

  const onPanStateChange = (event: PanGestureHandlerGestureEvent) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      // Accumulate into base, reset live to 0
      lastTranslateX.current += event.nativeEvent.translationX;
      lastTranslateY.current += event.nativeEvent.translationY;
      baseTranslateX.setValue(lastTranslateX.current);
      baseTranslateY.setValue(lastTranslateY.current);
      liveTranslateX.setValue(0);
      liveTranslateY.setValue(0);

      // Apply momentum decay for smooth coast-to-stop on flick
      const { velocityX, velocityY } = event.nativeEvent;
      const speed = Math.sqrt(velocityX * velocityX + velocityY * velocityY);

      if (speed > 100) {
        Animated.decay(baseTranslateX, {
          velocity: velocityX / 1000,
          deceleration: 0.994,
          useNativeDriver: true,
        }).start(({ finished }) => {
          if (finished) {
            baseTranslateX.stopAnimation(value => {
              lastTranslateX.current = value;
            });
          }
        });

        Animated.decay(baseTranslateY, {
          velocity: velocityY / 1000,
          deceleration: 0.994,
          useNativeDriver: true,
        }).start(({ finished }) => {
          if (finished) {
            baseTranslateY.stopAnimation(value => {
              lastTranslateY.current = value;
            });
          }
        });
      }
    }
  };

  const onPinchEvent = Animated.event<PinchGestureHandlerGestureEvent>(
    [{ nativeEvent: { scale: liveScale } }],
    { useNativeDriver: true }
  );

  const onPinchStateChange = (event: PinchGestureHandlerGestureEvent) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      let newScale = lastScale.current * event.nativeEvent.scale;
      newScale = Math.min(Math.max(newScale, MIN_SCALE), MAX_SCALE);
      lastScale.current = newScale;
      baseScale.setValue(newScale);
      liveScale.setValue(1);
    }
  };

  // Combined transforms: base + live
  const combinedTranslateX = Animated.add(baseTranslateX, liveTranslateX);
  const combinedTranslateY = Animated.add(baseTranslateY, liveTranslateY);
  const combinedScale = Animated.multiply(baseScale, liveScale);

  // Build all generation data
  const generations: { label: string; units: FamilyMember[][] }[] = [];
  for (let gen = 0; gen < generationCount; gen++) {
    const members = getFamilyMembersByGeneration(gen);
    generations.push({
      label: GENERATION_LABELS[gen] || `Generation ${gen}`,
      units: buildFamilyUnits(members),
    });
  }

  const renderSpouseConnector = () => (
    <View style={styles.spouseConnector}>
      <View style={styles.spouseLineTop} />
      <View style={styles.heartContainer}>
        <Text style={styles.heartText}>♥</Text>
      </View>
      <View style={styles.spouseLineBottom} />
    </View>
  );

  const renderUnit = (unit: FamilyMember[]) => (
    <View key={unit[0].id} style={styles.unitContainer}>
      <FamilyMemberNode member={unit[0]} onPress={onMemberPress} />
      {unit.length === 2 && (
        <>
          {renderSpouseConnector()}
          <FamilyMemberNode member={unit[1]} onPress={onMemberPress} />
        </>
      )}
    </View>
  );

  const renderGeneration = (gen: { label: string; units: FamilyMember[][] }, genIndex: number) => {
    const rowWidth = gen.units.reduce((sum, unit) => sum + getUnitWidth(unit) + HORIZONTAL_GAP, 0) - HORIZONTAL_GAP;

    return (
      <View key={genIndex} style={styles.generationContainer}>
        <View style={styles.generationLabel}>
          <View style={styles.generationLabelLine} />
          <Text style={styles.generationLabelText}>{gen.label}</Text>
          <View style={styles.generationLabelLine} />
        </View>

        <View style={[styles.generationRow, { width: rowWidth }]}>
          {gen.units.map((unit) => renderUnit(unit))}
        </View>

        {genIndex < generationCount - 1 && (
          <View style={styles.verticalConnectorContainer}>
            <View style={styles.verticalLine} />
          </View>
        )}
      </View>
    );
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <PanGestureHandler
        ref={panRef}
        simultaneousHandlers={pinchRef}
        onGestureEvent={onPanEvent}
        onHandlerStateChange={onPanStateChange}
        minPointers={1}
        maxPointers={2}
      >
        <Animated.View style={styles.gestureContainer}>
          <PinchGestureHandler
            ref={pinchRef}
            simultaneousHandlers={panRef}
            onGestureEvent={onPinchEvent}
            onHandlerStateChange={onPinchStateChange}
          >
            <Animated.View
              style={[
                styles.treeCanvas,
                {
                  transform: [
                    { translateX: combinedTranslateX },
                    { translateY: combinedTranslateY },
                    { scale: combinedScale },
                  ],
                },
              ]}
            >
              {/* Tree title */}
              <View style={styles.treeHeader}>
                <Text style={styles.treeTitle}>McDuffie Family</Text>
              </View>

              {generations.map((gen, i) => renderGeneration(gen, i))}

              {/* Legend */}
              <View style={styles.legend}>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: Colors.primary }]} />
                  <Text style={styles.legendText}>Has recorded stories</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: Colors.gray200 }]} />
                  <Text style={styles.legendText}>No stories yet</Text>
                </View>
              </View>
            </Animated.View>
          </PinchGestureHandler>
        </Animated.View>
      </PanGestureHandler>

      {/* Instructions overlay — positioned above gesture content */}
      <View style={styles.instructionsBar}>
        <Text style={styles.instructionsText}>Drag to pan · Pinch to zoom</Text>
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    overflow: 'hidden',
  },
  instructionsBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.cream,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    zIndex: 10,
    elevation: 10,
  },
  instructionsText: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontStyle: 'italic',
  },
  gestureContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  treeCanvas: {
    alignItems: 'center',
    padding: Spacing.xl,
  },
  treeHeader: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  treeTitle: {
    ...Typography.h2,
    color: Colors.textPrimary,
  },
  generationContainer: {
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  generationLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  generationLabelLine: {
    width: 40,
    height: 1,
    backgroundColor: Colors.border,
  },
  generationLabelText: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontSize: 10,
  },
  generationRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: HORIZONTAL_GAP,
  },
  unitContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  spouseConnector: {
    width: SPOUSE_GAP + 16,
    alignItems: 'center',
    justifyContent: 'center',
    height: NODE_HEIGHT,
  },
  spouseLineTop: {
    flex: 1,
  },
  heartContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.cream,
    borderWidth: 1,
    borderColor: CONNECTOR_COLOR,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heartText: {
    color: Colors.primary,
    fontSize: 12,
  },
  spouseLineBottom: {
    flex: 1,
  },
  verticalConnectorContainer: {
    alignItems: 'center',
    height: VERTICAL_GAP - Spacing.sm,
    marginTop: Spacing.xs,
  },
  verticalLine: {
    width: 2,
    flex: 1,
    backgroundColor: CONNECTOR_COLOR,
  },
  legend: {
    flexDirection: 'row',
    gap: Spacing.lg,
    marginTop: Spacing.xl,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    backgroundColor: Colors.white,
    borderRadius: 20,
    ...Colors.elevation.small,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontSize: 11,
  },
});
