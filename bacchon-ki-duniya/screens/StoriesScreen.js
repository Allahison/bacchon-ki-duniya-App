import React, { useState } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
} from 'react-native';
import { stories } from '../data/stories';
import StoryCard from '../components/StoryCard';

const categories = ['All', 'Islamic', 'Information', 'Animals'];

export default function StoryScreen() {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredStories =
    selectedCategory === 'All'
      ? stories
      : stories.filter((story) => story.category === selectedCategory);

  return (
    <ImageBackground
      source={require('../assets/images/saplas.png')}
      style={styles.background}
    >
      <View style={styles.overlay}>
        <Text style={styles.heading}>📚 بچوں کی کہانیاں</Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryScroll}
        >
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.categoryButton,
                selectedCategory === cat && styles.activeCategory,
              ]}
              onPress={() => setSelectedCategory(cat)}
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === cat && styles.activeCategoryText,
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <FlatList
          data={filteredStories}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <StoryCard story={item} />}
          contentContainerStyle={styles.storyList}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    paddingTop: 50,
    paddingHorizontal: 16,
  },
  heading: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    color: '#FF6F61',
    fontFamily: 'Cochin',
    textShadowColor: '#FCD34D',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  categoryScroll: {
    marginBottom: 12,
  },
  categoryButton: {
    backgroundColor: '#FFF8DC',
    paddingVertical: 7,
    paddingHorizontal: 18,
    borderRadius: 25,
    marginRight: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  activeCategory: {
    backgroundColor: '#FF6F61',
    borderColor: '#FF6F61',
  },
  categoryText: {
    fontSize: 17,
    color: '#333',
    fontWeight: '700',
  height: 30,
    textAlign: 'center',
   
  },
  activeCategoryText: {
    color: '#FFF',
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  storyList: {
    paddingBottom: 100,
  },
});
