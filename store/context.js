import { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { quizData } from '../data/quizData';

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    const initQuizData = async () => {
      try {
        // Check if quizData exists in AsyncStorage
        const storedQuizData = await AsyncStorage.getItem('quizData');
        
        if (storedQuizData === null) {
          // If not, store the initial quizData
          await AsyncStorage.setItem('quizData', JSON.stringify(quizData));
          setQuizzes(quizData);
        } else {
          // If it exists, use the stored data
          setQuizzes(JSON.parse(storedQuizData));
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

  const value = {
    quizzes,
    updateQuizData,
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
