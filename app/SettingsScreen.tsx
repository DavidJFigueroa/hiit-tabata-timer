import React, {useState} from "react";
import {View, Text, Switch, StyleSheet, TouchableOpacity} from "react-native";
import {useTheme} from "../contexts/ThemeContext";
import {useSound} from "../contexts/SoundContext";
import {useNavigation} from "@react-navigation/native";

const SettingsScreen: React.FC = () => {
  const {theme, toggleTheme} = useTheme();
  const {soundEnabled, toggleSound} = useSound();
  const navigation = useNavigation();

  const navigateToSoundPicker = () => {
    navigation.navigate("SoundPicker");
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      justifyContent: "space-between", // Spacing between items
    },
    settingsList: {},
    settingContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginVertical: 12,
    },
    settingLabel: {
      fontSize: 18,
    },
    buttonText: {
      fontSize: 24,
      fontWeight: "bold",
      paddingRight: 10,
    },
    footer: {
      alignItems: "center",
    },
    footerText: {
      fontSize: 12,
      textAlign: "center",
    },
  });

  return (
    <View
      style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <View style={styles.settingsList}>
        <View style={styles.settingContainer}>
          <Text style={[styles.settingLabel, {color: theme.colors.text}]}>
            Dark Theme
          </Text>
          <Switch
            value={theme.dark}
            onValueChange={toggleTheme}
            trackColor={{false: "#767577", true: "#2DB7CC"}}
          />
        </View>
        <View style={styles.settingContainer}>
          <Text style={[styles.settingLabel, {color: theme.colors.text}]}>
            Sound On
          </Text>
          <Switch
            value={soundEnabled}
            onValueChange={toggleSound}
            trackColor={{false: "#767577", true: "#2DB7CC"}}
          />
        </View>

        <View style={styles.settingContainer}>
          <Text style={[styles.settingLabel, {color: theme.colors.text}]}>
            Sound Settings
          </Text>
          <TouchableOpacity onPress={navigateToSoundPicker}>
            <Text style={[styles.buttonText, {color: theme.colors.button}]}>
              Set
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={[styles.footerText, {color: theme.colors.text}]}>
          HIIT Interval Timer
        </Text>
        <Text style={[styles.footerText, {color: theme.colors.text}]}>
          © 2024 David Figueroa
        </Text>
      </View>
    </View>
  );
};

export default SettingsScreen;
