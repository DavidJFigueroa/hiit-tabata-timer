// TimerControlButtons.tsx
import React from "react";
import {View, Button, StyleSheet} from "react-native";

interface TimerControlButtonsProps {
  onStart: () => void;
  onPause: () => void;
  onStop: () => void;
  isRunning: boolean;
}

const TimerControlButtons: React.FC<TimerControlButtonsProps> = ({
  onStart,
  onPause,
  onStop,
  isRunning,
}) => {
  return (
    <View style={styles.container}>
      {isRunning ? (
        <>
          <Button title="Pause" onPress={onPause} />
          <Button title="Stop" onPress={onStop} />
        </>
      ) : (
        <Button title="Start" onPress={onStart} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },
});

export default TimerControlButtons;
