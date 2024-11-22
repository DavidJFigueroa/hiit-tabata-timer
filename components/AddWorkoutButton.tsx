import React from "react";
import {TouchableOpacity, Text, StyleSheet} from "react-native";
import {useNavigation} from "@react-navigation/native";
import {useTheme} from "../contexts/ThemeContext"; // Import useTheme

const AddWorkoutButton: React.FC = () => {
  const navigation = useNavigation();
  const {theme} = useTheme(); // Access the theme

  const handlePress = () => {
    navigation.navigate("TimerConfigurationScreen");
  };

  return (
    <TouchableOpacity
      style={[styles.button, {backgroundColor: theme.colors.button}]}
      onPress={handlePress}>
      <Text style={[styles.buttonText, {color: theme.colors.text}]}>+</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 50,
    width: 60,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: 10,
    left: "50%",
    transform: [{translateX: -30}],
    elevation: 5,
  },
  buttonText: {
    fontSize: 32,
  },
});

export default AddWorkoutButton;
