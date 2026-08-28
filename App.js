import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons'; 

import HomeScreen from './screens/HomeScreen';
import PlannerScreen from './screens/PlannerScreen'; 
import TasksScreen from './screens/TasksScreen'; 
import WallScreen from './screens/WallScreen';
import FundsScreen from './screens/FundsScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
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
          tabBarActiveTintColor: '#6D5AED', 
          tabBarInactiveTintColor: '#A0AEC0', 
          tabBarStyle: {
            backgroundColor: '#FFFFFF',
            borderTopWidth: 0,
            elevation: 15,
            shadowColor: '#6D5AED',
            shadowOpacity: 0.1,
            shadowRadius: 10,
            height: 65,
            paddingBottom: 10,
            paddingTop: 5,
          },
          headerStyle: {
            backgroundColor: '#FFFFFF',
            elevation: 0, 
            shadowOpacity: 0, 
            borderBottomWidth: 1,
            borderBottomColor: '#F0F5F5',
          },
          headerTintColor: '#2D3748',
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 20,
          },
        })}
      >
        <Tab.Screen name="Announcements" component={HomeScreen} options={{ title: 'SBIT-1A Hub' }} />
        <Tab.Screen name="Planner" component={PlannerScreen} options={{ title: 'Class Schedule' }} />
        <Tab.Screen name="Tasks" component={TasksScreen} />
        <Tab.Screen name="Wall" component={WallScreen} />
        <Tab.Screen name="Funds" component={FundsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}