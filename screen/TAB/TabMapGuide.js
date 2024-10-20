import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Modal, TextInput, Image, ScrollView } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import LinearGradient from 'react-native-linear-gradient';
import AppLayout from '../../components/layout/AppLayout';
import { launchImageLibrary } from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MARKERS_STORAGE_KEY = '@guide_map_markers';

const TabMapGuide = () => {
  const [markers, setMarkers] = useState([]);
  const [showCreateMarkerModal, setShowCreateMarkerModal] = useState(false);
  const [showMarkerFormModal, setShowMarkerFormModal] = useState(false);
  const [showMarkerDetailsModal, setShowMarkerDetailsModal] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [markerName, setMarkerName] = useState('');
  const [markerDescription, setMarkerDescription] = useState('');
  const [markerImages, setMarkerImages] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(null);

  const initialRegion = {
    latitude: 40.4168,
    longitude: -3.7038,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  const handleMapPress = (event) => {
    setSelectedLocation(event.nativeEvent.coordinate);
    setShowCreateMarkerModal(true);
  };

  const handleMarkerPress = (marker) => {
    setSelectedMarker(marker);
    setShowMarkerDetailsModal(true);
  };

  const handleCreateMarker = () => {
    setShowCreateMarkerModal(false);
    setShowMarkerFormModal(true);
  };

  const handleImagePick = () => {
    launchImageLibrary({ mediaType: 'photo', selectionLimit: 0 }, (response) => {
      if (response.assets && response.assets.length > 0) {
        const newImages = response.assets.map(asset => asset.uri);
        setMarkerImages([...markerImages, ...newImages]);
      }
    });
  };

  useEffect(() => {
    loadMarkers();
  }, []);

  const loadMarkers = async () => {
    try {
      const storedMarkers = await AsyncStorage.getItem(MARKERS_STORAGE_KEY);
      if (storedMarkers !== null) {
        setMarkers(JSON.parse(storedMarkers));
      }
    } catch (error) {
      console.error('Error loading markers:', error);
    }
  };

  const saveMarkers = async (newMarkers) => {
    try {
      await AsyncStorage.setItem(MARKERS_STORAGE_KEY, JSON.stringify(newMarkers));
    } catch (error) {
      console.error('Error saving markers:', error);
    }
  };

  const handleSaveMarker = () => {
    if (markerName && selectedLocation) {
      const newMarker = {
        id: Date.now(),
        coordinate: selectedLocation,
        name: markerName,
        description: markerDescription,
        images: markerImages,
      };
      const updatedMarkers = [...markers, newMarker];
      setMarkers(updatedMarkers);
      saveMarkers(updatedMarkers);
      setShowMarkerFormModal(false);
      resetForm();
    }
  };

  const handleDeleteMarker = (markerId) => {
    const updatedMarkers = markers.filter(marker => marker.id !== markerId);
    setMarkers(updatedMarkers);
    saveMarkers(updatedMarkers);
    setShowMarkerDetailsModal(false);
  };

  const resetForm = () => {
    setMarkerName('');
    setMarkerDescription('');
    setMarkerImages([]);
    setSelectedLocation(null);
  };

  const removeImage = (index) => {
    setMarkerImages(markerImages.filter((_, i) => i !== index));
  };

  const CustomMarker = ({ marker }) => (
    <View style={styles.customMarkerContainer}>
      {marker.images && marker.images.length > 0 ? (
        <Image source={{ uri: marker.images[0] }} style={styles.markerImage} />
      ) : (
        <View style={styles.markerNameContainer}>
          <Text style={styles.markerNameText}>{marker.name}</Text>
        </View>
      )}
    </View>
  );

  return (
    <AppLayout>
      <View style={styles.container}>
        <MapView
          style={styles.map}
          initialRegion={initialRegion}
          onPress={handleMapPress}
        >
          {markers.map((marker) => (
            <Marker
              key={marker.id}
              coordinate={marker.coordinate}
              onPress={(e) => {
                e.stopPropagation();
                handleMarkerPress(marker);
              }}
            >
              <CustomMarker marker={marker} />
            </Marker>
          ))}
        </MapView>
        <LinearGradient
          colors={['#F1BF00', '#AA151B']}
          style={styles.headerContainer}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.headerText}>Guide Map</Text>
        </LinearGradient>

        <Modal
          visible={showCreateMarkerModal}
          transparent={true}
          animationType="slide"
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Create a new marker?</Text>
              <TouchableOpacity style={styles.button} onPress={handleCreateMarker}>
                <Text style={styles.buttonText}>Create Marker</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={() => setShowCreateMarkerModal(false)}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Modal
          visible={showMarkerFormModal}
          transparent={true}
          animationType="slide"
        >
          <View style={styles.modalContainer}>
            <ScrollView contentContainerStyle={styles.modalContent}>
              <Text style={styles.modalTitle}>New Marker Details</Text>
              <TextInput
                style={styles.input}
                placeholder="New marker"
                value={markerName}
                onChangeText={setMarkerName}
              />
              <TextInput
                style={styles.input}
                placeholder="Description"
                value={markerDescription}
                onChangeText={setMarkerDescription}
                multiline
              />
              <TouchableOpacity style={styles.button} onPress={handleImagePick}>
                <Text style={styles.buttonText}>Choose Images</Text>
              </TouchableOpacity>
              <View style={styles.imageContainer}>
                {markerImages.map((image, index) => (
                  <View key={index} style={styles.imageWrapper}>
                    <Image source={{ uri: image }} style={styles.previewImage} />
                    <TouchableOpacity style={styles.removeImageButton} onPress={() => removeImage(index)}>
                      <Text style={styles.removeImageText}>X</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
              <TouchableOpacity style={styles.button} onPress={handleSaveMarker}>
                <Text style={styles.buttonText}>Save Marker</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={() => setShowMarkerFormModal(false)}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </Modal>

        <Modal
          visible={showMarkerDetailsModal}
          transparent={true}
          animationType="slide"
        >
          <View style={styles.modalContainer}>
            <ScrollView contentContainerStyle={styles.modalContent}>
              {selectedMarker && (
                <>
                  <Text style={styles.modalTitle}>{selectedMarker.name}</Text>
                  <Text style={styles.markerDescription}>{selectedMarker.description}</Text>
                  <View style={styles.imageContainer}>
                    {selectedMarker.images.map((image, index) => (
                      <View key={index} style={styles.imageWrapper}>
                        <Image source={{ uri: image }} style={styles.previewImage} />
                      </View>
                    ))}
                  </View>
                  <TouchableOpacity style={styles.button} onPress={() => setShowMarkerDetailsModal(false)}>
                    <Text style={styles.buttonText}>Close</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={() => handleDeleteMarker(selectedMarker.id)}>
                    <Text style={styles.buttonText}>Delete Marker</Text>
                  </TouchableOpacity>
                </>
              )}
            </ScrollView>
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
  headerContainer: {
    position: 'absolute',
    top: '6%',
    left: 20,
    right: 20,
    padding: 10,
    borderRadius: 20,
    alignItems: 'center',
  },
  headerText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '90%',
    maxHeight: '90%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    maxHeight: 120,
  },
  button: {
    backgroundColor: '#AA151B',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  imageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  imageWrapper: {
    width: '30%',
    aspectRatio: 1,
    marginBottom: 10,
  },
  previewImage: {
    width: '100%',
    height: '100%',
    borderRadius: 5,
  },
  removeImageButton: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: 'rgba(255, 0, 0, 0.7)',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeImageText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 10,
  },
  markerDescription: {
    fontSize: 14,
    marginBottom: 10,
  },
  customMarkerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'white',
  },
  markerNameContainer: {
    backgroundColor: '#AA151B',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'white',
  },
  markerNameText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  deleteButton: {
    backgroundColor: 'red',
  },
});

export default TabMapGuide;
