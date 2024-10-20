import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { useAppContext } from '../../store/context';
import AppLayout from '../../components/layout/AppLayout';
import LinearGradient from 'react-native-linear-gradient';

const StackQuizGamePlay = ({ route }) => {
  const { quizId } = route.params;
  const { quizzes } = useAppContext();
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const quiz = quizzes.find(q => q.id === quizId);
    setCurrentQuiz(quiz);
  }, [quizId, quizzes]);

  if (!currentQuiz) {
    return (
      <AppLayout>
        <View style={styles.container}>
          <Text>Loading quiz...</Text>
        </View>
      </AppLayout>
    );
  }

  const currentQuestion = currentQuiz.questions[currentQuestionIndex];

  const handleAnswer = (answer) => {
    setSelectedAnswer(answer);
    if (answer === currentQuestion.answer) {
      setScore(score + 1);
    }
  };

  const handleNextQuestion = () => {
    setSelectedAnswer(null);
    if (currentQuestionIndex < currentQuiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Quiz finished, handle completion (e.g., show results, update score)
      console.log('Quiz completed! Final score:', score);
    }
  };

  const getOptionStyle = (option) => {
    if (selectedAnswer === null) return ['#F1BF00', '#D68A00'];
    if (option === currentQuestion.answer) return ['#4CAF50', '#45a049'];
    if (option === selectedAnswer) return ['#f44336', '#d32f2f'];
    return ['#F1BF00', '#D68A00'];
  };

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
                  <Text style={styles.optionText}>{option}</Text>
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
                  <Text style={styles.nextButtonText}>Next Question</Text>
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
    padding: 20,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 40,
  },
  quizName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'white',
  },
  questionNumber: {
    fontSize: 18,
    marginBottom: 10,
    color: 'white',
  },
  questionContainer: {
    height: 100,
    justifyContent: 'center',
    marginBottom: 20,
  },
  question: {
    fontSize: 20,
    textAlign: 'center',
    color: 'white',
  },
  optionButton: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    width: 300,
    borderWidth: 2,
    borderColor: 'white',
  },
  optionText: {
    fontSize: 16,
    textAlign: 'center',
    color: 'white',
    fontWeight: 'bold',
  },
  nextButton: {
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    width: 300,
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
    color: 'white',
  },
});

export default StackQuizGamePlay;
