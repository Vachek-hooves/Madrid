import { StyleSheet, Text, View } from 'react-native';
import { useState } from 'react';
import { usePlaybackState } from 'react-native-track-player';
import { toggleBackgroundMusic } from './setupPlayer';
import SoundSystemIcon from '../ui/SoundSystemIcon';

const ControlSystem = () => {
  const [playSound, setPlaySound] = useState(false);
  const playbackState = usePlaybackState();

  const soundToggleControl = async () => {
    await toggleBackgroundMusic();
    setPlaySound((prev) => !prev);
    console.log(playSound);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={soundToggleControl}>
        {playSound ? (
          <SoundSystemIcon isPlay={playSound} />
        ) : (
          <SoundSystemIcon isPlay={playSound} />
        )}
      </TouchableOpacity>
    </View>
  );
};

export default ControlSystem;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    position: 'absolute',
    top: 60,
    right: 80,
  },
});
