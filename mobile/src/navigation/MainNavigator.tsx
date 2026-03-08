import React from 'react';
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
import { Colors } from '@/styles/tokens';

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
          title: 'My Videos',
          tabBarLabel: 'My Videos',
          tabBarIcon: ({ color, size }) => (
            <Icon name="video-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="AskTheGriot"
        component={AskTheGriotScreen}
        options={{
          title: 'Ask the Griot',
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
