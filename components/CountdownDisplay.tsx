// CountdownDisplay.tsx
import React from "react";
import {View, Text, StyleSheet} from "react-native";

interface CountdownDisplayProps {
  timeLeft: number;
}

const CountdownDisplay: React.FC<CountdownDisplayProps> = ({timeLeft}) => {
  const minutes = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const seconds = String(timeLeft % 60).padStart(2, "0");

  return (
    <View style={styles.container}>
      <Text style={styles.timeText}>{`${minutes}:${seconds}`}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
  },
  timeText: {
    fontSize: 48,
    fontWeight: "bold",
  },
});

export default CountdownDisplay;
