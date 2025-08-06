import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  ScrollView,
  Animated,
  Platform,
  Alert,
  StatusBar as RNStatusBar,
  TouchableOpacity,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as Speech from 'expo-speech';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Ionicons } from '@expo/vector-icons';

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function HomeScreen({ navigation }) {
  const [tip, setTip] = useState('');
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const tips = [
    "Explore your home and find 3 red things! 🔴",
    "Clap your hands and count out loud! 👏🔢",
    "Draw a rainbow with 7 colors. 🌈",
    "Pretend to be your favorite animal today! 🐒",
    "Look in the mirror and say: 'I am smart!' 💪😊",
    "Match objects that are the same shape. 🔺🟦",
    "Sing your favorite rhyme with actions! 🎵🤸",
    "Ask someone to quiz you on A-Z letters! 🔤",
    "Name your fingers and count them! ✋🖐️",
    "Create a story about your favorite toy! 🧸📖",
    "Touch something soft, hard, and cold! 👆❄️",
    "Try to write your name with crayons. 🖍️✍️",
    "Guess the sound of animals from YouTube. 🔊🐓",
    "Hop 10 times like a bunny! 🐇1️⃣0️⃣",
    "Tell someone your favorite color and why! 🎨🗣️",
  ];

  useEffect(() => {
    Speech.speak('Welcome to Little Learners Land!');
    const randomTip = tips[Math.floor(Math.random() * tips.length)];
    setTip(randomTip);

    registerForPushNotificationsAsync();
    scheduleDailyNotification();
  }, []);

  const registerForPushNotificationsAsync = async () => {
    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        Alert.alert('Permission needed', 'Please enable notifications to receive reminders!');
        return;
      }
    } else {
      Alert.alert('Unsupported', 'Notifications only work on real devices.');
    }
  };

  const scheduleDailyNotification = async () => {
    await Notifications.cancelAllScheduledNotificationsAsync();

    await Notifications.scheduleNotificationAsync({
      content: {
        title: '🎉 Ready to Learn?',
        body: 'Come back to Little Learners Land for a fun activity!',
        sound: true,
      },
      trigger: {
        seconds: 60,
        repeats: false,
      },
    });
  };

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const buttons = [
    { title: '🔤 Alphabets', screen: 'Alphabets', color: '#FFB703' },
    { title: '🔢 Numbers', screen: 'Numbers', color: '#8ECAE6' },
    { title: '🎨 Colors', screen: 'Colors', color: '#FB8500' },
    { title: '🐾 Animals', screen: 'Animals', color: '#219EBC' },
    { title: '📖 Stories', screen: 'Stories', color: '#FF006E' },
  ];

  return (
    <>
      <StatusBar style="dark" translucent={false} />
      <ScrollView contentContainerStyle={styles.container}>
        {/* Settings Button */}
        <TouchableOpacity
          onPress={() => navigation.navigate('Settings')}
          style={styles.settingsIcon}
        >
          <Ionicons name="settings-sharp" size={28} color="#333" />
        </TouchableOpacity>

        <Text style={styles.heading}>🎉 Little Learners Land 🎉</Text>

        <View style={styles.tipBox}>
          <Text style={styles.tipTitle}>💡 Learning Tip:</Text>
          <Text style={styles.tipText}>{tip}</Text>
        </View>

        {buttons.map((btn, index) => (
          <TouchableWithoutFeedback
            key={index}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onPress={() => navigation.navigate(btn.screen)}
          >
            <Animated.View
              style={[
                styles.button,
                { backgroundColor: btn.color, transform: [{ scale: scaleAnim }] },
              ]}
            >
              <Text style={styles.buttonText}>{btn.title}</Text>
            </Animated.View>
          </TouchableWithoutFeedback>
        ))}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
    paddingTop: Platform.OS === 'android' ? RNStatusBar.currentHeight : 0,
    backgroundColor: '#bba986ff',
  },
  heading: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#FF006E',
    textAlign: 'center',
  },
  tipBox: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 15,
    width: '85%',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  tipTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 5,
  },
  tipText: {
    fontSize: 16,
    color: '#333',
  },
  button: {
    width: '85%',
    paddingVertical: 20,
    borderRadius: 20,
    marginVertical: 10,
    alignItems: 'center',
    elevation: 5,
  },
  buttonText: {
    fontSize: 22,
    color: '#fff',
    fontWeight: 'bold',
  },
  settingsIcon: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 10,
  },
});
