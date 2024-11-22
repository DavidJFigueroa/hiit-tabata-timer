import React, {createContext, useContext, useState, useEffect} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const TIMER_STORAGE_KEY = "@timers";

export interface Timer {
  id: string;
  title: string;
  warmup: {minutes: number; seconds: number};
  highIntensity: {minutes: number; seconds: number};
  lowIntensity: {minutes: number; seconds: number};
  cooldown: {minutes: number; seconds: number};
  cycles: number;
  sets: number;
}

interface TimersContextProps {
  timers: Timer[];
  setTimers: React.Dispatch<React.SetStateAction<Timer[]>>;
  saveTimersToStorage: (timers: Timer[]) => void;
}

const TimersContext = createContext<TimersContextProps | undefined>(undefined);

export const TimersProvider: React.FC = ({children}) => {
  const [timers, setTimers] = useState<Timer[]>([]);

  // Function to save timers to AsyncStorage
  const saveTimersToStorage = async (timersToSave: Timer[]) => {
    try {
      await AsyncStorage.setItem(
        TIMER_STORAGE_KEY,
        JSON.stringify(timersToSave)
      );
      setTimers(timersToSave); // Ensure state is updated after save
    } catch (error) {
      console.error("Failed to save timers to storage", error);
    }
  };

  // Load timers from AsyncStorage on initial render
  useEffect(() => {
    const loadTimers = async () => {
      try {
        const savedTimers = await AsyncStorage.getItem(TIMER_STORAGE_KEY);
        if (savedTimers) {
          setTimers(JSON.parse(savedTimers));
        }
      } catch (error) {
        console.error("Failed to load timers from storage", error);
      }
    };

    loadTimers();
  }, []);

  return (
    <TimersContext.Provider value={{timers, setTimers, saveTimersToStorage}}>
      {children}
    </TimersContext.Provider>
  );
};

export const useTimers = () => {
  const context = useContext(TimersContext);
  if (!context) {
    throw new Error("useTimers must be used within a TimersProvider");
  }
  return context;
};
