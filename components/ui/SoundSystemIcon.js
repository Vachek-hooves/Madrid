import { StyleSheet, View, Image, Dimensions } from 'react-native';


const SoundSystemIcon = ({ isActive }) => {
  return (
    <View
      style={[
        styles.harpContainer,
        {
          backgroundColor: isPlay ? '#FF1493' : '#00FFFF',
          padding: 10,
          borderRadius: 50,
        },
      ]}
    >
      <Image
        
        source={require('../../assets/icons/soundIcon/flamenco.png')}
        style={[styles.harpImage, { width: 60, height: 60, borderRadius: 30 }]}
        resizeMode="contain"
      />
    </View>
  );
};

export default SoundSystemIcon;

const styles = StyleSheet.create({});
