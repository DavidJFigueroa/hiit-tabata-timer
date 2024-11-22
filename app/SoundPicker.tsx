import React, {useState, useEffect} from "react";
import {
  View,
  Text,
  Button,
  Modal,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import Slider from "@react-native-community/slider";
import {useSound} from "../contexts/SoundContext";
import WarmupIcon from "../components/icons/WarmupIcon";
import HighIntensityIcon from "../components/icons/HighIntensityIcon";
import LowIntensityIcon from "../components/icons/LowIntensityIcon";
import CoolDownIcon from "../components/icons/CoolDownIcon";
import BoxingGlove from "../components/icons/BoxingGlove";
import {Picker} from "@react-native-picker/picker";
import TimerIcon from "../components/icons/TimerIcon";
import {useTheme} from "../contexts/ThemeContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Entypo from "@expo/vector-icons/Entypo";

const SoundPicker = () => {
  const {
    volume,
    setVolume,
    playSound,
    availableSounds,
    setPhaseSounds,
    selectedSounds,
  } = useSound();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPhase, setSelectedPhase] = useState("");
  const {theme} = useTheme();
  const [selectedSound, setSelectedSound] = useState("default");

  const handlePlaySound = async (soundName: string) => {
    await playSound(soundName); // Pass the sound name to the play function
  };

  const VOLUME_KEY = "volume_level";
  const SOUNDS_KEY = "selected_sounds";

  // Function to save the volume to AsyncStorage
  const saveVolume = async (value: number) => {
    try {
      await AsyncStorage.setItem(VOLUME_KEY, JSON.stringify(value));
    } catch (error) {
      console.log("Error saving volume", error);
    }
  };

  // Function to load the volume from AsyncStorage when the component mounts
  const loadVolume = async () => {
    try {
      const storedVolume = await AsyncStorage.getItem(VOLUME_KEY);
      if (storedVolume !== null) {
        setVolume(JSON.parse(storedVolume)); // Set the saved volume value
      }
    } catch (error) {
      console.log("Error loading volume", error);
    }
  };

  const loadSelectedSounds = async () => {
    try {
      const storedSounds = await AsyncStorage.getItem(SOUNDS_KEY);
      if (storedSounds !== null) {
        const sounds = JSON.parse(storedSounds);

        // Iterate through the sounds object and set them one by one
        Object.entries(sounds).forEach(([phase, soundName]) => {
          setPhaseSounds(phase, soundName); // Pass phase and soundName individually
        });
      }
    } catch (error) {
      console.log("Error loading selected sounds", error);
    }
  };

  useEffect(() => {
    loadVolume(); // Load volume on mount
    loadSelectedSounds();
  }, []);

  const phases = [
    {
      name: "Warmup",
      icon: <WarmupIcon width={30} height={30} color={theme.colors.warmup} />,
    },
    {
      name: "High Intensity",
      icon: (
        <HighIntensityIcon width={30} height={30} color={theme.colors.high} />
      ),
    },
    {
      name: "Low Intensity",
      icon: (
        <LowIntensityIcon width={30} height={30} color={theme.colors.low} />
      ),
    },
    {
      name: "Cooldown",
      icon: (
        <CoolDownIcon width={30} height={30} color={theme.colors.cooldown} />
      ),
    },
    {
      name: "Last 3 Seconds",
      icon: <TimerIcon width={30} height={30} color="#d106b9" />,
    },
    {
      name: "Last 10 Seconds",
      icon: <BoxingGlove width={30} height={30} color="#c40000" />,
    },
  ];

  const openModal = (phase: string) => {
    setSelectedPhase(phase);
    setModalVisible(true);
  };

  const handleVolumeChange = (value: number) => {
    setVolume(value);
    saveVolume(value);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "space-between",
      padding: 16,
      backgroundColor: theme.colors.background,
    },
    volumeContainer: {
      marginVertical: 10,
    },
    inputContainer: {
      marginVertical: 8,
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    innerInputContainer: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
    },
    text: {
      marginLeft: 10,
      color: theme.colors.text,
      fontSize: 20,
    },
    setButton: {
      color: theme.colors.button,
      fontSize: 24,
      fontWeight: "bold",
    },
    modalOverlay: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
      backgroundColor: theme.colors.background,
      padding: 40,
      borderRadius: 10,
      width: "80%",
      alignItems: "center",
    },
    soundItemContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      width: "100%",
      marginBottom: 20,
    },
    soundText: {
      color: theme.colors.text,
      fontSize: 20,
    },
    soundIcon: {
      transform: [{rotate: "45deg"}],
    },
    picker: {
      width: "100%",
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.volumeContainer}>
        <Text style={{color: theme.colors.text}}>
          Volume: {Math.round(volume * 100)}%
        </Text>
        <Slider
          value={volume}
          onValueChange={(value) => handleVolumeChange(value)}
          minimumValue={0}
          maximumValue={1}
          step={0.01}
          minimumTrackTintColor={theme.colors.button}
          maximumTrackTintColor={theme.colors.text}
        />
      </View>

      <Text style={{color: theme.colors.text, fontSize: 24}}>
        Select Sounds for Each Phase
      </Text>

      {phases.map((phase) => (
        <View key={phase.name} style={styles.inputContainer}>
          <View style={styles.innerInputContainer}>
            {phase.icon}
            <Text style={styles.text}>{phase.name}:</Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              handlePlaySound(selectedSounds[phase.name] || "default"); // Play the sound for the selected phase
            }}>
            <Text style={{color: theme.colors.button}}>
              {selectedSounds[phase.name] || "Select Sound"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => openModal(phase.name)}>
            <Text style={styles.setButton}>Set</Text>
          </TouchableOpacity>
        </View>
      ))}
      {/* Modal to select sound */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text
              style={{
                color: theme.colors.text,
                fontSize: 18,
                textAlign: "center",
                marginBottom: 5,
              }}>
              Select Sound for
            </Text>
            <Text
              style={{
                color: theme.colors.text,
                fontSize: 24,
                fontWeight: "bold",
                textAlign: "center",
              }}>
              {selectedPhase}
            </Text>

            {/* Wheel Picker for sound selection */}
            {/* Wheel Picker for sound selection */}
            <Picker
              selectedValue={selectedSound}
              onValueChange={(itemValue) => setSelectedSound(itemValue)}
              style={styles.picker}>
              {availableSounds.map((sound) => (
                <Picker.Item
                  key={sound.name}
                  label={sound.name}
                  value={sound.name} // Use sound.name as the value
                  color={theme.colors.text}
                />
              ))}
            </Picker>

            {/* Sound Preview Icon */}
            <View style={styles.soundItemContainer}>
              <Text style={styles.soundText}>Preview Sound</Text>
              <TouchableOpacity onPress={() => handlePlaySound(selectedSound)}>
                <Entypo
                  name="sound"
                  size={36}
                  color={theme.colors.text}
                  style={styles.soundIcon}
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={{
                backgroundColor: theme.colors.button,
                padding: 10,
                borderRadius: 5,
              }}
              onPress={() => {
                if (selectedPhase) {
                  setPhaseSounds(selectedPhase, selectedSound);
                  AsyncStorage.setItem(
                    SOUNDS_KEY,
                    JSON.stringify({
                      ...selectedSounds,
                      [selectedPhase]: selectedSound,
                    })
                  ); // Persist selected sounds
                }
                setSelectedSound("default"); // Reset selected sound
                setModalVisible(false);
              }}>
              <Text style={{color: theme.colors.text, fontSize: 18}}>
                Confirm
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                padding: 10,
                borderRadius: 5,
              }}
              onPress={() => setModalVisible(false)}>
              <Text style={{color: theme.colors.text, fontSize: 18}}>
                Close
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default SoundPicker;
