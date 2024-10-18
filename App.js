import React from 'react';
import { Image, View, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { AppContextProvider } from './store/context';
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
          position: 'absolute',
          borderTopWidth: 0,
          elevation: 0,
          height: 100,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          overflow: 'hidden',

          ...Platform.select({
            ios: {
              shadowColor: '#000',
              shadowOffset: { width: 0, height: -3 },
              shadowOpacity: 0.1,
              shadowRadius: 3,
            },
          }),
        },
        tabBarBackground: () => (
          <LinearGradient
            colors={['#F1BF00', '#F1BF00', '#AA151B']}
            style={{ height: '100%' }}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          />
        ),
        tabBarActiveTintColor: '#FFFFFF',
        tabBarInactiveTintColor: '#FFFFFF' + 90,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          // marginBottom: 5,
        },
        tabBarIconStyle: {
          // marginBottom: 5,
          // marginTop: 5,
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

                width: 40,
                height: 40,
                tintColor: color,
                opacity: focused ? 1 : 0.7,
                marginTop: 10,
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
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="TabNavigator" component={TabNavigator} />
          <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </AppContextProvider>
  );
}

export default App;
