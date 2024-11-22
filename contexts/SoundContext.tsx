// SoundContext.tsx
import React, {createContext, useState, useEffect, useContext} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {Audio} from "expo-av";

// Define an interface for sound objects
interface Sound {
  name: string;
  uri: any;
}

interface SoundContextProps {
  soundEnabled: boolean;
  toggleSound: () => void;
  volume: number;
  setVolume: (value: number) => void;
  playSound: (soundName: string) => Promise<void>;
  availableSounds: Sound[];
  setPhaseSounds: (phase: string, soundName: string) => void;
  selectedSounds: Record<string, string>;
}

const SoundContext = createContext<SoundContextProps | undefined>(undefined);

export const useSound = () => {
  const context = useContext(SoundContext);
  if (!context) {
    throw new Error("useSound must be used within a SoundProvider");
  }
  return context;
};

export const SoundProvider: React.FC = ({children}) => {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [volume, setVolume] = useState(0.5);
  const [selectedSounds, setSelectedSounds] = useState<Record<string, string>>(
    {}
  );
  const VOLUME_KEY = "volume_level";
  const SOUND_ENABLED_KEY = "sound_enabled";
  const SOUNDS_KEY = "selected_sounds";

  // Define available sounds
  const availableSounds: Sound[] = [
    {name: "Boxing Bell", uri: require("../assets/sounds/BoxingBell.wav")},
    {name: "Church", uri: require("../assets/sounds/Church.wav")},
    {name: "Deep Gong", uri: require("../assets/sounds/DeepGong.wav")},
    {name: "Gong 1", uri: require("../assets/sounds/Gong1.wav")},
    {name: "Gong 2", uri: require("../assets/sounds/Gong2.wav")},
    {
      name: "Last 3 Bell Hit",
      uri: require("../assets/sounds/Last3BellHit.wav"),
    },
    {name: "Last 3 Chant", uri: require("../assets/sounds/Last3Chant.wav")},
    {name: "Last 3 Clave", uri: require("../assets/sounds/Last3Clave.wav")},
    {name: "Last 3 Cowbell", uri: require("../assets/sounds/Last3Cowbell.wav")},
    {name: "Last 3 Dog", uri: require("../assets/sounds/Last3Dog.wav")},
    {name: "Last 3 Wood", uri: require("../assets/sounds/Last3Wood.wav")},
    {name: "Last 3 Whistle", uri: require("../assets/sounds/Last3Whistle.wav")},
    {name: "Last 10 Baile", uri: require("../assets/sounds/Last10Baile.wav")},
    {
      name: "Last 10 Fire Alarm",
      uri: require("../assets/sounds/Last10FireAlarm.wav"),
    },
    {name: "Last 10 Snare", uri: require("../assets/sounds/Last10Snare.wav")},
    {name: "Last 10 Wood 1", uri: require("../assets/sounds/Last10Wood1.wav")},
    {name: "Last 10 Wood 2", uri: require("../assets/sounds/Last10Wood2.wav")},
    {name: "Let's Go", uri: require("../assets/sounds/LetsGo.wav")},
    {name: "Okay", uri: require("../assets/sounds/Okay.wav")},
    {name: "Ring", uri: require("../assets/sounds/Ring.wav")},
    {name: "Siren", uri: require("../assets/sounds/Siren.wav")},
    {name: "Store", uri: require("../assets/sounds/Store.wav")},
    {name: "Undertaker", uri: require("../assets/sounds/Undertaker.wav")},
    {name: "What", uri: require("../assets/sounds/What.wav")},
    {name: "Whistle 1", uri: require("../assets/sounds/Whistle1.wav")},
    {name: "Whistle 2", uri: require("../assets/sounds/Whistle2.wav")},
    {name: "Whistle 3", uri: require("../assets/sounds/Whistle3.wav")},
    {name: "Who", uri: require("../assets/sounds/Who.wav")},
    {name: "Yeah", uri: require("../assets/sounds/Yeah.wav")},
  ];

  const setDefaultSounds = () => {
    const defaultSounds = {
      Warmup: "Ring",
      "High Intensity": "Boxing Bell",
      "Low Intensity": "Deep Gong",
      Cooldown: "Gong 2",
      "Last 3 Seconds": "Last 3 Clave",
      "Last 10 Seconds": "Last 10 Wood 1",
    };
    setSelectedSounds(defaultSounds);
    AsyncStorage.setItem(SOUNDS_KEY, JSON.stringify(defaultSounds));
  };

  // Toggle sound between enabled and disabled
  const toggleSound = async () => {
    setSoundEnabled((prev) => !prev);
    await AsyncStorage.setItem(
      SOUND_ENABLED_KEY,
      JSON.stringify(!soundEnabled)
    );
  };

  // Save volume to AsyncStorage
  const saveVolume = async (value: number) => {
    setVolume(value);
    await AsyncStorage.setItem(VOLUME_KEY, JSON.stringify(value));
  };

  // Load volume and soundEnabled from AsyncStorage
  const loadSettings = async () => {
    try {
      const storedVolume = await AsyncStorage.getItem(VOLUME_KEY);
      if (storedVolume !== null) {
        setVolume(JSON.parse(storedVolume));
      }

      const storedSoundEnabled = await AsyncStorage.getItem(SOUND_ENABLED_KEY);
      if (storedSoundEnabled !== null) {
        setSoundEnabled(JSON.parse(storedSoundEnabled));
      }
    } catch (error) {
      console.log("Error loading settings", error);
    }
  };

  // Load selected sounds from AsyncStorage
  const loadSelectedSounds = async () => {
    try {
      const storedSounds = await AsyncStorage.getItem(SOUNDS_KEY);
      if (storedSounds) {
        const sounds = JSON.parse(storedSounds);
        setSelectedSounds(sounds); // Set sounds in state
      } else {
        console.log("No sounds found in storage. Setting defaults.");
        setDefaultSounds();
      }
    } catch (error) {
      console.log("Error loading sounds from storage:", error);
    }
  };

  useEffect(() => {
    loadSettings(); // Load settings when the app starts
    loadSelectedSounds();
  }, []);

  // Function to play sound with the current volume and soundEnabled state
  const playSound = async (soundName: string) => {
    if (!soundEnabled) return;

    // Find the sound by name
    const soundToPlay = availableSounds.find(
      (sound) => sound.name === soundName
    );
    if (!soundToPlay) {
      console.log("Sound not found:", soundName);
      return;
    }

    try {
      // Enable sound to play even if the device is in silent mode on iOS
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
      });

      // Create and load the sound object
      const {sound: soundObject} = await Audio.Sound.createAsync(
        soundToPlay.uri, // Use the URI from the found sound
        {shouldPlay: true, volume: volume}
      );
    } catch (error) {
      console.log("Error playing sound:", error);
    }
  };

  const setPhaseSounds = (phase: string, soundName: string) => {
    setSelectedSounds((prev) => ({...prev, [phase]: soundName}));
    console.log(`Setting sound for phase: ${phase} to sound: ${soundName}`);
  };

  return (
    <SoundContext.Provider
      value={{
        soundEnabled,
        toggleSound,
        volume,
        setVolume: saveVolume,
        playSound,
        availableSounds,
        setPhaseSounds,
        selectedSounds,
      }}>
      {children}
    </SoundContext.Provider>
  );
};
