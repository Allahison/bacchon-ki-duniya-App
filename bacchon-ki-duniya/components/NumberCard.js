// components/NumberCard.js

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  Animated,
  Dimensions,
  Image,
} from 'react-native';
import * as Speech from 'expo-speech';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function NumberCard({ item }) {
  const scaleValue = new Animated.Value(1);

  const speak = () => {
    Speech.speak(` ${item.sound}`, {
      pitch: 1.2,
      rate: 0.9,
    });

    Animated.sequence([
      Animated.timing(scaleValue, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <TouchableWithoutFeedback onPress={speak}>
      <Animated.View style={[styles.card, { transform: [{ scale: scaleValue }] }]}>
        <LinearGradient
          colors={['#FFDEE9', '#B5FFFC']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          <View style={styles.circle}>
            <Text style={styles.numberText}>{item.number}</Text>
          </View>
          <Text style={styles.tapText}>👆 Tap to Hear</Text>
        </LinearGradient>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  card: {
    width: width * 0.6,
    marginHorizontal: 10,
    borderRadius: 25,
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  gradient: {
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderRadius: 30,
  },
  circle: {
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    elevation: 5,
  },
  numberText: {
    fontSize: 64,
    fontWeight: 'bold',
    color: '#FF4081',
  },
  tapText: {
    fontSize: 18,
    color: '#333',
    fontWeight: '600',
    marginTop: 10,
  },
});
