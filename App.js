import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import HomeScreen from './screens/HomeScreen';
import PlannerScreen from './screens/PlannerScreen';
import TasksScreen from './screens/TasksScreen';
import FundsScreen from './screens/FundsScreen';
import WallScreen from './screens/WallScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Planner" component={PlannerScreen} />
        <Tab.Screen name="Tasks" component={TasksScreen} />
        <Tab.Screen name="Funds" component={FundsScreen} />
        <Tab.Screen name="Wall" component={WallScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}