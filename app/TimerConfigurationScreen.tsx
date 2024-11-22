import React, {useState, useEffect} from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Modal,
} from "react-native";
import DurationPicker from "../components/DurationPicker";
import CyclePicker from "../components/CyclePicker";
import SetPicker from "../components/SetPicker";
import {TimerConfigurationScreenProps} from "../navigation";
import {useTimers, Timer} from "../contexts/TimersContext";
import {useRouter} from "expo-router";
import {useRoute, RouteProp} from "@react-navigation/native";
import {useTheme} from "../contexts/ThemeContext";
import WarmupIcon from "../components/icons/WarmupIcon";
import HighIntensityIcon from "../components/icons/HighIntensityIcon";
import LowIntensityIcon from "../components/icons/LowIntensityIcon";
import CoolDownIcon from "../components/icons/CoolDownIcon";
import CyclesIcon from "../components/icons/CyclesIcon";
import SetsIcon from "../components/icons/SetsIcon";
import TimerIcon from "../components/icons/TimerIcon";

type RootStackParamList = {
  TimerConfigurationScreen: {
    timer?: Timer;
  };
};

type TimerConfigurationScreenRouteProp = RouteProp<
  RootStackParamList,
  "TimerConfigurationScreen"
>;

const TimerConfigurationScreen: React.FC<TimerConfigurationScreenProps> = ({
  navigation,
}) => {
  const {timers, setTimers, saveTimersToStorage} = useTimers();
  const router = useRouter();
  const route = useRoute<TimerConfigurationScreenRouteProp>();
  const {theme} = useTheme();

  const [timerName, setTimerName] = useState("");
  const [warmup, setWarmup] = useState({minutes: 0, seconds: 0});
  const [highIntensity, setHighIntensity] = useState({minutes: 0, seconds: 0});
  const [lowIntensity, setLowIntensity] = useState({minutes: 0, seconds: 0});
  const [cooldown, setCooldown] = useState({minutes: 0, seconds: 0});
  const [cycles, setCycles] = useState(1);
  const [sets, setSets] = useState(1);

  const [isPickerVisible, setPickerVisible] = useState(false);
  const [currentPicker, setCurrentPicker] = useState("");
  const [isCyclePickerVisible, setCyclePickerVisible] = useState(false);
  const [isSetPickerVisible, setSetPickerVisible] = useState(false);
  const [tempCycles, setTempCycles] = useState(cycles);
  const [tempSets, setTempSets] = useState(sets);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: theme.colors.background,
    },

    inputContainer: {
      marginVertical: 8,
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    innerInputContainer: {display: "flex", flexDirection: "row", gap: 10},
    heading: {
      fontSize: 24,
      marginBottom: 16,
    },
    text: {
      color: theme.colors.text,
      fontSize: 20,
    },
    timeText: {
      color: theme.colors.text,
      fontSize: 24,
      fontWeight: "bold",
    },
    timerNameContainer: {
      alignItems: "center",
      marginVertical: 20, // Add margin for better spacing
      gap: 5,
    },
    timerNameInput: {
      width: "80%", // Adjust to fit in the center
      borderWidth: 1,
      borderColor: theme.colors.text,
      color: theme.colors.text,
      padding: 8,
      borderRadius: 4,
      textAlign: "center", // Center the input text
      marginTop: 10,
      fontSize: 24,
      fontWeight: "bold",
    },
    setButton: {
      color: theme.colors.button,
      fontSize: 24,
      fontWeight: "bold",
    },
    saveButtonContainer: {
      alignItems: "center", // Center horizontally
      marginTop: 30, // Add spacing from the bottom elements
    },
    saveButton: {
      color: theme.colors.button,
      fontSize: 24,
      fontWeight: "bold",
      padding: 10,
      textAlign: "center", // Center the button text
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
  });

  useEffect(() => {
    if (route.params?.timer) {
      const {timer} = route.params;
      setTimerName(timer.title);
      setWarmup(timer.warmup);
      setHighIntensity(timer.highIntensity);
      setLowIntensity(timer.lowIntensity);
      setCooldown(timer.cooldown);
      setCycles(timer.cycles);
      setSets(timer.sets);
    }
  }, [route.params?.timer]);

  const handleSave = () => {
    const newTimer = {
      id: route.params?.timer?.id || String(Date.now()), // Use existing ID if editing
      title: timerName,
      warmup,
      highIntensity,
      lowIntensity,
      cooldown,
      cycles,
      sets,
    };

    let updatedTimers: Timer[];
    if (route.params?.timer) {
      updatedTimers = timers.map((t) =>
        t.id === route.params.timer!.id ? newTimer : t
      );
    } else {
      updatedTimers = [...timers, newTimer];
    }
    setTimers(updatedTimers);
    saveTimersToStorage(updatedTimers);

    router.navigate("/");
  };

  const openPicker = (pickerType: string) => {
    setCurrentPicker(pickerType);
    setPickerVisible(true);
  };

  const openCyclePicker = () => {
    setTempCycles(cycles);
    setCyclePickerVisible(true);
  };

  const openSetPicker = () => {
    setTempSets(sets);
    setSetPickerVisible(true);
  };

  const handleConfirmDuration = (duration: {
    minutes: number;
    seconds: number;
  }) => {
    switch (currentPicker) {
      case "warmup":
        setWarmup(duration);
        break;
      case "highIntensity":
        setHighIntensity(duration);
        break;
      case "lowIntensity":
        setLowIntensity(duration);
        break;
      case "cooldown":
        setCooldown(duration);
        break;
      default:
        break;
    }
    setPickerVisible(false);
  };

  const handleConfirmCycles = () => {
    setCycles(tempCycles);
    setCyclePickerVisible(false);
  };

  const handleConfirmSets = () => {
    setSets(tempSets);
    setSetPickerVisible(false);
  };

  const phaseLabels: Record<string, string> = {
    warmup: "Warmup",
    highIntensity: "High Intensity",
    lowIntensity: "Low Intensity",
    cooldown: "Cooldown",
  };

  return (
    <View style={styles.container}>
      <View style={styles.timerNameContainer}>
        <TimerIcon width={60} height={60} color={theme.colors.high} />
        <Text style={[{fontSize: 16}, {color: theme.colors.text}]}>
          Timer Name
        </Text>

        <TextInput
          style={styles.timerNameInput}
          value={timerName}
          selectionColor={theme.colors.high}
          onChangeText={(text) => setTimerName(text)}
        />
      </View>
      <View style={styles.inputContainer}>
        <View style={styles.innerInputContainer}>
          <WarmupIcon width={30} height={30} color={theme.colors.warmup} />
          <Text style={styles.text}>Warmup:</Text>
          <Text style={styles.timeText}>
            {warmup.minutes}m {warmup.seconds}s
          </Text>
        </View>
        <TouchableOpacity onPress={() => openPicker("warmup")}>
          <Text style={styles.setButton}>Set</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.inputContainer}>
        <View style={styles.innerInputContainer}>
          <HighIntensityIcon width={30} height={30} color={theme.colors.high} />
          <Text style={styles.text}>High Intensity:</Text>
          <Text style={styles.timeText}>
            {highIntensity.minutes}m {highIntensity.seconds}s
          </Text>
        </View>
        <TouchableOpacity onPress={() => openPicker("highIntensity")}>
          <Text style={styles.setButton}>Set</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.inputContainer}>
        <View style={styles.innerInputContainer}>
          <LowIntensityIcon width={30} height={30} color={theme.colors.low} />
          <Text style={styles.text}>Low Intensity:</Text>
          <Text style={styles.timeText}>
            {lowIntensity.minutes}m {lowIntensity.seconds}s
          </Text>
        </View>
        <TouchableOpacity onPress={() => openPicker("lowIntensity")}>
          <Text style={styles.setButton}>Set</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.inputContainer}>
        <View style={styles.innerInputContainer}>
          <CoolDownIcon width={30} height={30} color={theme.colors.cooldown} />
          <Text style={styles.text}>Cooldown:</Text>
          <Text style={styles.timeText}>
            {cooldown.minutes}m {cooldown.seconds}s
          </Text>
        </View>
        <TouchableOpacity onPress={() => openPicker("cooldown")}>
          <Text style={styles.setButton}>Set</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.inputContainer}>
        <View style={styles.innerInputContainer}>
          <CyclesIcon width={30} height={30} color={theme.colors.cycles} />
          <Text style={styles.text}>Cycles:</Text>
          <Text style={styles.timeText}>{cycles}</Text>
        </View>
        <TouchableOpacity onPress={openCyclePicker}>
          <Text style={styles.setButton}>Set</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.inputContainer}>
        <View style={styles.innerInputContainer}>
          <SetsIcon width={30} height={30} color={theme.colors.sets} />
          <Text style={styles.text}>Sets:</Text>
          <Text style={styles.timeText}>{sets}</Text>
        </View>
        <TouchableOpacity onPress={openSetPicker}>
          <Text style={styles.setButton}>Set</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.saveButtonContainer}>
        <TouchableOpacity onPress={handleSave}>
          <Text style={styles.saveButton}>
            {route.params?.timer ? "Update Timer" : "Save Timer"}
          </Text>
        </TouchableOpacity>
      </View>

      <Modal visible={isPickerVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.text}>
              {phaseLabels[currentPicker]} Duration
            </Text>
            <DurationPicker onConfirm={handleConfirmDuration} />
            <TouchableOpacity
              style={{
                padding: 10,
                borderRadius: 5,
              }}
              onPress={() => setPickerVisible(false)}>
              <Text style={{color: theme.colors.text, fontSize: 18}}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={isCyclePickerVisible}
        animationType="slide"
        transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.text}>Select Number of Cycles</Text>
            <CyclePicker value={tempCycles} onChange={setTempCycles} />
            <TouchableOpacity
              style={{
                backgroundColor: theme.colors.button,
                padding: 10,
                borderRadius: 5,
              }}
              onPress={handleConfirmCycles}>
              <Text style={{color: theme.colors.text, fontSize: 18}}>
                Confirm
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                padding: 10,
                borderRadius: 5,
              }}
              onPress={() => setCyclePickerVisible(false)}>
              <Text style={{color: theme.colors.text, fontSize: 18}}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal
        visible={isSetPickerVisible}
        animationType="slide"
        transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.text}>Select Number of Sets</Text>
            <SetPicker value={tempSets} onChange={setTempSets} />
            <TouchableOpacity
              style={{
                backgroundColor: theme.colors.button,
                padding: 10,
                borderRadius: 5,
              }}
              onPress={handleConfirmSets}>
              <Text style={{color: theme.colors.text, fontSize: 18}}>
                Confirm
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                padding: 10,
                borderRadius: 5,
              }}
              onPress={() => setSetPickerVisible(false)}>
              <Text style={{color: theme.colors.text, fontSize: 18}}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default TimerConfigurationScreen;
