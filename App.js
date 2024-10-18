import React from 'react';
import { Image } from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import {AppContextProvider} from './store/context';
import WelcomeScreen from './screen/WelcomeScreen';
import TabTestPuzzle from './screen/TabTestPuzzle';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 0,
          elevation: 10,
          shadowOpacity: 0.1,
          shadowRadius: 20,
        },
        tabBarActiveTintColor: '#4a4a4a',
        tabBarInactiveTintColor: '#9b9b9b',
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginBottom: 5,
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'User') {
            iconName = require('./assets/icons/tabBar/user.png');
          } else if (route.name === 'Map') {
            iconName = require('./assets/icons/tabBar/map.png');
          } else if (route.name === 'Puzzle') {
            iconName = require('./assets/icons/tabBar/puzzle.png');
          } else if (route.name === 'Quiz') {
            iconName = require('./assets/icons/tabBar/quiz.png');
          }

          return (
            <Image
              source={iconName}
              style={{
                width: size,
                height: size,
                tintColor: focused ? '#4a4a4a' : '#9b9b9b',
              }}
            />
          );
        },
      })}
    >
      <Tab.Screen name="User" component={WelcomeScreen} />
      <Tab.Screen name="Map" component={WelcomeScreen} />
      <Tab.Screen name="Puzzle" component={TabTestPuzzle} />
      <Tab.Screen name="Quiz" component={WelcomeScreen} />
    </Tab.Navigator>
  );
};

function App() {
  return (
    <AppContextProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{headerShown:false}}>
          <Stack.Screen name="TabNavigator" component={TabNavigator} />
          <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </AppContextProvider>
  );
}

export default App;
