import React from 'react';
import { Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Icon } from 'react-native-elements'

import { FormScreen } from './phone/form';
import { CarForm } from './car/carHomePage';
import { COLOR_PALETTE } from './settings';

const Tab = createMaterialTopTabNavigator();
const car = () => {return(<Text>Hello from car</Text>)}
const App = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        tabBarOptions={{
          showIcon: true,
          showLabel: false,
          indicatorStyle: {
            height: '100%',
            backgroundColor: COLOR_PALETTE.green
          }
        }}
      >
        <Tab.Screen 
          name='phone' 
          component={FormScreen}
          options={{
            tabBarIcon: ({}) => (
              <Icon
                name='mobile-alt'
                type='font-awesome-5'
                size={24}
              />
            )
          }}
        />
        <Tab.Screen
          name='car' 
          component={CarForm}
          options={{
            tabBarIcon: ({}) => (
              <Icon
                name='car'
                type='font-awesome-5'
                size={24}
              />
            )
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default App;