import { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { quizData } from '../data/quizData';

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const [quizzes, setQuizzes] = useState([]);
  const [totalScore, setTotalScore] = useState(0);

  useEffect(() => {
    const initQuizData = async () => {
      try {
        const storedQuizData = await AsyncStorage.getItem('quizData');
        
        if (storedQuizData === null) {
          await AsyncStorage.setItem('quizData', JSON.stringify(quizData));
          setQuizzes(quizData);
        } else {
          setQuizzes(JSON.parse(storedQuizData));
        }

        calculateTotalScore(JSON.parse(storedQuizData) || quizData);
      } catch (error) {
        console.error('Error initializing quiz data:', error);
      }
    };

    initQuizData();
  }, []);

  const calculateTotalScore = (quizzes) => {
    const newTotalScore = quizzes.reduce((total, quiz) => total + (quiz.score || 0), 0);
    setTotalScore(newTotalScore);
    AsyncStorage.setItem('totalScore', newTotalScore.toString());
  };

  const updateQuizData = async (newQuizData) => {
    try {
      await AsyncStorage.setItem('quizData', JSON.stringify(newQuizData));
      setQuizzes(newQuizData);
      calculateTotalScore(newQuizData);
    } catch (error) {
      console.error('Error updating quiz data:', error);
    }
  };

  const updateQuizScore = async (quizId, newScore) => {
    try {
      const updatedQuizzes = quizzes.map(quiz => 
        quiz.id === quizId ? { ...quiz, score: newScore } : quiz
      );
      await updateQuizData(updatedQuizzes);
    } catch (error) {
      console.error('Error updating quiz score:', error);
    }
  };

  const unlockQuiz = async (quizId) => {
    if (totalScore >= 10) {
      const updatedQuizzes = quizzes.map(q =>
        q.id === quizId ? { ...q, isActive: true } : q
      );
      await updateQuizData(updatedQuizzes);
      const newTotalScore = totalScore - 10;
      setTotalScore(newTotalScore);
      await AsyncStorage.setItem('totalScore', newTotalScore.toString());
      return true;
    }
    return false;
  };

  const addPuzzleScore = async (quizId, puzzleScore) => {
    try {
      const updatedQuizzes = quizzes.map(quiz => 
        quiz.id === quizId ? { ...quiz, score: (quiz.score || 0) + puzzleScore } : quiz
      );
      await updateQuizData(updatedQuizzes);
    } catch (error) {
      console.error('Error adding puzzle score:', error);
    }
  };

  const value = {
    quizzes,
    updateQuizData,
    totalScore,
    updateQuizScore,
    unlockQuiz,
    addPuzzleScore,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppContextProvider');
  }
  return context;
};
