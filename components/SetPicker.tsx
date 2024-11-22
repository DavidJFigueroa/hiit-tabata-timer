import React from "react";
import {View, Text, StyleSheet} from "react-native";
import {Picker} from "@react-native-picker/picker"; // Import the Picker component
import {useTheme} from "../contexts/ThemeContext"; // Import useTheme

interface SetPickerProps {
  value: number;
  onChange: (value: number) => void;
}

const SetPicker: React.FC<SetPickerProps> = ({value, onChange}) => {
  const {theme} = useTheme(); // Access the theme context

  // Create options for sets
  const setOptions = Array.from({length: 100}, (_, index) => ({
    label: (index + 1).toString(),
    value: index + 1,
  }));

  return (
    <View style={styles.inputContainer}>
      <Text style={[styles.label, {color: theme.colors.text}]}>
        Number of Sets
      </Text>

      <Picker
        selectedValue={value}
        onValueChange={(itemValue) => onChange(itemValue)} // Update the parent component on change
        style={{
          height: 200,
          width: 150,
          color: theme.colors.text, // Picker text color
          backgroundColor: theme.colors.background, // Picker background color
        }}>
        {setOptions.map((option) => (
          <Picker.Item
            key={option.value}
            label={option.label}
            value={option.value}
            color={theme.colors.text} // Item text color
          />
        ))}
      </Picker>
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    marginVertical: 8,
    alignItems: "center",
  },
  label: {
    marginBottom: 16,
    fontSize: 16,
  },
});

export default SetPicker;