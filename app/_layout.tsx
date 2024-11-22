import {Stack} from "expo-router";
import {TimersProvider} from "../contexts/TimersContext";
import {ThemeProvider, useTheme} from "../contexts/ThemeContext";
import {SoundProvider} from "../contexts/SoundContext";
import {StatusBar} from "expo-status-bar";

export default function RootLayout() {
  const {theme} = useTheme();

  return (
    <ThemeProvider>
      <SoundProvider>
        <TimersProvider>
          <StatusBar style="light" />
          <Stack>
            <Stack.Screen
              name="index"
              options={{
                title: "",
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="TimerConfigurationScreen"
              options={{
                title: "Timer Configuration",
                headerStyle: {
                  backgroundColor: theme.colors.background,
                },
                headerTintColor: theme.colors.text,
              }}
            />
            <Stack.Screen
              name="SoundPicker"
              options={{
                title: "Sound Settings",
                headerStyle: {
                  backgroundColor: theme.colors.background,
                },
                headerTintColor: theme.colors.text,
              }}
            />
            <Stack.Screen
              name="TimerRunScreen"
              options={{
                headerShown: false,
              }}
            />
          </Stack>
        </TimersProvider>
      </SoundProvider>
    </ThemeProvider>
  );
}
