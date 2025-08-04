import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

export default function HomeScreen({ navigation }) {
  const buttons = [
    { title: '🔤 Alphabets', screen: 'Alphabets', color: '#FFB703' },
    { title: '🔢 Numbers', screen: 'Numbers', color: '#8ECAE6' },
    { title: '🎨 Colors', screen: 'Colors', color: '#FB8500' },
    { title: '🐾 Animals', screen: 'Animals', color: '#219EBC' },
    { title: '📖 Stories', screen: 'Stories', color: '#FF006E' },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>🎉 BacchoN Ki Duniya 🎉</Text>
      {buttons.map((btn, index) => (
        <TouchableOpacity
          key={index}
          style={[styles.button, { backgroundColor: btn.color }]}
          onPress={() => navigation.navigate(btn.screen)}
        >
          <Text style={styles.buttonText}>{btn.title}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
    backgroundColor: '#bba986ff',
  },
  heading: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#FF006E',
    textAlign: 'center',
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
});
