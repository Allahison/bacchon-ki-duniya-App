import React, { useState } from "react";
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
  Modal,
} from "react-native";
import * as Speech from "expo-speech";
import ColorCard from "../components/ColorCard";
import colors from "../data/colors";

// ✅ Categorized in 3 phases
const phase1Colors = ["Red", "Blue", "Yellow", "Green", "White"];
const phase2Colors = ["Orange", "Purple", "Brown", "Black", "Pink"];
const phase3Colors = colors
  .map((c) => c.name)
  .filter((name) => !phase1Colors.includes(name) && !phase2Colors.includes(name));

const categories = {
  All: colors,
  Phase1: colors.filter((c) => phase1Colors.includes(c.name)),
  Phase2: colors.filter((c) => phase2Colors.includes(c.name)),
  Phase3: colors.filter((c) => phase3Colors.includes(c.name)),
};

export default function ColorsScreen() {
  const [viewedColors, setViewedColors] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [testMode, setTestMode] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [language, setLanguage] = useState("english");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [quizModalVisible, setQuizModalVisible] = useState(false);
  const [quizCategory, setQuizCategory] = useState("All");
  const [shuffledQuizColors, setShuffledQuizColors] = useState([]);

  const colorList = testMode ? shuffledQuizColors : categories[selectedCategory];
  const currentQuestion = colorList[questionIndex];

  const handleColorTap = (item) => {
    if (!viewedColors.includes(item.name)) {
      setViewedColors((prev) => [...prev, item.name]);
    }
    speakColor(item);
  };

  const speakColor = (item) => {
    setIsSpeaking(true);
    Speech.stop();
    Speech.speak(language === "urdu" ? item.translation : item.name, {
      language: language === "urdu" ? "ur-PK" : "en-US",
      onDone: () => setIsSpeaking(false),
      onStopped: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false),
    });
  };

  const handleColorLongPress = (name) => {
    setViewedColors((prev) => prev.filter((c) => c !== name));
  };

  const handleClearProgress = () => setViewedColors([]);

  const handleAnswer = (selectedColor) => {
    const correct = selectedColor.name === currentQuestion.name;
    if (correct) setScore((prev) => prev + 1);
    speakColor(currentQuestion);

    if (questionIndex < colorList.length - 1) {
      setQuestionIndex((prev) => prev + 1);
    } else {
      Alert.alert(
        "✅ Test Completed",
        `🎉 Score: ${score + (correct ? 1 : 0)} / ${colorList.length}`,
        [{ text: "OK", onPress: () => resetTest() }]
      );
    }
  };

  const resetTest = () => {
    setTestMode(false);
    setQuestionIndex(0);
    setScore(0);
    Speech.stop();
    setIsSpeaking(false);
    setShuffledQuizColors([]);
  };

  const toggleLanguage = () => {
    Speech.stop();
    setLanguage((prev) => (prev === "english" ? "urdu" : "english"));
  };

  const startTest = () => {
    setQuizModalVisible(false);
    const shuffled = shuffleArray(categories[quizCategory]);
    setShuffledQuizColors(shuffled);
    setTestMode(true);
    setQuestionIndex(0);
    setScore(0);
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#FFF3E0" barStyle="dark-content" />
      <Text style={styles.title}>🎨 Learn Colors</Text>

      <View style={styles.stickyHeader}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.buttonRow}
        >
          <TouchableOpacity
            style={styles.languageToggle}
            onPress={toggleLanguage}
          >
            <Text style={styles.buttonText}>
              {language === "english" ? "🔊 English" : "🔊 اردو"}
            </Text>
          </TouchableOpacity>

          {Object.keys(categories).map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.filterButton,
                selectedCategory === cat && styles.activeFilter,
              ]}
              onPress={() => {
                setSelectedCategory(cat);
                resetTest();
              }}
            >
              <Text
                style={{
                  color: selectedCategory === cat ? "#fff" : "#D84315",
                  fontWeight: "bold",
                  fontSize: 16,
                }}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}

          <TouchableOpacity
            style={[styles.testButton, testMode && styles.activeTest]}
            onPress={() => {
              resetTest();
              setQuizModalVisible(true);
            }}
          >
            <Text
              style={{
                color: testMode ? "#fff" : "#D84315",
                fontWeight: "bold",
                fontSize: 16,
              }}
            >
              {testMode ? "👀 Learn Mode" : "🧠 Test Me"}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      <Modal visible={quizModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Select Quiz Category</Text>
            {Object.keys(categories).map((cat) => (
              <TouchableOpacity
                key={cat}
                style={styles.modalOption}
                onPress={() => setQuizCategory(cat)}
              >
                <Text
                  style={{
                    color: quizCategory === cat ? "#fff" : "#D84315",
                    fontWeight: "bold",
                  }}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.modalStart} onPress={startTest}>
              <Text style={{ color: "#fff", fontWeight: "bold" }}>
                Start Quiz
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setQuizModalVisible(false)}>
              <Text style={{ color: "#D84315", marginTop: 10 }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {isSpeaking && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#D84315" />
          <Text style={styles.loaderText}>Speaking...</Text>
        </View>
      )}

      {!testMode ? (
        <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
          <Text style={styles.progress}>
            ✅ You've learned {viewedColors.length} of {colors.length} colors!
          </Text>
          {viewedColors.length > 0 && (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={handleClearProgress}
            >
              <Text style={styles.clearText}>🔁 Clear Progress</Text>
            </TouchableOpacity>
          )}
          <FlatList
            data={colorList}
            renderItem={({ item }) => (
              <ColorCard
                item={item}
                learned={viewedColors.includes(item.name)}
                onTap={() => handleColorTap(item)}
                onLongPress={() => handleColorLongPress(item.name)}
                showTranslation={true}
              />
            )}
            keyExtractor={(item) => item.name}
            numColumns={2}
            scrollEnabled={false}
            contentContainerStyle={styles.list}
          />
        </ScrollView>
      ) : (
        <ScrollView
          contentContainerStyle={styles.quiz}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.question}>Which color is this?</Text>
          <TouchableOpacity onPress={() => speakColor(currentQuestion)}>
            <View
              style={[
                styles.colorBlock,
                { backgroundColor: currentQuestion.hex },
              ]}
            />
          </TouchableOpacity>
          <View style={styles.options}>
            {shuffleArray(getOptions(currentQuestion)).map((opt) => (
              <TouchableOpacity
                key={opt.name}
                style={styles.optionButton}
                onPress={() => handleAnswer(opt)}
              >
                <Text>
                  {opt.name} ({opt.translation})
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const getOptions = (correct) => {
  const others = colors.filter((c) => c.name !== correct.name);
  const random = shuffleArray(others).slice(0, 3);
  return shuffleArray([...random, correct]);
};

const shuffleArray = (arr) => [...arr].sort(() => Math.random() - 0.5);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF3E0",
    paddingTop: 40,
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#D84315",
    textAlign: "center",
  },
  stickyHeader: { backgroundColor: "#FFF3E0", paddingVertical: 5 },
  buttonRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    gap: 8,
  },
  languageToggle: {
    backgroundColor: "#D84315",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  buttonText: { fontSize: 16, color: "#fff", fontWeight: "bold" },
  filterButton: {
    backgroundColor: "#FFE0B2",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  activeFilter: { backgroundColor: "#D84315" },
  testButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: "#FFE0B2",
    borderRadius: 20,
  },
  activeTest: { backgroundColor: "#D84315" },
  progress: {
    fontSize: 16,
    color: "#6D4C41",
    textAlign: "center",
    marginVertical: 10,
  },
  clearButton: {
    backgroundColor: "#D84315",
    alignSelf: "center",
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  clearText: { color: "#fff", fontWeight: "bold" },
  list: { alignItems: "center", paddingBottom: 80 },
  quiz: { alignItems: "center", padding: 20 },
  question: { fontSize: 22, marginBottom: 20, fontWeight: "bold" ,color: "#D84315"},
  colorBlock: {
    width: 150,
    height: 150,
    borderRadius: 15,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: "#000",
  },
  options: { width: "100%", marginTop: 10, gap: 10, paddingBottom: 40 },
  optionButton: {
    padding: 12,
    backgroundColor: "#7f7e7dff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#D84315",
    alignItems: "center",
  },
  loaderContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginVertical: 10,
  },
  loaderText: { fontSize: 16, color: "#D84315", fontWeight: "bold" },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#D84315",
  },
  modalOption: {
    backgroundColor: "#FFE0B2",
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
  },
  modalStart: {
    marginTop: 15,
    backgroundColor: "#D84315",
    padding: 10,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
  },
});