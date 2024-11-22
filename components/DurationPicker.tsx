import React, {useState} from "react";
import {View, Text, TouchableOpacity} from "react-native";
import {Picker} from "@react-native-picker/picker";
import {useTheme} from "../contexts/ThemeContext";

const DurationPicker = ({onConfirm}) => {
  const [selectedMinutes, setSelectedMinutes] = useState(0);
  const [selectedSeconds, setSelectedSeconds] = useState(0);
  const {theme} = useTheme();

  return (
    <View style={{alignItems: "center"}}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          marginVertical: 20,
        }}>
        {/* Minutes Picker */}
        <View style={{alignItems: "center"}}>
          <Text style={{color: theme.colors.text, fontSize: 18}}>Minutes</Text>
          <Picker
            selectedValue={selectedMinutes}
            onValueChange={(itemValue) => setSelectedMinutes(itemValue)}
            style={{
              height: 200,
              width: 100,
              color: theme.colors.text, // Picker text color
              backgroundColor: theme.colors.background, // Picker background color
            }}>
            {Array.from({length: 60}, (_, index) => (
              <Picker.Item
                label={index.toString()}
                value={index}
                key={index}
                color={theme.colors.text}
              />
            ))}
          </Picker>
        </View>

        <Text style={{fontSize: 24, paddingHorizontal: 10}}> </Text>

        {/* Seconds Picker */}
        <View style={{alignItems: "center"}}>
          <Text style={{color: theme.colors.text, fontSize: 18}}>Seconds</Text>
          <Picker
            selectedValue={selectedSeconds}
            onValueChange={(itemValue) => setSelectedSeconds(itemValue)}
            style={{
              height: 200,
              width: 100,
            }}>
            {Array.from({length: 60}, (_, index) => (
              <Picker.Item
                label={index.toString()}
                value={index}
                key={index}
                color={theme.colors.text}
              />
            ))}
          </Picker>
        </View>
      </View>

      {/* Display selected values */}
      <Text
        style={{
          fontSize: 30,
          fontWeight: "bold",
          marginBottom: 10,
          color: theme.colors.text,
        }}>
        {selectedMinutes}m {selectedSeconds}s
      </Text>

      {/* Confirm Button */}
      <TouchableOpacity
        style={{
          backgroundColor: theme.colors.button,
          padding: 10,
          borderRadius: 5,
        }}
        onPress={() =>
          onConfirm({minutes: selectedMinutes, seconds: selectedSeconds})
        }>
        <Text style={{color: theme.colors.text, fontSize: 18}}>Confirm</Text>
      </TouchableOpacity>
    </View>
  );
};

export default DurationPicker;
