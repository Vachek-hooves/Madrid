import { StyleSheet, Text, View, ImageBackground } from 'react-native';
import React from 'react';

const AppLayout = ({ children,blur }) => {
  return (
    <ImageBackground
      source={require('../../assets/image/bg/bgMadrid2.png')}
      style={styles.backgroundImage}
      blurRadius={blur}
    >
      {children}
    </ImageBackground>
  );
};

export default AppLayout;

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
  },
});
