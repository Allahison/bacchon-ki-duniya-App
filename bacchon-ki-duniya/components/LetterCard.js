import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableWithoutFeedback,
  Animated,
  Dimensions,
} from 'react-native';
import * as Speech from 'expo-speech';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function LetterCard({ item }) {
  const scaleValue = new Animated.Value(1);

  const speak = () => {
    Speech.speak(item.sound, {
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
          colors={['#FDEB71', '#F8D800']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          <Text style={styles.letter}>{item.letter}</Text>
          <View style={styles.imageWrapper}>
            <Image source={item.image} style={styles.image} />
          </View>
          <Text style={styles.sound}>{item.sound}</Text>
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
    paddingVertical: 20,
    paddingHorizontal: 15,
    alignItems: 'center',
    borderRadius: 25,
  },
  letter: {
    fontSize: 64,
    fontWeight: 'bold',
    color: '#6A0DAD',
    marginBottom: 10,
    textShadowColor: '#fff',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 6,
  },
  imageWrapper: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 100,
    marginVertical: 10,
    width: 140,
    height: 140,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    borderRadius: 100,
  },
  sound: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
    marginTop: 10,
  },
});
