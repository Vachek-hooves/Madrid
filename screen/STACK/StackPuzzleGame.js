import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  Text,
  SafeAreaView,
} from 'react-native';
import AppLayout from '../../components/layout/AppLayout';
import { puzzleData } from '../../data/puzzleData';
import { useAppContext } from '../../store/context';
import { useNavigation } from '@react-navigation/native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const PUZZLE_HEIGHT = SCREEN_HEIGHT * 0.75;
const PUZZLE_WIDTH = PUZZLE_HEIGHT * (9 / 16);

const StackPuzzleGame = ({ route }) => {
  const { quizId, quizName } = route.params;
  const [pieces, setPieces] = useState([]);
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [timeLeft, setTimeLeft] = useState(120);
  const [gameOver, setGameOver] = useState(false);
  const [puzzleImage, setPuzzleImage] = useState(null);
  const [puzzleScore, setPuzzleScore] = useState(10);
  const [gameStarted, setGameStarted] = useState(false);
  const { updateTotalScore, addPuzzleScore } = useAppContext();
  const navigation = useNavigation();

  const createPuzzlePieces = useCallback(() => {
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

    return shuffleArray([...newPieces]);
  }, []);

  useEffect(() => {
    const puzzle = puzzleData.find(p => p.id === quizId);
    if (puzzle) {
      setPuzzleImage(puzzle.image);
      setPieces(createPuzzlePieces());
      setGameStarted(true);
    }
  }, [quizId, createPuzzlePieces]);

  useEffect(() => {
    let timer;
    let scoreTimer;

    if (gameStarted && !gameOver) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer);
            clearInterval(scoreTimer);
            setGameOver(true);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);

      scoreTimer = setInterval(() => {
        if (timeLeft <= 90) {
          setPuzzleScore((prevScore) => Math.max(prevScore - 1, 0));
        }
      }, 10000);
    }

    return () => {
      clearInterval(timer);
      clearInterval(scoreTimer);
    };
  }, [gameStarted, gameOver, timeLeft]);

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
    const newPieces = [...pieces];
    [newPieces[index1], newPieces[index2]] = [newPieces[index2], newPieces[index1]];
    setPieces(newPieces);
  };

  const isPuzzleSolved = () => {
    const solved = pieces.every((piece, index) => piece.id === index);
    if (solved && !gameOver) {
      setGameOver(true);
      addPuzzleScore(quizId, puzzleScore);
    }
    return solved;
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleReturnToMap = () => {
    navigation.navigate('TabNavigator', { screen: 'Quiz' });
  };

  if (!gameStarted) {
    return (
      <AppLayout blur={10}>
        <SafeAreaView style={styles.container}>
          <Text style={styles.loadingText}>Loading puzzle...</Text>
        </SafeAreaView>
      </AppLayout>
    );
  }

  return (
    <AppLayout blur={10}>
      <SafeAreaView style={styles.container}>
        <Text style={styles.quizName}>{quizName} Puzzle</Text>
        <View style={styles.infoContainer}>
          <Text style={styles.timerText}>Time left: {formatTime(timeLeft)}</Text>
          <Text style={styles.scoreText}>Potential Score: {puzzleScore}</Text>
        </View>
        {puzzleImage && (
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
        )}
        {isPuzzleSolved() && (
          <View style={styles.overlayContainer}>
            <Text style={styles.overlayText}>Puzzle Solved!</Text>
            <Text style={styles.overlayText}>You earned {puzzleScore} points!</Text>
            <TouchableOpacity style={styles.returnButton} onPress={handleReturnToMap}>
              <Text style={styles.returnButtonText}>Return to Map</Text>
            </TouchableOpacity>
          </View>
        )}
        {gameOver && !isPuzzleSolved() && (
          <View style={styles.overlayContainer}>
            <Text style={styles.overlayText}>
              Unfortunately, time is over. Try next time!
            </Text>
            <TouchableOpacity style={styles.returnButton} onPress={handleReturnToMap}>
              <Text style={styles.returnButtonText}>Return to Map</Text>
            </TouchableOpacity>
          </View>
        )}
      </SafeAreaView>
    </AppLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // backgroundColor: '#F5FCFF',
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
  quizName: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  scoreText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  returnButton: {
    backgroundColor: '#F1BF00',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  returnButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loadingText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default StackPuzzleGame;
