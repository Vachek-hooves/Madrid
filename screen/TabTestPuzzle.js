import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Image, TouchableOpacity, Dimensions, Text } from 'react-native';

const puzzleImage = require('../assets/image/puzzle/culture.png');
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const PUZZLE_HEIGHT = SCREEN_HEIGHT * 0.75;
const PUZZLE_WIDTH = PUZZLE_HEIGHT * (9 / 16);

const TabTestPuzzle = () => {
  const [pieces, setPieces] = useState([]);
  const [selectedPiece, setSelectedPiece] = useState(null);

  useEffect(() => {
    createPuzzlePieces();
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

  return (
    <View style={styles.container}>
      <View style={styles.puzzleContainer}>
        {pieces.map((piece, index) => (
          <TouchableOpacity
            key={piece.id}
            style={[
              styles.piece,
              selectedPiece === index && styles.selectedPiece,
            ]}
            onPress={() => handlePiecePress(index)}
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
      {isPuzzleSolved() && <View style={styles.solvedOverlay}><Text style={styles.solvedText}>Puzzle Solved!</Text></View>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  puzzleContainer: {
    width: PUZZLE_WIDTH,
    height: PUZZLE_HEIGHT,
    flexDirection: 'row',
    flexWrap: 'wrap',
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
  solvedOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  solvedText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default TabTestPuzzle;
