import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons'; 
import { View, StyleSheet } from 'react-native';

import HomeScreen from './screens/HomeScreen';
import PlannerScreen from './screens/PlannerScreen'; 
import TasksScreen from './screens/TasksScreen'; 
import WallScreen from './screens/WallScreen';
import FundsScreen from './screens/FundsScreen';

const Tab = createBottomTabNavigator();

const navTheme = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, background: '#F4F9FF' }, // Light pastel blue base
};

export default function App() {
  return (
    <NavigationContainer theme={navTheme}>
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
          tabBarActiveTintColor: '#1D70F5', 
          tabBarInactiveTintColor: '#A0AEC0', 
          tabBarStyle: { 
            position: 'absolute', 
            backgroundColor: 'rgba(255, 255, 255, 0.9)', 
            borderTopWidth: 0, 
            elevation: 10, 
            height: 65,
            paddingBottom: 10,
            paddingTop: 5,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          },
          headerShown: false, // We will build custom headers inside the screens
        })}
      >
        <Tab.Screen name="Announcements" component={HomeScreen} />
        <Tab.Screen name="Planner" component={PlannerScreen} />
        <Tab.Screen name="Tasks" component={TasksScreen} />
        <Tab.Screen name="Wall" component={WallScreen} />
        <Tab.Screen name="Funds" component={FundsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}