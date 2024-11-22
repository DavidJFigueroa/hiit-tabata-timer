import React, {useEffect, useState} from "react";
import {View, Text, StyleSheet, TouchableOpacity} from "react-native";
import {RouteProp, useRoute} from "@react-navigation/native";
import {useTheme} from "../contexts/ThemeContext";
import Entypo from "@expo/vector-icons/Entypo";
import WarmupIcon from "../components/icons/WarmupIcon";
import HighIntensityIcon from "../components/icons/HighIntensityIcon";
import LowIntensityIcon from "../components/icons/LowIntensityIcon";
import CoolDownIcon from "../components/icons/CoolDownIcon";
import TimerIcon from "../components/icons/TimerIcon";
import {useRouter} from "expo-router";
import {StatusBar} from "expo-status-bar";
import {useSound} from "../contexts/SoundContext";

interface Timer {
  title: string;
  warmup: {minutes: number; seconds: number};
  highIntensity: {minutes: number; seconds: number};
  lowIntensity: {minutes: number; seconds: number};
  cooldown: {minutes: number; seconds: number};
  cycles: number;
  sets: number;
}

const TimerRunScreen: React.FC = () => {
  const route = useRoute<RouteProp<{params: {timer: Timer}}, "params">>();
  const {timer} = route.params;
  const {theme} = useTheme();
  const router = useRouter();
  const {playSound, selectedSounds, soundEnabled, toggleSound} = useSound();

  // Convert times to seconds for easier calculations
  const warmupTime = timer.warmup.minutes * 60 + timer.warmup.seconds;
  const highIntensityTime =
    timer.highIntensity.minutes * 60 + timer.highIntensity.seconds;
  const lowIntensityTime =
    timer.lowIntensity.minutes * 60 + timer.lowIntensity.seconds;
  const cooldownTime = timer.cooldown.minutes * 60 + timer.cooldown.seconds;

  const totalPhases = [
    {name: "Warmup", duration: warmupTime},
    {name: "High Intensity", duration: highIntensityTime},
    {name: "Low Intensity", duration: lowIntensityTime},
    {name: "Cooldown", duration: cooldownTime},
  ];

  const phaseColors = [
    theme.colors.warmup,
    theme.colors.high,
    theme.colors.low,
    theme.colors.cooldown,
  ];

  const [currentSet, setCurrentSet] = useState(1); // Track current set
  const [currentCycle, setCurrentCycle] = useState(1);
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [remainingTime, setRemainingTime] = useState(totalPhases[0].duration);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let timerId: NodeJS.Timeout | null = null;

    if (isRunning && remainingTime > 0) {
      timerId = setInterval(() => {
        setRemainingTime((prev) => prev - 1);
      }, 1000);
    } else if (remainingTime === 0) {
      // Move to the next phase or cycle/set
      if (currentPhaseIndex === 0) {
        // After warmup, start the first high intensity
        console.log(selectedSounds);
        setCurrentPhaseIndex(1);
        setRemainingTime(highIntensityTime);
        playSound(selectedSounds["High Intensity"]);
      } else if (currentPhaseIndex === 1) {
        // After high intensity, switch to low intensity
        setCurrentPhaseIndex(2);
        setRemainingTime(lowIntensityTime);
        setRemainingTime(highIntensityTime);
        playSound(selectedSounds["Low Intensity"]);
      } else if (currentPhaseIndex === 2) {
        // After low intensity, check for more cycles or go to cooldown
        if (currentCycle < timer.cycles) {
          setCurrentPhaseIndex(1); // Start next cycle with high intensity
          setRemainingTime(highIntensityTime);
          setCurrentCycle((prev) => prev + 1); // Increment cycle count
          playSound(selectedSounds["High Intensity"]);
        } else if (currentSet < timer.sets) {
          // If all cycles are done, check for more sets
          setCurrentSet((prev) => prev + 1); // Increment set count
          setCurrentCycle(1); // Reset cycle count
          setCurrentPhaseIndex(0); // Go back to warmup
          setRemainingTime(warmupTime); // Reset to warmup duration
          playSound(selectedSounds["Warmup"]);
        } else {
          // If all sets and cycles are finished, go to cooldown
          setCurrentPhaseIndex(3); // Go to cooldown after all sets and cycles
          setRemainingTime(cooldownTime);
          playSound(selectedSounds["Cooldown"]);
        }
      } else if (currentPhaseIndex === 3) {
        // Reset when finished
        setIsRunning(false);
        alert("Timer finished!");
      }
    }

    // Play sound logic for last 3 seconds and last 10 seconds
    if (remainingTime === 3) {
      playSound(selectedSounds["Last 3 Seconds"]);
    }
    if (remainingTime === 10 && currentPhaseIndex === 1) {
      playSound(selectedSounds["Last 10 Seconds"]);
    }

    return () => {
      if (timerId) {
        clearInterval(timerId);
      }
    };
  }, [isRunning, remainingTime, currentPhaseIndex, currentCycle, currentSet]);

  const startTimer = () => {
    setIsRunning(true);
    setRemainingTime(totalPhases[currentPhaseIndex].duration); // Start with current phase duration
    playSound(selectedSounds[totalPhases[currentPhaseIndex].name]); // Play sound for current phase
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setCurrentSet(1);
    setCurrentCycle(1);
    setCurrentPhaseIndex(0);
    setRemainingTime(totalPhases[0].duration);
  };

  const skipBack = () => {
    if (currentPhaseIndex > 0) {
      const newPhaseIndex = currentPhaseIndex - 1;
      setCurrentPhaseIndex(newPhaseIndex);
      setRemainingTime(totalPhases[newPhaseIndex].duration);
      if (isRunning) {
        playSound(selectedSounds[totalPhases[newPhaseIndex].name]); // Play sound only if the timer is running
      }
    } else if (currentPhaseIndex === 0) {
      // If at the start, reset to warmup time
      setRemainingTime(warmupTime);
    }
  };

  const skipForward = () => {
    if (currentPhaseIndex < totalPhases.length - 1) {
      const newPhaseIndex = currentPhaseIndex + 1;
      setCurrentPhaseIndex(newPhaseIndex);
      setRemainingTime(totalPhases[newPhaseIndex].duration);
      if (isRunning) {
        playSound(selectedSounds[totalPhases[newPhaseIndex].name]); // Play sound only if the timer is running
      }
    }
  };

  const formatTime = (timeInSeconds: number) => {
    const minutes = String(Math.floor(timeInSeconds / 60)).padStart(2, "0");
    const seconds = String(timeInSeconds % 60).padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  const getPhaseIcon = () => {
    switch (totalPhases[currentPhaseIndex].name) {
      case "Warmup":
        return (
          <WarmupIcon width={192} height={192} color={theme.colors.text} />
        );
      case "High Intensity":
        return (
          <HighIntensityIcon
            width={192}
            height={192}
            color={theme.colors.text}
          />
        );
      case "Low Intensity":
        return (
          <LowIntensityIcon
            width={192}
            height={192}
            color={theme.colors.text}
          />
        );
      case "Cooldown":
        return (
          <CoolDownIcon width={192} height={192} color={theme.colors.text} />
        );
      default:
        return null;
    }
  };

  const navigateBack = () => {
    router.navigate("/");
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: phaseColors[currentPhaseIndex],
      maxHeight: "100%",
    },
    headerContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 20,
      paddingTop: 30,
      paddingBottom: 0,
      width: "100%",
    },

    titleContainer: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
    },
    title: {
      fontSize: 18,
      fontWeight: "bold",
    },
    middleContainer: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    phase: {
      fontSize: 40,
      marginTop: 10,
    },
    countdown: {fontSize: 124, marginBottom: 10},
    allCycles: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      gap: 30,
    },
    cycles: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      gap: 10,
    },

    cycle: {
      fontSize: 20,
    },
    buttonContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      width: "100%",
      padding: 20,
    },
  });

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.headerContainer}>
        {/* Back Button */}
        <TouchableOpacity onPress={navigateBack}>
          <Entypo name="arrow-bold-left" size={36} color={theme.colors.text} />
        </TouchableOpacity>

        {/* Title Container */}
        <View style={styles.titleContainer}>
          <TimerIcon width={24} height={24} color={theme.colors.text} />
          <Text style={[styles.title, {color: theme.colors.text}]}>
            {timer.title}
          </Text>
        </View>

        {/* Sound Toggle Button */}
        <TouchableOpacity onPress={toggleSound}>
          <Entypo
            name={soundEnabled ? "sound" : "sound-mute"}
            size={36}
            color={theme.colors.text}
            style={{transform: [{rotate: "45deg"}]}}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.middleContainer}>
        {getPhaseIcon()}
        <Text style={[styles.phase, {color: theme.colors.text}]}>
          {totalPhases[currentPhaseIndex].name}
        </Text>
        <Text style={[styles.countdown, {color: theme.colors.text}]}>
          {formatTime(remainingTime)}
        </Text>
        <View style={styles.allCycles}>
          <View style={styles.cycles}>
            <Text style={[styles.cycle, {color: theme.colors.text}]}>
              Cycle{" "}
            </Text>
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 36,
                color: theme.colors.text,
              }}>
              {currentCycle} / {timer.cycles}
            </Text>
          </View>
          <View style={styles.cycles}>
            <Text style={[styles.cycle, {color: theme.colors.text}]}>Set</Text>
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 36,
                color: theme.colors.text,
              }}>
              {currentSet} / {timer.sets}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={skipBack}>
          <Entypo
            name="controller-jump-to-start"
            size={60}
            color={theme.colors.text}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={isRunning ? pauseTimer : startTimer}>
          <Entypo
            name={isRunning ? "controller-paus" : "controller-play"}
            size={60}
            color={theme.colors.text}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={resetTimer}>
          <Entypo name="back-in-time" size={60} color={theme.colors.text} />
        </TouchableOpacity>
        <TouchableOpacity onPress={skipForward}>
          <Entypo name="controller-next" size={60} color={theme.colors.text} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default TimerRunScreen;
