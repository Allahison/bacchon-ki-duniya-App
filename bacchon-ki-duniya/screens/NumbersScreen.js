import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Dimensions,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import NumberCard from '../components/NumberCard';
import numbers from '../data/numbers';

const { width } = Dimensions.get('window');

export default function NumbersScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lastIndexBeforeJump, setLastIndexBeforeJump] = useState(null);
  const flatListRef = useRef(null);

  const viewabilityConfig = useRef({ viewAreaCoveragePercentThreshold: 50 });
  const onViewRef = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  });

  const handleJump = () => {
    if (currentIndex !== 0) {
      setLastIndexBeforeJump(currentIndex);
      flatListRef.current.scrollToIndex({ index: 0, animated: true });
    } else if (lastIndexBeforeJump !== null) {
      flatListRef.current.scrollToIndex({ index: lastIndexBeforeJump, animated: true });
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#E3F2FD" barStyle="dark-content" />

      {/* Title & Info */}
      <Text style={styles.title}>🔢 Let's Count Together!</Text>
      <Text style={styles.counterText}>
        You are on number: {numbers[currentIndex].number}
      </Text>
      <Text style={styles.progressText}>
        Number {currentIndex + 1} of {numbers.length}
      </Text>

      {/* Jump Button */}
      <TouchableOpacity style={styles.button} onPress={handleJump}>
        <Text style={styles.buttonText}>
          {currentIndex === 0 ? 'Go Back' : 'Jump to 1'}
        </Text>
      </TouchableOpacity>

      {/* Number Cards List */}
      <FlatList
        ref={flatListRef}
        data={numbers}
        keyExtractor={(item) => item.number.toString()}
        renderItem={({ item }) => <NumberCard item={item} />}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.list}
        snapToInterval={width * 0.7}
        decelerationRate="fast"
        pagingEnabled
        initialScrollIndex={0}
        getItemLayout={(_, index) => ({
          length: width * 0.7,
          offset: width * 0.7 * index,
          index,
        })}
        onViewableItemsChanged={onViewRef.current}
        viewabilityConfig={viewabilityConfig.current}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E3F2FD',
    paddingTop: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#0D47A1',
    marginBottom: 10,
  },
  counterText: {
    fontSize: 22,
    fontWeight: '500',
    textAlign: 'center',
    color: '#1565C0',
  },
  progressText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#1976D2',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#0D47A1',
    padding: 10,
    marginHorizontal: 80,
    borderRadius: 10,
    marginBottom: 15,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    fontWeight: '600',
  },
  list: {
 paddingHorizontal: 20,
    alignItems: 'center',
  },
});
