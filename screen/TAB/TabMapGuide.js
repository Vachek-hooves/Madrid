import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal, ScrollView, TextInput, Image, Alert } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
// import * as ImagePicker from 'expo-image-picker';
import * as ImagePicker from 'react-native-image-picker';
import AppLayout from '../../components/layout/AppLayout';
import { useAppContext } from '../../store/context';
import LinearGradient from 'react-native-linear-gradient';

const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = 0.0421;

const TabMapGuide = () => {
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [createMarkerMode, setCreateMarkerMode] = useState(false);
  const [newMarker, setNewMarker] = useState(null);
  const [createModalVisible, setCreateModalVisible] = useState(false);
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

  const handleMapLongPress = (event) => {
    if (createMarkerMode) {
      const { coordinate } = event.nativeEvent;
      setNewMarker({
        coordinate,
        title: '',
        description: '',
        images: [],
      });
      setCreateModalVisible(true);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: true,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const newImage = `data:image/jpeg;base64,${result.assets[0].base64}`;
      setNewMarker(prev => ({
        ...prev,
        images: [...(prev.images || []), newImage],
      }));
    }
  };

  const handleCreateMarker = () => {
    if (newMarker) {
      const updatedQuizzes = [...quizzes, { ...newMarker, id: Date.now().toString() }];
      updateQuizData(updatedQuizzes);
      setNewMarker(null);
      setCreateModalVisible(false);
      setCreateMarkerMode(false);
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
        <Callout>
          <LinearGradient
            colors={['#F1BF00', '#AA151B']}
            style={styles.calloutContainer}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.calloutTitle}>{quiz.title}</Text>
            <TouchableOpacity
              style={styles.calloutButton}
              onPress={() => setModalVisible(true)}
            >
              <Text style={styles.calloutButtonText}>Show Details</Text>
            </TouchableOpacity>
          </LinearGradient>
        </Callout>
      </Marker>
    ));

  const renderMarkerImage = (image) => {
    if (typeof image === 'string' && image.startsWith('data:image')) {
      return { uri: image };
    } else if (typeof image === 'number') {
      return image;
    } else {
      return { uri: image };
    }
  };

  const renderMarkerDetails = () => {
    if (!selectedPlace) return null;

    return (
      <>
        <Text style={styles.modalTitle}>{selectedPlace.title}</Text>
        <Text style={styles.modalDescription}>{selectedPlace.description}</Text>
        {selectedPlace.images &&
          selectedPlace.images.map((image, index) => (
            <Image
              key={index}
              source={renderMarkerImage(image)}
              style={styles.modalImage}
              resizeMode="cover"
            />
          ))}
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={handleDeleteMarker}>
          <Text style={styles.deleteButtonText}>Delete Marker</Text>
        </TouchableOpacity>
      </>
    );
  };

  return (
    <AppLayout>
      <View style={styles.container}>
        <MapView
          style={styles.map}
          initialRegion={initialRegion}
          onLongPress={handleMapLongPress}
        >
          {renderQuizMarkers()}
        </MapView>

        <LinearGradient
          colors={['#F1BF00', '#AA151B']}
          style={styles.createMarkerButton}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <TouchableOpacity
            onPress={() => setCreateMarkerMode(!createMarkerMode)}>
            <Text style={styles.createMarkerButtonText}>
              {createMarkerMode ? 'Cancel' : 'Create Marker'}
            </Text>
          </TouchableOpacity>
        </LinearGradient>

        {createMarkerMode && (
          <View style={styles.instructionContainer}>
            <Text style={styles.instructionText}>
              Long press on the map to add a new marker
            </Text>
          </View>
        )}

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <LinearGradient
              colors={['#F1BF00', '#AA151B']}
              style={styles.modalView}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <ScrollView contentContainerStyle={styles.modalContent}>
                {renderMarkerDetails()}
              </ScrollView>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </Modal>

        <Modal
          animationType="slide"
          transparent={true}
          visible={createModalVisible}
          onRequestClose={() => setCreateModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <LinearGradient
              colors={['#F1BF00', '#AA151B']}
              style={styles.modalView}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <ScrollView contentContainerStyle={styles.modalContent}>
                <TextInput
                  style={styles.input}
                  placeholder="Place Name"
                  placeholderTextColor="#fff"
                  value={newMarker?.title || ''}
                  onChangeText={text =>
                    setNewMarker(prev => ({...prev, title: text}))
                  }
                />
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Description"
                  placeholderTextColor="#fff"
                  multiline
                  value={newMarker?.description || ''}
                  onChangeText={text =>
                    setNewMarker(prev => ({...prev, description: text}))
                  }
                />
                <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
                  <Text style={styles.imageButtonText}>Add Image</Text>
                </TouchableOpacity>
                {newMarker?.images &&
                  newMarker.images.map((image, index) => (
                    <Image
                      key={index}
                      source={renderMarkerImage(image)}
                      style={styles.modalImage}
                      resizeMode="cover"
                    />
                  ))}
              </ScrollView>
              <TouchableOpacity
                style={styles.createButton}
                onPress={handleCreateMarker}>
                <Text style={styles.createButtonText}>Create Marker</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setCreateModalVisible(false)}>
                <Text style={styles.closeButtonText}>Cancel</Text>
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
});

export default TabMapGuide;
