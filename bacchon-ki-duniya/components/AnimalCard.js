// components/AnimalCard.js
import React, { useRef } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Animated, Dimensions } from 'react-native';
import { Audio } from 'expo-av';

const { width } = Dimensions.get('window');

export default function AnimalCard({ animal }) {
  const scale = useRef(new Animated.Value(1)).current;
  const soundRef = useRef(null);

  const playSound = async () => {
    try {
      // If a previous sound exists, unload it first
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }

      const { sound } = await Audio.Sound.createAsync(animal.sound);
      soundRef.current = sound;

      // Play sound
      await sound.playAsync();

      // Auto unload when playback finishes
      sound.setOnPlaybackStatusUpdate(async (status) => {
        if (status.didJustFinish && !status.isLooping) {
          await sound.unloadAsync();
          soundRef.current = null;
        }
      });
    } catch (error) {
      console.warn('Sound error:', error);
    }
  };

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scale, { toValue: 0.95, duration: 100, useNativeDriver: true }),
      Animated.timing(scale, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();

    playSound();
  };

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.8}>
      <Animated.View style={[styles.card, { transform: [{ scale }] }]}>
        <Image source={animal.image} style={styles.image} />
        <Text style={styles.name}>{animal.name}</Text>
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: width * 0.4,
    backgroundColor: '#fef9e7',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  image: {
    width: 90,
    height: 90,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#5D4037',
  },
});
