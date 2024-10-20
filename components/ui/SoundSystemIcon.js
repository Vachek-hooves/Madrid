import { StyleSheet, View, Image, Dimensions } from 'react-native';


const SoundSystemIcon = ({ isPlay }) => {
  return (
    <View
      style={[
        styles.harpContainer,
        {
        //   backgroundColor: isPlay ? '#F1BF00' : '#AA151B',
          backgroundColor: isPlay ? '#AA151B' : '#F1BF00',
          padding: 10,
          borderRadius: 50,
        },
      ]}
    >
      <Image
        
        source={require('../../assets/icons/soundIcon/flamenco.png')}
        style={[styles.harpImage, { width: 90, height: 90, borderRadius: 45 }]}
        resizeMode="contain"
      />
    </View>
  );
};

export default SoundSystemIcon;

const styles = StyleSheet.create({});
