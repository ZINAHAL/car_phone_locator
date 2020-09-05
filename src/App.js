import * as React from 'react';
import {} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import { FormScreen } from './phone/form';

const Tab = createMaterialTopTabNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name='phone' component={FormScreen}/>
        {/* <Tab.Screen name='car' component={}/> */}
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default App;