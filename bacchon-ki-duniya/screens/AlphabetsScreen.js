import React from 'react';
import { View, FlatList, StyleSheet, Text, Animated } from 'react-native';
import alphabets from '../data/alphabets';
import LetterCard from '../components/LetterCard';

export default function AlphabetsScreen() {
  const fadeAnim = new Animated.Value(0);

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <Text style={styles.title}>🔤 Let's Learn Alphabets! 🌟</Text>

      {/* 📣 Subtitle Instruction */}
      <Text style={styles.subtitle}>📣 Swipe to explore letters!</Text>

      <FlatList
        data={alphabets}
        keyExtractor={(item) => item.letter}
        renderItem={({ item }) => <LetterCard item={item} />}
        horizontal={true}
        contentContainerStyle={styles.list}
        showsHorizontalScrollIndicator={false}
        snapToAlignment="center"
        pagingEnabled
        decelerationRate="fast"
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#efb385ff',
    paddingTop: 40,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 10,
    color: '#FF69B4',
    textShadowColor: '#FFD700',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom:10,
    color: '#333',
    fontStyle: 'italic',
  },
  list: {
    paddingHorizontal: 20,
    alignItems: 'center',
  },
});
