// PhaseIndicator.tsx
import React from "react";
import {View, Text, StyleSheet} from "react-native";

interface PhaseIndicatorProps {
  currentPhase: number;
}

const PhaseIndicator: React.FC<PhaseIndicatorProps> = ({currentPhase}) => {
  const phaseNames = ["Warmup", "High Intensity", "Low Intensity", "Cooldown"];

  return (
    <View style={styles.container}>
      <Text style={styles.phaseText}>{phaseNames[currentPhase]}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  phaseText: {
    fontSize: 24,
    fontWeight: "bold",
  },
});

export default PhaseIndicator;
