import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Share } from 'react-native';
import { Audio } from 'expo-av';

export default function StoryCard({ story, currentlyPlaying, setCurrentlyPlaying }) {
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const isStarting = useRef(false);

  const playSound = async () => {
    if (isStarting.current) return;
    isStarting.current = true;

    try {
      const { sound: newSound } = await Audio.Sound.createAsync(story.sound);
      setSound(newSound);
      await newSound.playAsync();
      setIsPlaying(true);
      setIsPaused(false);
      setCurrentlyPlaying(story.title);

      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          setIsPlaying(false);
          setIsPaused(false);
          setCurrentlyPlaying(null);
          newSound.unloadAsync();
        }
      });
    } catch (e) {
      console.warn('Sound error:', e);
    } finally {
      isStarting.current = false;
    }
  };

  const togglePlayPause = async () => {
    if (isPlaying && !isPaused) {
      await sound.pauseAsync();
      setIsPaused(true);
    } else if (isPaused) {
      await sound.playAsync();
      setIsPaused(false);
    } else {
      if (currentlyPlaying && currentlyPlaying !== story.title) {
        alert('براہ کرم پہلے موجودہ کہانی مکمل سنیں۔');
        return;
      }
      await playSound();
    }
  };

  const stopSound = async () => {
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
      setSound(null);
      setIsPlaying(false);
      setIsPaused(false);
      setCurrentlyPlaying(null);
    }
  };

  const restartSound = async () => {
    if (sound) {
      await sound.stopAsync();
      await sound.setPositionAsync(0);
      await sound.playAsync();
      setIsPaused(false);
      setIsPlaying(true);
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `📖 ${story.title}\n\n${story.text || 'یہ ایک دلچسپ کہانی ہے، ضرور پڑھیں!'}`
      });
    } catch (error) {
      console.error('Sharing failed:', error);
    }
  };

  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  return (
    <View style={styles.card}>
      <Image source={story.image} style={styles.image} />
      <Text style={styles.title}>{story.title}</Text>

      <TouchableOpacity style={styles.mainButton} onPress={togglePlayPause}>
        <Text style={styles.mainButtonText}>
          {isPaused ? '▶️ دوبارہ سنیں' : isPlaying ? '⏸️ روکیں' : '📖 کہانی سنیں'}
        </Text>
      </TouchableOpacity>

      {(isPlaying || isPaused) && (
        <View style={styles.controls}>
          <TouchableOpacity style={styles.controlButton} onPress={stopSound}>
            <Text style={styles.controlButtonText}>⏹️ بند کریں</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.controlButton} onPress={restartSound}>
            <Text style={styles.controlButtonText}>🔁 دوبارہ چلائیں</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* 📤 Share Button */}
      <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
        <Text style={styles.shareButtonText}>📤 شیئر کریں</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFF9C4',
    margin: 16,
    padding: 20,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  image: {
    width: 220,
    height: 180,
    resizeMode: 'cover',
    marginBottom: 12,
    borderRadius: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FF6F61',
    marginBottom: 12,
    textAlign: 'center',
  },
  mainButton: {
    backgroundColor: '#FFB74D',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 30,
    marginBottom: 10,
  },
  mainButtonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
  },
  controlButton: {
    backgroundColor: '#FF8A65',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 20,
    marginHorizontal: 8,
  },
  controlButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  shareButton: {
    backgroundColor: '#4FC3F7',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 20,
    marginTop: 12,
  },
  shareButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
