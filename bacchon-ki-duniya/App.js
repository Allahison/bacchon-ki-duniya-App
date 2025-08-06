import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { supabase } from './lib/supabase';
import Toast from 'react-native-toast-message';

// Screens
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import HomeScreen from './screens/HomeScreen';
import AlphabetsScreen from './screens/AlphabetsScreen';
import NumbersScreen from './screens/NumbersScreen';
import ColorsScreen from './screens/ColorsScreen';
import AnimalsScreen from './screens/AnimalsScreen';
import StoriesScreen from './screens/StoriesScreen';
import SettingsScreen from './screens/SettingsScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        Toast.show({
          type: 'success',
          text1: 'Welcome back!',
        });
      }
    });

    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);

      if (event === 'SIGNED_IN') {
        Toast.show({
          type: 'success',
          text1: 'Successfully logged in!',
        });
      } else if (event === 'SIGNED_OUT') {
        Toast.show({
          type: 'info',
          text1: 'Logged out',
        });
      }
    });

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  return (
    <>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {!session ? (
            <>
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="Signup" component={SignupScreen} />
            </>
          ) : (
            <>
              <Stack.Screen name="Home" component={HomeScreen} />
              <Stack.Screen name="Alphabets" component={AlphabetsScreen} />
              <Stack.Screen name="Numbers" component={NumbersScreen} />
              <Stack.Screen name="Colors" component={ColorsScreen} />
              <Stack.Screen name="Animals" component={AnimalsScreen} />
              <Stack.Screen name="Stories" component={StoriesScreen} />
              <Stack.Screen name="Settings" component={SettingsScreen} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>

      {/* Add this at the root of your app */}
      <Toast position="top" />
    </>
  );
}
