import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {darkTheme, lightTheme} from "../theme/Themes";

// Define the type for your context
interface ThemeContextType {
  theme: typeof darkTheme; // Adjust according to your theme type
  toggleTheme: () => void;
}

// Create the context with default values
const ThemeContext = createContext<ThemeContextType>({
  theme: lightTheme, // Default to lightTheme
  toggleTheme: () => {},
});

// Custom hook for using the ThemeContext
export const useTheme = () => useContext(ThemeContext);

// Define the props for the ThemeProvider
interface ThemeProviderProps {
  children: ReactNode; // Define children as ReactNode
}

// AsyncStorage key
const THEME_KEY = "app_theme";

// ThemeProvider component
export const ThemeProvider: React.FC<ThemeProviderProps> = ({children}) => {
  const [theme, setTheme] = useState(lightTheme); // Default to lightTheme

  useEffect(() => {
    // Load saved theme on initial render
    const loadTheme = async () => {
      const savedTheme = await AsyncStorage.getItem(THEME_KEY);
      if (savedTheme === "dark") {
        setTheme(darkTheme);
      } else {
        setTheme(lightTheme);
      }
    };

    loadTheme();
  }, []);

  const toggleTheme = async () => {
    const newTheme = theme.dark ? lightTheme : darkTheme;
    setTheme(newTheme);
    await AsyncStorage.setItem(THEME_KEY, newTheme.dark ? "dark" : "light");
  };

  return (
    <ThemeContext.Provider value={{theme, toggleTheme}}>
      {children}
    </ThemeContext.Provider>
  );
};
