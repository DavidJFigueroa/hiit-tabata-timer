// navigation.d.ts
import {StackNavigationProp} from "@react-navigation/stack";
import {ParamListBase} from "@react-navigation/native";
import {Timer} from "../contexts/TimersContext";

export type RootStackParamList = {
  TimerRunScreen: {timer: Timer};
  TimerConfigurationScreen: {
    timer?: Timer;
    setTimers: React.Dispatch<React.SetStateAction<any[]>>;
  };
};

export type TimerConfigurationScreenProps = {
  navigation: StackNavigationProp<
    RootStackParamList,
    "TimerConfigurationScreen"
  >;
  route: {
    params: {
      timer?: Timer;
      setTimers: React.Dispatch<React.SetStateAction<any[]>>;
    };
  };
};
