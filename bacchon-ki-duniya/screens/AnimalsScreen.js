import React, { useState } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  Button,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { animals as animalData } from '../data/animals';
import AnimalCard from '../components/AnimalCard';

// Enable LayoutAnimation for Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function AnimalsScreen() {
  const [animals, setAnimals] = useState(animalData);
  const [learnedAnimals, setLearnedAnimals] = useState({});

  const handleLearn = (id) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setLearnedAnimals((prev) => ({ ...prev, [id]: true }));
  };

  const handleShuffle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    const shuffled = [...animals].sort(() => Math.random() - 0.5);
    setAnimals(shuffled);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>🐾 Tap to Learn Animals</Text>

      <TouchableOpacity style={styles.shuffleBtn} onPress={handleShuffle}>
        <Text style={styles.shuffleText}>🔀 Shuffle</Text>
      </TouchableOpacity>

      <FlatList
        data={animals}
        renderItem={({ item }) => (
          <AnimalCard
            animal={item}
            learned={learnedAnimals[item.id]}
            onTap={() => handleLearn(item.id)}
          />
        )}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EAF6F6',
    paddingTop: 40,
    paddingHorizontal: 10,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  list: {
    paddingBottom: 20,
  },
  shuffleBtn: {
    alignSelf: 'center',
    marginBottom: 10,
    backgroundColor: '#2C98F0',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
  },
  shuffleText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
