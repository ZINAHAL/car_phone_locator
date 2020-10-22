import React from 'react';
import { Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import { FormScreen } from './phone/form';

const Tab = createMaterialTopTabNavigator();
const car = () => {return(<Text>Hello from car</Text>)}
const App = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator navigationOptions={({navigation}) => {}}>
        <Tab.Screen name='phone' component={FormScreen}/>
        <Tab.Screen name='car' component={car}/>
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default App;