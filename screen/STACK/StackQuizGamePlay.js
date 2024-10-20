import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { useAppContext } from '../../store/context';
import AppLayout from '../../components/layout/AppLayout';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';

const StackQuizGamePlay = ({ route }) => {
  const { quizId } = route.params;
  const { quizzes, updateQuizScore } = useAppContext();
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const quiz = quizzes.find(q => q.id === quizId);
    if (quiz) {
      setCurrentQuiz(quiz);
    }
  }, [quizId, quizzes]);

  const handleAnswer = (answer) => {
    setSelectedAnswer(answer);
    if (answer === currentQuiz.questions[currentQuestionIndex].answer) {
      setScore(prevScore => prevScore + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < currentQuiz.questions.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
      setSelectedAnswer(null);
    } else {
      setQuizCompleted(true);
      const finalScore = score + (selectedAnswer === currentQuestion.answer ? 1 : 0);
      updateQuizScore(quizId, finalScore);
    }
  };

  const handlePlayPuzzle = () => {
    navigation.navigate('StackPuzzleGame', { quizId: currentQuiz.id, quizName: currentQuiz.name });
  };

  const handleReturnToMap = () => {
    navigation.navigate('TabNavigator', { screen: 'Quiz' });
  };

  if (!currentQuiz) {
    return <Text>Loading...</Text>;
  }

  const currentQuestion = currentQuiz.questions[currentQuestionIndex];

  const getOptionStyle = (option) => {
    if (selectedAnswer === null) return ['#F1BF00', '#D68A00'];
    if (option === currentQuestion.answer) return ['#4CAF50', '#45a049'];
    if (option === selectedAnswer) return ['#f44336', '#d32f2f'];
    return ['#F1BF00', '#D68A00'];
  };

  if (quizCompleted) {
    return (
      <AppLayout>
        <LinearGradient
          colors={['#F1BF00', '#AA151B']}
          style={styles.gradientContainer}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
              <Text style={styles.quizName}>{currentQuiz.name}</Text>
              <Text style={styles.completedText}>Quiz Completed!</Text>
              <Text style={styles.scoreText}>Your Score: {score}/{currentQuiz.questions.length}</Text>
              <TouchableOpacity onPress={handlePlayPuzzle}>
                <LinearGradient
                  colors={['#F1BF00', '#D68A00']}
                  style={styles.puzzleButton}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Text style={styles.puzzleButtonText}>Play Puzzle for More Score</Text>
                </LinearGradient>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleReturnToMap}>
                <LinearGradient
                  colors={['#F1BF00', '#D68A00']}
                  style={styles.returnButton}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Text style={styles.returnButtonText}>Return to Map</Text>
                </LinearGradient>
              </TouchableOpacity>
            </ScrollView>
          </SafeAreaView>
        </LinearGradient>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <LinearGradient
        colors={['#F1BF00', '#AA151B']}
        style={styles.gradientContainer}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <SafeAreaView style={styles.safeArea}>
          <ScrollView contentContainerStyle={styles.scrollViewContent}>
            <Text style={styles.quizName}>{currentQuiz.name}</Text>
            <Text style={styles.questionNumber}>Question {currentQuestionIndex + 1} of {currentQuiz.questions.length}</Text>
            <View style={styles.questionContainer}>
              <Text style={styles.question}>{currentQuestion.question}</Text>
            </View>
            {currentQuestion.options.map((option, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleAnswer(option)}
                disabled={selectedAnswer !== null}
              >
                <LinearGradient
                  colors={getOptionStyle(option)}
                  style={styles.optionButton}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Text style={[styles.optionText, selectedAnswer === option && styles.selectedOptionText]}>{option}</Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
            {selectedAnswer && (
              <TouchableOpacity onPress={handleNextQuestion}>
                <LinearGradient
                  colors={['#F1BF00', '#D68A00']}
                  style={styles.nextButton}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Text style={styles.nextButtonText}>
                    {currentQuestionIndex < currentQuiz.questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            )}
            <Text style={styles.score}>Current Score: {score}</Text>
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </AppLayout>
  );
};

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    padding: 20,
  },
  quizName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,textAlign: 'center',
  },
  questionNumber: {
    fontSize: 18,
    color: 'white',
    marginBottom: 10,textAlign: 'center',
  },
  questionContainer: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    height:120
  },
  question: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
  },
  optionButton: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    width: '100%',
    borderWidth: 2,
    borderColor: 'white',
  },
  optionText: {
    fontSize: 16,
    textAlign: 'center',
    color: 'white',
    fontWeight: 'bold',textAlign: 'center',
  },
  selectedOptionText: {
    fontWeight: 'bold',textAlign: 'center',
  },
  nextButton: {
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    // width: 300,
    borderWidth: 2,
    borderColor: 'white',
  },
  nextButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  score: {
    fontSize: 18,
    marginTop: 20,
    color: 'white',textAlign: 'center',
  },
  completedText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'white',textAlign: 'center',
  },
  scoreText: {
    fontSize: 18,
    marginBottom: 20,
    color: 'white',
    textAlign: 'center',
  },
  puzzleButton: {
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    // width: 300,
    borderWidth: 2,
    borderColor: 'white',
  },
  puzzleButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  returnButton: {
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    // width: 300,
    borderWidth: 2,
    borderColor: 'white',
  },
  returnButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default StackQuizGamePlay;
