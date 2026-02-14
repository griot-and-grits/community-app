import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { HomeScreen } from '@/screens/home/HomeScreen';
import { DebugScreen } from '@/screens/debug/DebugScreen';
import { DiscoveryScreen } from '@/screens/discovery/DiscoveryScreen';
import { ProfileScreen } from '@/screens/profile/ProfileScreen';
import { RecordingScreen } from '@/screens/recording/RecordingScreen';
import { ReviewScreen } from '@/screens/recording/ReviewScreen';
import { StoryDetailScreen } from '@/screens/story/StoryDetailScreen';
import { VideoDetailScreen } from '@/screens/story/VideoDetailScreen';
import { Logo } from '@/components/branding/Logo';
import { Colors } from '@/styles/tokens';

export type MainTabParamList = {
  Home: undefined;
  Debug: undefined;
  Discovery: undefined;
  Family: undefined;
  Profile: undefined;
};

export type MainStackParamList = {
  MainTabs: undefined;
  Recording: undefined;
  Review: { videoPath: string };
  StoryDetail: { storyId: string };
  VideoDetail: { videoId: string };
  Profile: { userId?: string };
};

const Tab = createBottomTabNavigator<MainTabParamList>();
const Stack = createNativeStackNavigator<MainStackParamList>();

/**
 * Main Tab Navigator
 *
 * Bottom tab navigation for main app screens
 */
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
        component={HomeScreen}
        options={{
          headerTitle: () => <Logo size="small" />,
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Icon name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Discovery"
        component={DiscoveryScreen}
        options={{
          title: 'Discover',
          tabBarLabel: 'Discover',
          tabBarIcon: ({ color, size }) => (
            <Icon name="compass-outline" size={size} color={color} />
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
      <Tab.Screen
        name="Debug"
        component={DebugScreen}
        options={{
          title: 'Debug',
          tabBarLabel: 'Debug',
          tabBarIcon: ({ color, size }) => (
            <Icon name="bug" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

/**
 * Main Navigator
 *
 * Stack navigator that includes tabs and recording flow
 */
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
    </Stack.Navigator>
  );
};
