import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useAppContext } from '../../store/context';
import AppLayout from '../../components/layout/AppLayout';

const TabMapQuiz = () => {
  const { quizzes } = useAppContext();

  const initialRegion = {
    latitude: 40.4168,
    longitude: -3.7038,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  const handleMarkerPress = (quiz) => {
    // TODO: Implement navigation to quiz details or start quiz
    console.log('Quiz selected:', quiz.name);
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
              title={quiz.name}
              description={`Score: ${quiz.score}`}
              onPress={() => handleMarkerPress(quiz)}
            >
              <View style={styles.markerContainer}>
                <Text style={styles.markerText}>{quiz.id}</Text>
              </View>
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
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 5,
    borderWidth: 1,
    borderColor: 'black',
  },
  markerText: {
    fontWeight: 'bold',
  },
});

export default TabMapQuiz;
