import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons'; 
import { View, StyleSheet, Dimensions } from 'react-native';

import HomeScreen from './screens/HomeScreen';
import PlannerScreen from './screens/PlannerScreen'; 
import TasksScreen from './screens/TasksScreen'; 
import WallScreen from './screens/WallScreen';
import FundsScreen from './screens/FundsScreen';

const Tab = createBottomTabNavigator();
const { height } = Dimensions.get('window');

const navTheme = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, background: 'transparent' },
};

export default function App() {
  return (
    <View style={styles.appContainer}>
      <View style={styles.solidBg} />
      <View style={styles.mintBlob} />
      <View style={styles.azureBlob} />

      <NavigationContainer theme={navTheme}>
        <Tab.Navigator
          sceneContainerStyle={{ backgroundColor: 'transparent' }}
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
              backgroundColor: 'rgba(255, 255, 255, 0.85)', // Safe glass alternative
              borderTopWidth: 1, 
              borderTopColor: 'rgba(255,255,255,0.5)',
              elevation: 0, 
              height: 65,
              paddingBottom: 10,
              paddingTop: 5
            },
            headerStyle: { backgroundColor: 'transparent', elevation: 0, shadowOpacity: 0 },
            headerTransparent: true,
            headerTintColor: '#2C3E50',
            headerTitleStyle: { fontWeight: 'bold', fontSize: 22 },
          })}
        >
          <Tab.Screen name="Announcements" component={HomeScreen} options={{ title: 'SBIT-1A Hub' }} />
          <Tab.Screen name="Planner" component={PlannerScreen} options={{ title: 'Class Schedule' }} />
          <Tab.Screen name="Tasks" component={TasksScreen} />
          <Tab.Screen name="Wall" component={WallScreen} />
          <Tab.Screen name="Funds" component={FundsScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  appContainer: { flex: 1 },
  solidBg: { ...StyleSheet.absoluteFillObject, backgroundColor: '#CDEAFC' }, 
  mintBlob: { position: 'absolute', top: -50, right: -50, width: 300, height: 300, borderRadius: 150, backgroundColor: '#36E08B', opacity: 0.6 },
  azureBlob: { position: 'absolute', top: height * 0.3, left: -100, width: 350, height: 350, borderRadius: 175, backgroundColor: '#1D70F5', opacity: 0.5 },
});