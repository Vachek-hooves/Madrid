import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
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

  return (
    <AppLayout>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.quizName}>{currentQuiz.name}</Text>
        <Text style={styles.questionNumber}>Question {currentQuestionIndex + 1} of {currentQuiz.questions.length}</Text>
        <Text style={styles.question}>{currentQuestion.question}</Text>
        {currentQuestion.options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.optionButton,
              selectedAnswer === option && styles.selectedOption
            ]}
            onPress={() => handleAnswer(option)}
            disabled={selectedAnswer !== null}
          >
            <Text style={styles.optionText}>{option}</Text>
          </TouchableOpacity>
        ))}
        {selectedAnswer && (
          <LinearGradient
            colors={['#F1BF00', '#AA151B']}
            style={styles.nextButton}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <TouchableOpacity onPress={handleNextQuestion}>
              <Text style={styles.nextButtonText}>Next Question</Text>
            </TouchableOpacity>
          </LinearGradient>
        )}
        <Text style={styles.score}>Current Score: {score}</Text>
      </ScrollView>
    </AppLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quizName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  questionNumber: {
    fontSize: 18,
    marginBottom: 10,
  },
  question: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 20,
  },
  optionButton: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    width: '100%',
  },
  selectedOption: {
    backgroundColor: '#F1BF00',
  },
  optionText: {
    fontSize: 16,
    textAlign: 'center',
  },
  nextButton: {
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
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
  },
});

export default StackQuizGamePlay;
