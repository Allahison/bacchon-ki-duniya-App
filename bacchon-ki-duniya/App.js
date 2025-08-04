import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './screens/HomeScreen';
import AlphabetsScreen from './screens/AlphabetsScreen';
import NumbersScreen from './screens/NumbersScreen';
import ColorsScreen from './screens/ColorsScreen';
import AnimalsScreen from './screens/AnimalsScreen';
import StoriesScreen from './screens/StoriesScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Alphabets" component={AlphabetsScreen} />
        <Stack.Screen name="Numbers" component={NumbersScreen} />
        <Stack.Screen name="Colors" component={ColorsScreen} />
        <Stack.Screen name="Animals" component={AnimalsScreen} />
        <Stack.Screen name="Stories" component={StoriesScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
