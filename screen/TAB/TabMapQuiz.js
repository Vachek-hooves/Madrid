import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert, SafeAreaView } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import LinearGradient from 'react-native-linear-gradient';
import { useAppContext } from '../../store/context';
import AppLayout from '../../components/layout/AppLayout';
import { useNavigation } from '@react-navigation/native';

const TabMapQuiz = () => {
  const { quizzes, totalScore, unlockQuiz, resetAllQuizzes } = useAppContext();
  const navigation = useNavigation();

  const initialRegion = {
    latitude: 40.4168,
    longitude: -3.7038,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  const handleStartQuiz = (quiz) => {
    if (quiz.isActive) {
      navigation.navigate('StackQuizGamePlay', { quizId: quiz.id });
    } else {
      Alert.alert(
        'Locked Quiz',
        'This quiz is locked. Would you like to unlock it for 10 scores?',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Unlock', 
            onPress: async () => {
              const unlocked = await unlockQuiz(quiz.id);
              if (unlocked) {
                Alert.alert('Success', 'Quiz unlocked! You can now start the quiz.');
              } else {
                Alert.alert('Error', 'Not enough scores to unlock this quiz.');
              }
            }
          }
        ]
      );
    }
  };

  const handleResetQuizzes = () => {
    Alert.alert(
      'Reset All Quizzes',
      'Are you sure you want to reset all quizzes? This will clear all scores and lock all quizzes except the first one.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Reset', 
          onPress: () => {
            resetAllQuizzes();
            Alert.alert('Success', 'All quizzes have been reset.');
          }
        }
      ]
    );
  };

  return (
    <AppLayout>
      <View style={styles.container}>
        <MapView
          style={styles.map}
          initialRegion={initialRegion}
        >
          {quizzes.map((quiz) => (
            <Marker
              key={quiz.id}
              coordinate={quiz.coordinates}
              opacity={quiz.isActive ? 1 : 0.5}
            >
              <LinearGradient
                colors={['#F1BF00', '#AA151B']}
                style={styles.markerContainer}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.markerText}>{quiz.id}</Text>
              </LinearGradient>
              <Callout>
                <LinearGradient
                  colors={['#F1BF00', '#AA151B']}
                  style={[styles.calloutContainer, !quiz.isActive && styles.lockedCallout]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Text style={styles.calloutTitle}>{quiz.name}</Text>
                  <Text style={styles.calloutScore}>Score: {quiz.score}</Text>
                  <TouchableOpacity
                    style={styles.calloutButton}
                    onPress={() => handleStartQuiz(quiz)}
                  >
                    <Text style={styles.calloutButtonText}>
                      {quiz.isActive ? 'Start Quiz' : 'Unlock Quiz'}
                    </Text>
                  </TouchableOpacity>
                </LinearGradient>
              </Callout>
            </Marker>
          ))}
        </MapView>
        <LinearGradient
          colors={['#F1BF00', '#AA151B']}
          style={styles.scoreContainer}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.scoreText}>Total Score: {totalScore}</Text>
          <TouchableOpacity style={styles.resetButton} onPress={handleResetQuizzes}>
            <Text style={styles.resetButtonText}>Reset</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </AppLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  markerContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  markerText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  calloutContainer: {
    width: 200,
    padding: 15,
    borderRadius: 10,
  },
  calloutTitle: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
  },
  calloutScore: {
    color: 'white',
    fontSize: 14,
    marginBottom: 10,
  },
  calloutButton: {
    backgroundColor: 'white',
    padding: 8,
    borderRadius: 5,
    alignItems: 'center',
  },
  calloutButtonText: {
    color: '#AA151B',
    fontWeight: 'bold',
  },
  lockedCallout: {
    opacity: 0.7,
  },
  scoreContainer: {
    position: 'absolute',
    top: '6%',
    left: 20,
    right: 20,
    padding: 10,
    borderRadius: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  scoreText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  resetButton: {
    backgroundColor: 'white',
    padding: 8,
    borderRadius: 5,
  },
  resetButtonText: {
    color: '#AA151B',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default TabMapQuiz;
