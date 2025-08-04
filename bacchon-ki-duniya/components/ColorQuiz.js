import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';
import * as Speech from 'expo-speech';

export default function ColorQuiz({ quizColors = [], totalQuestions = 5, onFinish }) {
  const [questionColor, setQuestionColor] = useState(null);
  const [options, setOptions] = useState([]);
  const [result, setResult] = useState('');
  const [current, setCurrent] = useState(1);
  const [score, setScore] = useState(0);

  useEffect(() => {
    Speech.stop(); // ✅ stop any ongoing speech when quiz starts
    generateQuestion();
  }, []);

  const generateQuestion = () => {
    if (quizColors.length < 4) {
      console.warn("Not enough colors to generate quiz.");
      return;
    }

    const shuffled = [...quizColors].sort(() => 0.5 - Math.random());
    const picked = shuffled.slice(0, 4);
    const correct = picked[Math.floor(Math.random() * 4)];

    setQuestionColor(correct);
    setOptions(picked);
    setResult('');
  };

  const checkAnswer = (color) => {
    if (!questionColor) return;

    if (color.name === questionColor.name) {
      setScore(prev => prev + 1);
      setResult('✅ Correct!');
    } else {
      setResult('❌ Try again!');
    }
  };

  const next = () => {
    if (current >= totalQuestions) {
      onFinish?.(score, totalQuestions);
    } else {
      setCurrent(prev => prev + 1);
      generateQuestion();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.progress}>Question {current} of {totalQuestions}</Text>

      <View style={[styles.colorBox, { backgroundColor: questionColor?.hex || '#ccc' }]} />

      <Text style={styles.question}>Which color is this?</Text>

      {options.map((option) => (
        <TouchableOpacity
          key={option.name}
          style={styles.optionButton}
          onPress={() => checkAnswer(option)}
        >
          <Text style={styles.optionText}>{option.name} ({option.translation})</Text>
        </TouchableOpacity>
      ))}

      <Text style={styles.result}>{result}</Text>

      <Button
        title={current < totalQuestions ? "Next" : "Finish"}
        onPress={next}
        disabled={!questionColor}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  progress: {
    fontSize: 18,
    marginBottom: 10,
  },
  colorBox: {
    width: 150,
    height: 150,
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#000',
  },
  question: {
    fontSize: 20,
    marginBottom: 10,
  },
  optionButton: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    marginVertical: 6,
    width: '90%',
    borderRadius: 8,
  },
  optionText: {
    fontSize: 18,
    textAlign: 'center',
  },
  result: {
    fontSize: 22,
    marginTop: 10,
    fontWeight: 'bold',
  },
});
r