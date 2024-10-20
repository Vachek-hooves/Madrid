import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal, ScrollView, TextInput, Image, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import LinearGradient from 'react-native-linear-gradient';
import { launchImageLibrary } from 'react-native-image-picker';
import AppLayout from '../../components/layout/AppLayout';
import { useAppContext } from '../../store/context';

const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = 0.0421;

const TabMapGuide = () => {
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [newMarker, setNewMarker] = useState(null);
  const { quizzes, updateQuizData } = useAppContext();

  const initialRegion = {
    latitude: 40.4168,
    longitude: -3.7038,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  };

  const handleMarkerPress = (quiz) => {
    setSelectedPlace(quiz);
    setModalVisible(true);
  };

  const handleMapPress = (event) => {
    const { coordinate } = event.nativeEvent;
    setNewMarker({
      coordinate,
      title: '',
      description: '',
      images: [],
    });
    setModalVisible(true);
  };

  const pickImage = () => {
    const options = {
      mediaType: 'photo',
      includeBase64: true,
      maxHeight: 200,
      maxWidth: 200,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        const source = { uri: response.assets[0].uri };
        setNewMarker(prev => ({
          ...prev,
          images: [...(prev.images || []), source],
        }));
      }
    });
  };

  const handleSaveMarker = () => {
    if (newMarker && newMarker.title && newMarker.description) {
      const updatedQuizzes = [...quizzes, { ...newMarker, id: Date.now().toString() }];
      updateQuizData(updatedQuizzes);
      setNewMarker(null);
      setModalVisible(false);
      Alert.alert('Success', 'New marker has been created!');
    } else {
      Alert.alert('Error', 'Please fill in all fields before saving.');
    }
  };

  const handleDeleteMarker = () => {
    if (!selectedPlace || !selectedPlace.id) return;

    Alert.alert(
      'Delete Marker',
      'Are you sure you want to delete this marker?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => {
            const updatedQuizzes = quizzes.filter(quiz => quiz.id !== selectedPlace.id);
            updateQuizData(updatedQuizzes);
            setModalVisible(false);
            setSelectedPlace(null);
          },
        },
      ],
    );
  };

  const renderQuizMarkers = () =>
    quizzes.map((quiz) => (
      <Marker
        key={`quiz-${quiz.id}`}
        coordinate={quiz.coordinate}
        onPress={() => handleMarkerPress(quiz)}
      >
        <LinearGradient
          colors={['#F1BF00', '#AA151B']}
          style={styles.markerContainer}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.markerText}>{quiz.id}</Text>
        </LinearGradient>
      </Marker>
    ));

  const renderModalContent = () => {
    const isNewMarker = !selectedPlace;
    const markerData = isNewMarker ? newMarker : selectedPlace;

    if (!markerData) return null;

    return (
      <>
        <TextInput
          style={styles.input}
          placeholder="Place Name"
          placeholderTextColor="#fff"
          value={markerData.title}
          onChangeText={text => isNewMarker ? setNewMarker(prev => ({...prev, title: text})) : null}
          editable={isNewMarker}
        />
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Description"
          placeholderTextColor="#fff"
          multiline
          value={markerData.description}
          onChangeText={text => isNewMarker ? setNewMarker(prev => ({...prev, description: text})) : null}
          editable={isNewMarker}
        />
        {isNewMarker && (
          <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
            <Text style={styles.imageButtonText}>Add Image</Text>
          </TouchableOpacity>
        )}
        {markerData.images &&
          markerData.images.map((image, index) => (
            <Image
              key={index}
              source={image}
              style={styles.modalImage}
              resizeMode="cover"
            />
          ))}
        {isNewMarker ? (
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSaveMarker}>
            <Text style={styles.saveButtonText}>Save Marker</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={handleDeleteMarker}>
            <Text style={styles.deleteButtonText}>Delete Marker</Text>
          </TouchableOpacity>
        )}
      </>
    );
  };

  return (
    <AppLayout>
      <View style={styles.container}>
        <MapView
          style={styles.map}
          initialRegion={initialRegion}
          onPress={handleMapPress}
        >
          {renderQuizMarkers()}
          {newMarker && (
            <Marker coordinate={newMarker.coordinate}>
              <LinearGradient
                colors={['#F1BF00', '#AA151B']}
                style={styles.markerContainer}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.markerText}>New</Text>
              </LinearGradient>
            </Marker>
          )}
        </MapView>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(false);
            setNewMarker(null);
            setSelectedPlace(null);
          }}>
          <View style={styles.modalOverlay}>
            <LinearGradient
              colors={['#F1BF00', '#AA151B']}
              style={styles.modalView}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <ScrollView contentContainerStyle={styles.modalContent}>
                {renderModalContent()}
              </ScrollView>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => {
                  setModalVisible(false);
                  setNewMarker(null);
                  setSelectedPlace(null);
                }}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </Modal>
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
  calloutButton: {
    backgroundColor: 'white',
    padding: 8,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 5,
  },
  calloutButtonText: {
    color: '#AA151B',
    fontWeight: 'bold',
  },
  createMarkerButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    padding: 10,
    borderRadius: 5,
  },
  createMarkerButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  instructionContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 10,
    borderRadius: 5,
  },
  instructionText: {
    color: 'white',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '80%',
    maxHeight: '80%',
  },
  modalContent: {
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'white',
  },
  modalDescription: {
    fontSize: 16,
    marginBottom: 10,
    color: 'white',
  },
  modalImage: {
    width: 200,
    height: 150,
    marginBottom: 10,
  },
  closeButton: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginTop: 15,
  },
  closeButtonText: {
    color: '#AA151B',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'white',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    width: '100%',
    color: 'white',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  imageButton: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginBottom: 10,
  },
  imageButtonText: {
    color: '#AA151B',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  createButton: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginTop: 55,
  },
  createButtonText: {
    color: '#AA151B',
    fontWeight: 'bold',
    textAlign: 'center',
    zIndex:10
  },
  deleteButton: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginTop: 15,
  },
  deleteButtonText: {
    color: '#AA151B',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  saveButton: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginTop: 15,
  },
  saveButtonText: {
    color: '#AA151B',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default TabMapGuide;
