import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons'; 
import { View, ActivityIndicator } from 'react-native';
import { useFonts, Poppins_400Regular, Poppins_600SemiBold, Poppins_700Bold } from '@expo-google-fonts/poppins';

// Global State & Components
import { AppProvider, AppContext } from './context/AppContext';
import Sidebar from './components/Sidebar';

// Screens
import HomeScreen from './screens/HomeScreen';
import PlannerScreen from './screens/PlannerScreen'; 
import TasksScreen from './screens/TasksScreen'; 
import WallScreen from './screens/WallScreen';
import FundsScreen from './screens/FundsScreen';
import OnboardingScreen from './screens/OnboardingScreen';
import AdminLoginScreen from './screens/AdminLoginScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// 1. The Main Bottom Tabs (Your existing app structure)
function MainTabs() {
  const { colors } = useContext(AppContext);
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Announcements') iconName = focused ? 'megaphone' : 'megaphone-outline';
          else if (route.name === 'Planner') iconName = focused ? 'calendar' : 'calendar-outline';
          else if (route.name === 'Tasks') iconName = focused ? 'checkbox' : 'checkbox-outline';
          else if (route.name === 'Wall') iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
          else if (route.name === 'Funds') iconName = focused ? 'wallet' : 'wallet-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary, 
        tabBarInactiveTintColor: colors.subtext, 
        tabBarStyle: { 
          backgroundColor: colors.card, 
          borderTopWidth: 0, 
          elevation: 10, 
          height: 65, 
          paddingBottom: 10, 
          paddingTop: 5, 
          borderTopLeftRadius: 20, 
          borderTopRightRadius: 20,
          position: 'absolute'
        },
        headerShown: false, 
      })}
    >
      <Tab.Screen name="Announcements" component={HomeScreen} />
      <Tab.Screen name="Planner" component={PlannerScreen} />
      <Tab.Screen name="Tasks" component={TasksScreen} />
      <Tab.Screen name="Wall" component={WallScreen} />
      <Tab.Screen name="Funds" component={FundsScreen} />
    </Tab.Navigator>
  );
}

// 2. The Stack Controller (Decides what screen to show first)
function RootNavigator() {
  const { isFirstLaunch } = useContext(AppContext);
  
  return (
    <>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isFirstLaunch ? (
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        ) : (
          <>
            <Stack.Screen name="Root" component={MainTabs} />
            <Stack.Screen 
              name="AdminLogin" 
              component={AdminLoginScreen} 
              options={{ presentation: 'modal', animation: 'slide_from_bottom' }} 
            />
          </>
        )}
      </Stack.Navigator>
      
      {/* Sidebar sits outside the stack so it can overlay everything */}
      {!isFirstLaunch && <Sidebar />}
    </>
  );
}

// 3. The App Wrapper
export default function App() {
  let [fontsLoaded] = useFonts({ 
    Poppins_400Regular, 
    Poppins_600SemiBold, 
    Poppins_700Bold 
  });

  if (!fontsLoaded) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color="#1D70F5" />
      </View>
    );
  }

  return (
    <AppProvider>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </AppProvider>
  );
}