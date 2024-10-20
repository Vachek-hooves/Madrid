import React, { useEffect } from 'react'
import { StyleSheet, Text, View, Image } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import AppLayout from '../../components/layout/AppLayout'

const WelcomeScreen = () => {
  const navigation = useNavigation()

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('TabNavigator')
    }, 1500)

    return () => clearTimeout(timer)
  }, [navigation])

  return (
    <AppLayout>
      <View style={styles.container}>
        <Image
          // source={require('../../assets/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>Welcome to Our App</Text>
        <Text style={styles.subtitle}>Get ready for an adventure!</Text>
        <Text style={styles.subtitle}>Travel Guide Grand Madrid</Text>
      </View>
    </AppLayout>
  )
}

export default WelcomeScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: '#F1BF00',
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#AA151B',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 46,
    color: '#AA151B',
    textAlign: 'center',
  },
})
