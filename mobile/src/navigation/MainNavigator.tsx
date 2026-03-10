import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { DiscoveryScreen } from '@/screens/discovery/DiscoveryScreen';
import { MyVideosScreen } from '@/screens/videos/MyVideosScreen';
import { AskTheGriotScreen } from '@/screens/chat/AskTheGriotScreen';
import { ProfileScreen } from '@/screens/profile/ProfileScreen';
import { DebugScreen } from '@/screens/debug/DebugScreen';
import { RecordingScreen } from '@/screens/recording/RecordingScreen';
import { ReviewScreen } from '@/screens/recording/ReviewScreen';
import { StoryDetailScreen } from '@/screens/story/StoryDetailScreen';
import { VideoDetailScreen } from '@/screens/story/VideoDetailScreen';
import { Logo } from '@/components/branding/Logo';
import { useChatStore } from '@/store/chatStore';
import { Colors, Typography, Spacing } from '@/styles/tokens';

export type MainTabParamList = {
  Home: undefined;
  MyVideos: undefined;
  AskTheGriot: undefined;
  Profile: undefined;
};

export type MainStackParamList = {
  MainTabs: undefined;
  Recording: undefined;
  Review: { videoPath: string };
  StoryDetail: { storyId: string };
  VideoDetail: { videoId: string };
  Profile: { userId?: string };
  Debug: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();
const Stack = createNativeStackNavigator<MainStackParamList>();

const GriotHeaderTitle = () => (
  <View style={headerStyles.titleRow}>
    <Icon name="book-open-variant" size={22} color={Colors.primary} />
    <View>
      <Text style={headerStyles.title}>Ask the Griot</Text>
      <Text style={headerStyles.subtitle}>Your family's storyteller and historian</Text>
    </View>
  </View>
);

const GriotHeaderRight = () => {
  const { getActiveSession, createSession } = useChatStore();
  const session = getActiveSession();
  const hasMessages = (session?.messages.length || 0) > 0;

  if (!hasMessages) return null;

  return (
    <TouchableOpacity style={headerStyles.newButton} onPress={() => createSession()}>
      <Icon name="plus-circle-outline" size={18} color={Colors.white} />
      <Text style={headerStyles.newButtonText}>New</Text>
    </TouchableOpacity>
  );
};

const headerStyles = StyleSheet.create({
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  title: {
    ...Typography.h5,
    color: Colors.textPrimary,
  },
  subtitle: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  newButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: 16,
    marginRight: Spacing.sm,
  },
  newButtonText: {
    ...Typography.bodySmall,
    color: Colors.white,
    fontWeight: '700',
  },
});

const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: true,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textSecondary,
        tabBarStyle: {
          backgroundColor: Colors.surface,
          borderTopColor: Colors.border,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={DiscoveryScreen}
        options={{
          headerTitle: () => <Logo size="small" />,
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Icon name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="MyVideos"
        component={MyVideosScreen}
        options={{
          headerTitle: () => (
            <View style={headerStyles.titleRow}>
              <Icon name="account-group" size={22} color={Colors.primary} />
              <Text style={headerStyles.title}>My Family</Text>
            </View>
          ),
          tabBarLabel: 'My Family',
          tabBarIcon: ({ color, size }) => (
            <Icon name="account-group" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="AskTheGriot"
        component={AskTheGriotScreen}
        options={{
          headerTitle: () => <GriotHeaderTitle />,
          headerRight: () => <GriotHeaderRight />,
          tabBarLabel: 'Ask Griot',
          tabBarIcon: ({ color, size }) => (
            <Icon name="book-open-variant" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Profile',
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Icon name="account-outline" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export const MainNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="MainTabs" component={MainTabs} />
      <Stack.Screen
        name="Recording"
        component={RecordingScreen}
        options={{
          headerShown: true,
          title: 'Record Story',
          headerBackTitle: 'Cancel',
        }}
      />
      <Stack.Screen
        name="Review"
        component={ReviewScreen}
        options={{
          headerShown: true,
          title: 'Review Story',
          headerBackTitle: 'Back',
        }}
      />
      <Stack.Screen
        name="StoryDetail"
        component={StoryDetailScreen}
        options={{
          headerShown: true,
          title: 'Story',
          headerBackTitle: 'Back',
        }}
      />
      <Stack.Screen
        name="VideoDetail"
        component={VideoDetailScreen}
        options={{
          headerShown: true,
          title: 'Story',
          headerBackTitle: 'Back',
        }}
      />
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          headerShown: true,
          title: 'Profile',
          headerBackTitle: 'Back',
        }}
      />
      <Stack.Screen
        name="Debug"
        component={DebugScreen}
        options={{
          headerShown: true,
          title: 'Developer Tools',
          headerBackTitle: 'Back',
        }}
      />
    </Stack.Navigator>
  );
};
