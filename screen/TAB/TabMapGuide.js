import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import MapView from 'react-native-maps';
import LinearGradient from 'react-native-linear-gradient';
import AppLayout from '../../components/layout/AppLayout';

const TabMapGuide = () => {
  const initialRegion = {
    latitude: 40.4168,
    longitude: -3.7038,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  return (
    <AppLayout>
      <View style={styles.container}>
        <MapView
          style={styles.map}
          initialRegion={initialRegion}
        >
          {/* Markers and other map components will be added here later */}
        </MapView>
        <LinearGradient
          colors={['#F1BF00', '#AA151B']}
          style={styles.headerContainer}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.headerText}>Guide Map</Text>
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
});

export default TabMapGuide;
