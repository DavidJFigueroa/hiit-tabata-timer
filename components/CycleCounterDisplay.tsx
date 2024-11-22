// CycleCounterDisplay.tsx
import React from "react";
import {View, Text, StyleSheet} from "react-native";

interface CycleCounterDisplayProps {
  currentCycle: number;
  totalCycles: number;
}

const CycleCounterDisplay: React.FC<CycleCounterDisplayProps> = ({
  currentCycle,
  totalCycles,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.counterText}>
        Cycle {currentCycle} of {totalCycles}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  counterText: {
    fontSize: 18,
  },
});

export default CycleCounterDisplay;
