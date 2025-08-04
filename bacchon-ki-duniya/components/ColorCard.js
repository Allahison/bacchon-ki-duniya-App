import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import * as Speech from 'expo-speech';

export default function ColorCard({ item, learned, onTap }) {
  const handlePress = () => {
    Speech.speak(`This is ${item.name}. In Urdu: ${item.translation}`);
    if (onTap) {
      onTap(item.name);
    }
  };

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: item.hex }]}
      onPress={handlePress}
    >
      <Text style={styles.name}>
        {item.name} {learned ? '✅' : ''}
      </Text>
      <Text style={styles.translation}>{item.translation}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 150,
    height: 180,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 12,
    elevation: 3,
  },
  name: {
    fontSize: 22,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  translation: {
    fontSize: 18,
    color: '#fff',
    marginTop: 8,
  },
});
