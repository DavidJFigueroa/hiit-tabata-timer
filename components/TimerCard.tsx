// TimerCard.tsx
import React from "react";
import {View, Text, StyleSheet, TouchableOpacity} from "react-native";
import Fontisto from "@expo/vector-icons/Fontisto";
import {useTheme} from "../contexts/ThemeContext";
import WarmupIcon from "../components/icons/WarmupIcon";
import HighIntensityIcon from "../components/icons/HighIntensityIcon";
import LowIntensityIcon from "../components/icons/LowIntensityIcon";
import CoolDownIcon from "../components/icons/CoolDownIcon";
import CyclesIcon from "../components/icons/CyclesIcon";
import SetsIcon from "../components/icons/SetsIcon";
import SettingsIcon from "../components/icons/SettingsIcon";
import TimerIcon from "../components/icons/TimerIcon";

// Define the type for the timer object
interface Timer {
  id: string;
  title: string;
  warmup: {minutes: number; seconds: number};
  highIntensity: {minutes: number; seconds: number};
  lowIntensity: {minutes: number; seconds: number};
  cooldown: {minutes: number; seconds: number};
  cycles: number;
  sets: number;
}

interface TimerCardProps {
  timer: Timer;
  onPlay: (timer: Timer) => void;
  onSettings: () => void;
}

const TimerCard: React.FC<TimerCardProps> = ({timer, onPlay, onSettings}) => {
  const {theme} = useTheme();

  const warmupTime =
    Number(timer.warmup.minutes) * 60 + Number(timer.warmup.seconds);

  const highIntensityTime =
    Number(timer.highIntensity.minutes) * 60 +
    Number(timer.highIntensity.seconds);

  const lowIntensityTime =
    Number(timer.lowIntensity.minutes) * 60 +
    Number(timer.lowIntensity.seconds);

  const cooldownTime =
    Number(timer.cooldown.minutes) * 60 + Number(timer.cooldown.seconds);

  // Calculate total time for one cycle (high + low intensity)
  const oneCycleTime = highIntensityTime + lowIntensityTime;

  // Calculate total time for all sets and cycles
  const cyclesTimeForAllSets =
    oneCycleTime * Number(timer.cycles) * Number(timer.sets);

  // Total workout time (warmup + (cycles * sets * one cycle) + cooldown)
  const totalDurationInSeconds =
    warmupTime + cyclesTimeForAllSets + cooldownTime;

  // Convert total seconds into minutes and seconds
  const totalMinutes = Math.floor(totalDurationInSeconds / 60);
  const totalSeconds = totalDurationInSeconds % 60;

  const styles = StyleSheet.create({
    card: {
      width: "99%",
      padding: 16,
      paddingTop: 2,
      borderRadius: 8,
      marginBottom: 16,
      borderWidth: 1, // Set the border width
      borderColor: theme.colors.cardBorder,
      elevation: 2,
    },
    cardTitle: {
      fontSize: 18,
      fontWeight: "bold",
      marginBottom: 8,
    },
    headerContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    titleContainer: {
      display: "flex",
      flexDirection: "row",
      gap: 10,
    },
    buttonContainer: {
      display: "flex",
      flexDirection: "row",
      gap: 5,
    },
    row: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 4,
      gap: 10,
    },
    infoContainer: {
      display: "flex",
      flexDirection: "row",
    },
    innerInfoContainer: {
      display: "flex",
      flexDirection: "column",
    },
    totalContainer: {
      flex: 1,
      justifyContent: "flex-end",
      alignItems: "flex-end",
    },
    totalText: {
      display: "flex",
      justifyContent: "flex-end",
    },
    totalTime: {
      fontSize: 18,
      fontWeight: "bold",
    },
    playButton: {
      padding: 10,
    },
    settingsButton: {
      padding: 10,
    },
  });

  return (
    <View style={[styles.card, {backgroundColor: theme.colors.cardBackground}]}>
      <View style={styles.headerContainer}>
        <View style={styles.titleContainer}>
          <TimerIcon width={24} height={24} color={theme.colors.text} />
          <Text style={[styles.cardTitle, {color: theme.colors.text}]}>
            {timer.title}
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.playButton}
            onPress={() => onPlay(timer)}>
            <Fontisto name="play" size={24} color={theme.colors.green} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.settingsButton}
            onPress={onSettings}
            hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
            <SettingsIcon width={30} height={30} color={theme.colors.button} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.infoContainer}>
        <View style={styles.innerInfoContainer}>
          <View style={styles.row}>
            <WarmupIcon width={20} height={20} color={theme.colors.warmup} />
            <Text style={{color: theme.colors.text}}>
              <Text style={{fontWeight: "bold"}}>Warmup: </Text>
              {timer.warmup.minutes}m {timer.warmup.seconds}s
            </Text>
          </View>
          <View style={styles.row}>
            <HighIntensityIcon
              width={20}
              height={20}
              color={theme.colors.high}
            />
            <Text style={{color: theme.colors.text}}>
              <Text style={{fontWeight: "bold"}}>High Intensity: </Text>
              {timer.highIntensity.minutes}m {timer.highIntensity.seconds}s
            </Text>
          </View>
          <View style={styles.row}>
            <LowIntensityIcon width={20} height={20} color={theme.colors.low} />
            <Text style={{color: theme.colors.text}}>
              <Text style={{fontWeight: "bold"}}>Low Intensity: </Text>
              {timer.lowIntensity.minutes}m {timer.lowIntensity.seconds}s
            </Text>
          </View>
          <View style={styles.row}>
            <CoolDownIcon
              width={20}
              height={20}
              color={theme.colors.cooldown}
            />
            <Text style={{color: theme.colors.text}}>
              <Text style={{fontWeight: "bold"}}>Cooldown: </Text>
              {timer.cooldown.minutes}m {timer.cooldown.seconds}s
            </Text>
          </View>
          <View style={styles.row}>
            <CyclesIcon width={20} height={20} color={theme.colors.cycles} />
            <Text style={{color: theme.colors.text}}>
              <Text style={{fontWeight: "bold"}}>Cycles:</Text> {timer.cycles}
            </Text>
          </View>
          <View style={styles.row}>
            <SetsIcon width={20} height={20} color={theme.colors.sets} />
            <Text style={{color: theme.colors.text}}>
              <Text style={{fontWeight: "bold"}}>Sets:</Text> {timer.sets}
            </Text>
          </View>
        </View>
        <View style={styles.totalContainer}>
          <View style={styles.totalText}>
            <Text style={{color: theme.colors.text}}>
              <Text style={{fontWeight: "bold"}}>TOTAL</Text>
            </Text>
            <Text style={[styles.totalTime, {color: theme.colors.text}]}>
              {totalMinutes}m {totalSeconds}s
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default TimerCard;
