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
        const storedTotalScore = await AsyncStorage.getItem('totalScore');
        
        if (storedQuizData === null) {
          await AsyncStorage.setItem('quizData', JSON.stringify(quizData));
          setQuizzes(quizData);
        } else {
          setQuizzes(JSON.parse(storedQuizData));
        }

        if (storedTotalScore !== null) {
          setTotalScore(parseInt(storedTotalScore, 10));
        }
      } catch (error) {
        console.error('Error initializing quiz data:', error);
      }
    };

    initQuizData();
  }, []);

  const updateQuizData = async (newQuizData) => {
    try {
      await AsyncStorage.setItem('quizData', JSON.stringify(newQuizData));
      setQuizzes(newQuizData);
    } catch (error) {
      console.error('Error updating quiz data:', error);
    }
  };

  const updateTotalScore = async (newScore) => {
    try {
      await AsyncStorage.setItem('totalScore', newScore.toString());
      setTotalScore(newScore);
    } catch (error) {
      console.error('Error updating total score:', error);
    }
  };

  const unlockQuiz = async (quizId) => {
    if (totalScore >= 10) {
      const updatedQuizzes = quizzes.map(q =>
        q.id === quizId ? { ...q, isActive: true } : q
      );
      await updateQuizData(updatedQuizzes);
      await updateTotalScore(totalScore - 10);
      return true;
    }
    return false;
  };

  const value = {
    quizzes,
    updateQuizData,
    totalScore,
    updateTotalScore,
    unlockQuiz,
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
