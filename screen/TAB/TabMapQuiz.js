import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import LinearGradient from 'react-native-linear-gradient';
import { useAppContext } from '../../store/context';
import AppLayout from '../../components/layout/AppLayout';
import { useNavigation } from '@react-navigation/native';

const TabMapQuiz = () => {
  const { quizzes } = useAppContext();
  const navigation = useNavigation();

  const initialRegion = {
    latitude: 40.4168,
    longitude: -3.7038,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  const handleStartQuiz = (quiz) => {
    navigation.navigate('StackQuizGamePlay', { quizId: quiz.id });
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
                  style={styles.calloutContainer}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Text style={styles.calloutTitle}>{quiz.name}</Text>
                  <Text style={styles.calloutScore}>Score: {quiz.score}</Text>
                  <TouchableOpacity
                    style={styles.calloutButton}
                    onPress={() => handleStartQuiz(quiz)}
                  >
                    <Text style={styles.calloutButtonText}>Start Quiz</Text>
                  </TouchableOpacity>
                </LinearGradient>
              </Callout>
            </Marker>
          ))}
        </MapView>
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
    height: '90%',
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
});

export default TabMapQuiz;
