import React from 'react';
import { Text, Platform, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';

// Ekranlar
import HomeScreen from './src/screens/HomeScreen';
import RouletteScreen from './src/screens/RouletteScreen';
import FilterScreen from './src/screens/FilterScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import FavoritesScreen from './src/screens/FavoritesScreen';
import MapScreen from './src/screens/MapScreen';

// Tipler
import { Restaurant } from './src/services/api';

export type RootStackParamList = {
  MainTabs: undefined;
  Home: undefined;
  Roulette: { 
    restaurants: Restaurant[];
    location?: { lat: number; lng: number };
    radius?: number;
  };
  Filter: { onApplyFilters: (filters: any) => void };
  Map: { restaurant: Restaurant };
  History: undefined;
  Favorites: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

// Ortak Tema Renkleri
const THEME = {
  background: '#1a1a2e',
  tabBarBg: '#16213e',
  accent: '#FFD700', // Altın
  inactive: 'rgba(255, 255, 255, 0.4)',
  text: '#FFFFFF',
};

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: THEME.tabBarBg,
          borderTopColor: 'rgba(255, 255, 255, 0.1)',
          borderTopWidth: 1,
          height: Platform.OS === 'ios' ? 85 : 65,
          paddingBottom: Platform.OS === 'ios' ? 30 : 10,
          paddingTop: 10,
          // Gölge Efekti
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.3,
          shadowRadius: 4,
          elevation: 5,
        },
        tabBarActiveTintColor: THEME.accent,
        tabBarInactiveTintColor: THEME.inactive,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 2,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        // TypeScript hatasını gidermek için cast işlemi yapıyoruz
        component={HomeScreen as React.ComponentType<any>}
        options={{
          tabBarLabel: 'Keşfet',
          tabBarIcon: ({ color, size, focused }) => (
            <MaterialCommunityIcons 
              name={focused ? "compass" : "compass-outline"} 
              size={28} 
              color={color} 
            />
          ),
        }}
      />
      <Tab.Screen
        name="History"
        component={HistoryScreen as React.ComponentType<any>}
        options={{
          tabBarLabel: 'Geçmiş',
          tabBarIcon: ({ color, size, focused }) => (
            <MaterialCommunityIcons 
              name={focused ? "history" : "clock-time-three-outline"} 
              size={28} 
              color={color} 
            />
          ),
        }}
      />
      <Tab.Screen
        name="Favorites"
        component={FavoritesScreen as React.ComponentType<any>}
        options={{
          tabBarLabel: 'Favoriler',
          tabBarIcon: ({ color, size, focused }) => (
            <MaterialCommunityIcons 
              name={focused ? "heart" : "heart-outline"} 
              size={28} 
              color={color} 
            />
          ),
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
              backgroundColor: THEME.background,
            },
            headerTintColor: THEME.accent,
            headerTitleStyle: {
              fontWeight: 'bold',
              color: THEME.text,
              fontSize: 18,
            },
            headerShadowVisible: false, // Header altındaki çizgiyi kaldırır
            headerBackTitleVisible: false, // iOS'te "Geri" yazısını kaldırır
          }}
        >
          <Stack.Screen 
            name="MainTabs" 
            component={MainTabs}
            options={{ headerShown: false }}
          />
          
          {/* Modal Olarak Açılan Ekranlar */}
          <Stack.Screen 
            name="Roulette" 
            component={RouletteScreen}
            options={{ 
              headerShown: false,
              presentation: 'fullScreenModal', // Tam ekran modal efekti
              animation: 'slide_from_bottom'
            }}
          />
          <Stack.Screen 
            name="Filter" 
            component={FilterScreen}
            options={{ 
              headerShown: false,
              presentation: 'modal', // Yarım ekran modal efekti (iOS style)
              animation: 'slide_from_bottom'
            }}
          />

          {/* Standart Navigasyon Ekranları */}
          <Stack.Screen 
            name="Map" 
            component={MapScreen}
            options={{ 
              title: 'Restoran Detayı',
              headerTransparent: true, // Harita/Resim üzerinde transparan header
              headerTintColor: '#fff',
              headerTitle: '', // Başlığı gizle, resim görünsün
              headerStyle: {
                backgroundColor: 'transparent'
              }
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
      <Toast 
        topOffset={Platform.OS === 'ios' ? 50 : 20}
        config={{
          success: ({ text1, text2 }) => (
            <View style={{
              backgroundColor: '#00E676',
              padding: 16,
              borderRadius: 12,
              marginHorizontal: 20,
              flexDirection: 'row',
              alignItems: 'center',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 8,
            }}>
              <MaterialCommunityIcons name="check-circle" size={24} color="#fff" style={{ marginRight: 12 }} />
              <View style={{ flex: 1 }}>
                {text1 && <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold', marginBottom: 4 }}>{text1}</Text>}
                {text2 && <Text style={{ color: '#fff', fontSize: 14 }}>{text2}</Text>}
              </View>
            </View>
          ),
          error: ({ text1, text2 }) => (
            <View style={{
              backgroundColor: '#FF4B4B',
              padding: 16,
              borderRadius: 12,
              marginHorizontal: 20,
              flexDirection: 'row',
              alignItems: 'center',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 8,
            }}>
              <MaterialCommunityIcons name="alert-circle" size={24} color="#fff" style={{ marginRight: 12 }} />
              <View style={{ flex: 1 }}>
                {text1 && <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold', marginBottom: 4 }}>{text1}</Text>}
                {text2 && <Text style={{ color: '#fff', fontSize: 14 }}>{text2}</Text>}
              </View>
            </View>
          ),
          info: ({ text1, text2 }) => (
            <View style={{
              backgroundColor: '#FFD700',
              padding: 16,
              borderRadius: 12,
              marginHorizontal: 20,
              flexDirection: 'row',
              alignItems: 'center',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 8,
            }}>
              <MaterialCommunityIcons name="information" size={24} color="#1a1a2e" style={{ marginRight: 12 }} />
              <View style={{ flex: 1 }}>
                {text1 && <Text style={{ color: '#1a1a2e', fontSize: 16, fontWeight: 'bold', marginBottom: 4 }}>{text1}</Text>}
                {text2 && <Text style={{ color: '#1a1a2e', fontSize: 14 }}>{text2}</Text>}
              </View>
            </View>
          ),
        }}
      />
    </SafeAreaProvider>
  );
}