import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Image, TouchableOpacity, Dimensions, Text, SafeAreaView } from 'react-native';

const puzzleImage = require('../assets/image/puzzle/culture.png');
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const PUZZLE_HEIGHT = SCREEN_HEIGHT * 0.75;
const PUZZLE_WIDTH = PUZZLE_HEIGHT * (9 / 16);

const TabTestPuzzle = () => {
  const [pieces, setPieces] = useState([]);
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes in seconds
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    createPuzzlePieces();
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          setGameOver(true);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const createPuzzlePieces = () => {
    const numRows = 4;
    const numCols = 3;
    const newPieces = [];

    for (let i = 0; i < numRows * numCols; i++) {
      newPieces.push({
        id: i,
        row: Math.floor(i / numCols),
        col: i % numCols,
      });
    }

    setPieces(shuffleArray([...newPieces]));
  };

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const handlePiecePress = (index) => {
    if (selectedPiece === null) {
      setSelectedPiece(index);
    } else {
      swapPieces(selectedPiece, index);
      setSelectedPiece(null);
    }
  };

  const swapPieces = (index1, index2) => {
    setPieces(prevPieces => {
      const newPieces = [...prevPieces];
      [newPieces[index1], newPieces[index2]] = [newPieces[index2], newPieces[index1]];
      return newPieces;
    });
  };

  const isPuzzleSolved = () => {
    return pieces.every((piece, index) => piece.id === index);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.timerContainer}>
        <Text style={styles.timerText}>Time left: {formatTime(timeLeft)}</Text>
      </View>
      <View style={styles.puzzleContainer}>
        {pieces.map((piece, index) => (
          <TouchableOpacity
            key={piece.id}
            style={[
              styles.piece,
              selectedPiece === index && styles.selectedPiece,
            ]}
            onPress={() => handlePiecePress(index)}
            disabled={gameOver}
          >
            <Image
              source={puzzleImage}
              style={[
                styles.pieceImage,
                {
                  width: PUZZLE_WIDTH,
                  height: PUZZLE_HEIGHT,
                  transform: [
                    { translateX: -piece.col * (PUZZLE_WIDTH / 3) },
                    { translateY: -piece.row * (PUZZLE_HEIGHT / 4) },
                  ],
                },
              ]}
            />
          </TouchableOpacity>
        ))}
      </View>
      {isPuzzleSolved() && (
        <View style={styles.overlayContainer}>
          <Text style={styles.overlayText}>Puzzle Solved!</Text>
        </View>
      )}
      {gameOver && !isPuzzleSolved() && (
        <View style={styles.overlayContainer}>
          <Text style={styles.overlayText}>
            Unfortunately, time is over. Try next time!
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  timerContainer: {
    padding: 10,
    alignItems: 'center',
  },
  timerText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  puzzleContainer: {
    width: PUZZLE_WIDTH,
    height: PUZZLE_HEIGHT,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignSelf: 'center',
  },
  piece: {
    width: PUZZLE_WIDTH / 3,
    height: PUZZLE_HEIGHT / 4,
    overflow: 'hidden',
  },
  pieceImage: {
    position: 'absolute',
  },
  selectedPiece: {
    borderWidth: 2,
    borderColor: 'yellow',
  },
  overlayContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 20,
  },
});

export default TabTestPuzzle;
