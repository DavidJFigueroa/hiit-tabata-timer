import React, {useCallback, useState} from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Modal,
  TouchableOpacity,
} from "react-native";
import TimerCard from "./TimerCard";
import {useTimers, Timer} from "../contexts/TimersContext";
import {useNavigation, useFocusEffect} from "expo-router";
import {useTheme} from "../contexts/ThemeContext";

const TimerPreview: React.FC = () => {
  const {theme} = useTheme();
  const {timers, setTimers, saveTimersToStorage} = useTimers();
  const navigation = useNavigation();
  const [selectedTimer, setSelectedTimer] = useState<Timer | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Ensure component re-renders when the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      // The timers context will naturally trigger a re-render
      // when timers are updated. No need for extra logic here.
    }, [timers])
  );

  const handlePlay = (timer: Timer) => {
    navigation.navigate("TimerRunScreen", {timer});
  };

  const handleSettingsPress = (timer: Timer) => {
    setSelectedTimer(timer);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedTimer(null);
  };

  const handleEdit = () => {
    if (selectedTimer) {
      // Navigate to edit screen or show edit form
      navigation.navigate("TimerConfigurationScreen", {timer: selectedTimer});
    }
    handleCloseModal();
  };

  const handleDuplicate = () => {
    if (selectedTimer) {
      const newTimer: Timer = {
        ...selectedTimer,
        id: Date.now().toString(), // Generate a new ID
        title: `${selectedTimer.title} 2`, // Append " 2" to the title
      };
      setTimers([...timers, newTimer]);
      saveTimersToStorage([...timers, newTimer]); // Save updated timers to AsyncStorage
    }
    handleCloseModal();
  };

  const handleDelete = async () => {
    if (selectedTimer) {
      const updatedTimers = timers.filter((t) => t.id !== selectedTimer.id);

      // Update both the state and AsyncStorage
      setTimers(updatedTimers);
      await saveTimersToStorage(updatedTimers);
    }
    handleCloseModal();
  };

  useFocusEffect(React.useCallback(() => {}, [timers]));

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
    },
    heading: {
      fontSize: 16,
      marginBottom: 16,
    },
    modalContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
      width: 300,
      backgroundColor: theme.colors.background,
      padding: 40,
      borderRadius: 10,
      alignItems: "center",
    },
    modalButton: {
      width: "100%",
      padding: 15,
      backgroundColor: theme.colors.button,
      borderRadius: 5,
      marginBottom: 10,
    },
    modalButtonText: {
      color: theme.colors.text,
      textAlign: "center",
      fontWeight: "bold",
      textTransform: "uppercase",
    },
  });

  return (
    <View
      style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <FlatList
        data={timers}
        keyExtractor={(item) => item.id}
        renderItem={({item}) => (
          <TimerCard
            timer={item}
            onPlay={handlePlay}
            onSettings={() => handleSettingsPress(item)}
          />
        )}
        ListEmptyComponent={<Text>No timers saved yet.</Text>}
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleCloseModal}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.modalButton} onPress={handleEdit}>
              <Text style={styles.modalButtonText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={handleDuplicate}>
              <Text style={styles.modalButtonText}>Duplicate</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalButton} onPress={handleDelete}>
              <Text style={styles.modalButtonText}>Delete</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={handleCloseModal}>
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default TimerPreview;
