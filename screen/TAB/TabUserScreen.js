import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import AppLayout from '../../components/layout/AppLayout';

const TabUserScreen = () => {
  const [user, setUser] = useState({ name: '', email: '', age: '' });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      if (userData) {
        setUser(JSON.parse(userData));
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
      setUser({ name: '', email: '', age: '' });
      Alert.alert('Success', 'User data deleted successfully');
    } catch (error) {
      console.error('Error deleting user data:', error);
      Alert.alert('Error', 'Failed to delete user data');
    }
  };

  const handleInputChange = (field, value) => {
    setUser({ ...user, [field]: value });
  };

  return (
    <AppLayout>
      <View
        
        style={styles.container}
        
      >
        <Text style={styles.title}>User Profile</Text>
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Name"
            value={user.name}
            onChangeText={(text) => handleInputChange('name', text)}
            editable={isEditing}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={user.email}
            onChangeText={(text) => handleInputChange('email', text)}
            editable={isEditing}
            keyboardType="email-address"
          />
          <TextInput
            style={styles.input}
            placeholder="Age"
            value={user.age}
            onChangeText={(text) => handleInputChange('age', text)}
            editable={isEditing}
            keyboardType="numeric"
          />
        </View>
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
});
