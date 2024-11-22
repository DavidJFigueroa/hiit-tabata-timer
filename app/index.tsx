import React, {useState} from "react";
import {View, StyleSheet, Dimensions} from "react-native";
import {TabView, SceneMap, TabBar} from "react-native-tab-view";
import TimerPreview from "../components/TimerPreview";
import AddWorkoutButton from "../components/AddWorkoutButton";
import SettingsScreen from "./SettingsScreen";
import Fontisto from "@expo/vector-icons/Fontisto";
import {useTheme} from "../contexts/ThemeContext";
import {StatusBar} from "expo-status-bar";

const Index: React.FC = () => {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    {key: "list", icon: "list-2"},
    {key: "settings", icon: "player-settings"},
  ]);
  const {theme} = useTheme();

  const ListRoute = () => (
    <View style={styles.listContainer}>
      <StatusBar style="light" />
      <TimerPreview />
      <AddWorkoutButton />
    </View>
  );

  const SettingsRoute = () => (
    <View style={styles.settingsContainer}>
      <StatusBar style="light" />
      <SettingsScreen />
    </View>
  );

  const styles = StyleSheet.create({
    listContainer: {
      flex: 1,
      paddingBottom: 70,
    },
    settingsContainer: {flex: 1},
    tabView: {
      backgroundColor: theme.colors.button,
    },
    tabBar: {
      paddingTop: 10,
    },
    indicator: {
      height: 4,
    },
  });

  // Render the tab bar with dynamic styles
  const renderTabBar = (props: any) => (
    <TabBar
      {...props}
      style={[styles.tabBar, {backgroundColor: theme.colors.cardBackground}]} // Use dynamic background color
      renderIcon={({route}) => {
        const iconName = route.icon;
        return <Fontisto name={iconName} size={20} color={theme.colors.text} />;
      }}
      tabStyle={styles.tab}
      indicatorStyle={[
        styles.indicator,
        {backgroundColor: theme.colors.button},
      ]}
    />
  );

  return (
    <TabView
      navigationState={{index, routes}}
      renderScene={SceneMap({
        list: ListRoute,
        settings: SettingsRoute,
      })}
      onIndexChange={setIndex}
      initialLayout={{width: Dimensions.get("window").width}}
      style={[styles.tabView, {backgroundColor: theme.colors.background}]} // Dynamic TabView background
      renderTabBar={renderTabBar}
    />
  );
};

export default Index;
