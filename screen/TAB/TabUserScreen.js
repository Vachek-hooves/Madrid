import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppLayout from '../../components/layout/AppLayout';
import * as ImagePicker from 'react-native-image-picker';

const TabUserScreen = () => {
  const [user, setUser] = useState({ name: '', image: null });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      if (userData) {
        setUser(JSON.parse(userData));
        setIsEditing(false);
      } else {
        setIsEditing(true);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const saveUserData = async () => {
    try {
      await AsyncStorage.setItem('userData', JSON.stringify(user));
      setIsEditing(false);
      Alert.alert('Success', 'User data saved successfully');
    } catch (error) {
      console.error('Error saving user data:', error);
      Alert.alert('Error', 'Failed to save user data');
    }
  };

  const deleteUserData = async () => {
    try {
      await AsyncStorage.removeItem('userData');
      setUser({ name: '', image: null });
      setIsEditing(true);  // Allow editing after deletion
      Alert.alert('Success', 'User data deleted successfully');
    } catch (error) {
      console.error('Error deleting user data:', error);
      Alert.alert('Error', 'Failed to delete user data');
    }
  };

  const handleInputChange = (value) => {
    setUser({ ...user, name: value });
  };

  const pickImage = () => {
    ImagePicker.launchImageLibrary(
      {
        mediaType: 'photo',
        includeBase64: false,
        maxHeight: 200,
        maxWidth: 200,
      },
      (response) => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.error) {
          console.log('ImagePicker Error: ', response.error);
        } else if (response.assets && response.assets.length > 0) {
          setUser({ ...user, image: response.assets[0].uri });
        }
      },
    );
  };

  const renderUserDetails = () => (
    <View style={styles.userDetails}>
      {user.image && <Image source={{ uri: user.image }} style={styles.userImage} />}
      <Text style={styles.userName}>{user.name}</Text>
    </View>
  );

  const renderEditForm = () => (
    <View style={styles.form}>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={user.name}
        onChangeText={handleInputChange}
      />
      <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
        {user.image ? (
          <Image source={{ uri: user.image }} style={styles.image} />
        ) : (
          <Text style={styles.imagePickerText}>Pick an image</Text>
        )}
      </TouchableOpacity>
    </View>
  );

  return (
    <AppLayout>
      <View style={styles.container}>
        <Text style={styles.title}>User Profile</Text>
        {isEditing ? renderEditForm() : renderUserDetails()}
        <View style={styles.buttonContainer}>
          {isEditing ? (
            <TouchableOpacity style={styles.button} onPress={saveUserData}>
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.button} onPress={() => setIsEditing(true)}>
              <Text style={styles.buttonText}>Edit</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.button} onPress={deleteUserData}>
            <Text style={styles.buttonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </AppLayout>
  );
};

export default TabUserScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: 40,
    
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
    textAlign: 'center',
  },
  form: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  button: {
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
    padding: 10,
    width: '40%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#AA151B',
    fontSize: 16,
    fontWeight: 'bold',
  },
  imagePicker: {
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
    height: 150,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 5,
  },
  imagePickerText: {
    color: '#AA151B',
    fontSize: 16,
  },
  userDetails: {
    alignItems: 'center',
    marginBottom: 20,
  },
  userImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 10,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});
