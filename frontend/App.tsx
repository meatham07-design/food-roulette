import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { Text, Platform } from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import HomeScreen from './src/screens/HomeScreen';
import RouletteScreen from './src/screens/RouletteScreen';
import FilterScreen from './src/screens/FilterScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import FavoritesScreen from './src/screens/FavoritesScreen';
import MapScreen from './src/screens/MapScreen';
import { Restaurant } from './src/services/api';

export type RootStackParamList = {
  MainTabs: undefined;
  Home: undefined;
  Roulette: { restaurants: Restaurant[] };
  Filter: { onApplyFilters: (filters: any) => void };
  Map: { restaurant: Restaurant };
  History: undefined;
  Favorites: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

function MainTabs() {
  const insets = useSafeAreaInsets();
  
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#0f0c29',
          borderTopColor: 'rgba(255, 215, 0, 0.2)',
          borderTopWidth: 1,
          height: Platform.OS === 'ios' ? 65 + (insets.bottom > 0 ? insets.bottom - 10 : 0) : 65,
          paddingBottom: Platform.OS === 'ios' ? Math.max(insets.bottom - 10, 8) : 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: '#ffd700',
        tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.5)',
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Ana Sayfa',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>🎲</Text>,
        }}
      />
      <Tab.Screen
        name="History"
        component={HistoryScreen}
        options={{
          tabBarLabel: 'Geçmiş',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>📜</Text>,
        }}
      />
      <Tab.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{
          tabBarLabel: 'Favoriler',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>❤️</Text>,
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="light" />
        <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#0f0c29',
          },
          headerTintColor: '#ffd700',
          headerTitleStyle: {
            fontWeight: 'bold',
            color: '#ffd700',
          },
        }}
      >
        <Stack.Screen 
          name="MainTabs" 
          component={MainTabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Roulette" 
          component={RouletteScreen}
          options={{ title: 'Rulet' }}
        />
        <Stack.Screen 
          name="Filter" 
          component={FilterScreen}
          options={{ title: 'Filtrele' }}
        />
        <Stack.Screen 
          name="Map" 
          component={MapScreen}
          options={{ title: 'Harita' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
    </SafeAreaProvider>
  );
}

