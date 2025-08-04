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
} from "react-native";
import * as Speech from "expo-speech";
import ColorCard from "../components/ColorCard";
import colors from "../data/colors";

const categories = {
  All: colors,
  Warm: colors.filter((c) => ["Red", "Orange", "Yellow"].includes(c.name)),
  Cool: colors.filter((c) => ["Blue", "Green", "Purple"].includes(c.name)),
};

export default function ColorsScreen() {
  const [viewedColors, setViewedColors] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [testMode, setTestMode] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [language, setLanguage] = useState("english");
  const [isSpeaking, setIsSpeaking] = useState(false); // NEW

  const colorList = categories[selectedCategory];
  const currentQuestion = colorList[questionIndex];

  const handleColorTap = (item) => {
    if (!viewedColors.includes(item.name)) {
      setViewedColors((prev) => [...prev, item.name]);
    }
    speakColor(item);
  };

  const speakColor = (item) => {
    setIsSpeaking(true); // Start loader
    Speech.stop();

    Speech.speak(language === "urdu" ? item.translation : item.name, {
      language: language === "urdu" ? "ur-PK" : "en-US",
      onDone: () => setIsSpeaking(false),   // Stop loader after speech
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
  };

  const toggleLanguage = () => {
    Speech.stop();
    setLanguage((prev) => (prev === "english" ? "urdu" : "english"));
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#FFF3E0" barStyle="dark-content" />
      <Text style={styles.title}>🎨 Learn Colors</Text>

      {/* Sticky header area */}
      <View style={styles.stickyHeader}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.buttonRow}
        >
          <TouchableOpacity style={styles.languageToggle} onPress={toggleLanguage}>
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
              setTestMode(!testMode);
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

      {isSpeaking && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#D84315" />
          <Text style={styles.loaderText}>Speaking...</Text>
        </View>
      )}

      {/* Main content area */}
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
        <ScrollView contentContainerStyle={styles.quiz} showsVerticalScrollIndicator={false}>
          <Text style={styles.question}>Which color is this?</Text>
          <TouchableOpacity onPress={() => speakColor(currentQuestion)}>
            <View
              style={[styles.colorBlock, { backgroundColor: currentQuestion.hex }]}
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
  stickyHeader: {
    backgroundColor: "#FFF3E0",
    paddingVertical: 5,
  },
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
  buttonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },
  filterButton: {
    backgroundColor: "#FFE0B2",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  activeFilter: {
    backgroundColor: "#D84315",
  },
  testButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: "#FFE0B2",
    borderRadius: 20,
  },
  activeTest: {
    backgroundColor: "#D84315",
  },
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
  clearText: {
    color: "#fff",
    fontWeight: "bold",
  },
  list: {
    alignItems: "center",
    paddingBottom: 80,
  },
  quiz: {
    alignItems: "center",
    padding: 20,
  },
  question: {
    fontSize: 22,
    marginBottom: 20,
    fontWeight: "bold",
  },
  colorBlock: {
    width: 150,
    height: 150,
    borderRadius: 15,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: "#000",
  },
  options: {
    width: "100%",
    marginTop: 10,
    gap: 10,
    paddingBottom: 40,
  },
  optionButton: {
    padding: 12,
    backgroundColor: "#FFF8E1",
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
  loaderText: {
    fontSize: 16,
    color: "#D84315",
    fontWeight: "bold",
  },
});
