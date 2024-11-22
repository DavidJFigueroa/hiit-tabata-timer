import * as React from "react";
import Svg, {Path} from "react-native-svg";
const SettingsIcon = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={64}
    height={64}
    viewBox="0 0 512 512"
    {...props}>
    <Path
      fill="currentColor"
      d="M170.375 18.594c-1.155 0-2.32.014-3.47.03-25.176.37-49.134 5.08-68.78 13.94 84.13 7.937 156.965 61.77 119.28 122.53-2.017 3.254-4.033 6.445-6.03 9.625l.47.186c-.933 2.4-.566 5.203 2.343 9.53 2.908 4.33 8.322 9.22 14.75 12.97 6.427 3.752 13.838 6.392 20.28 7.22 5.992.768 10.808-.054 14-1.94 1.7-2.696 3.416-5.415 5.157-8.155 21.695-8.632 57.903 11.51 65.22 29.22 1.34-14.225 6.522-29.91 15.342-45.188 6.697-11.598 14.627-21.517 23.157-29.25-20.304 7.277-30.037-6.764-38.563-34.187-8.197-26.38-36.394-47.365-58.155-59.844-31.287-17.92-69.206-26.65-105-26.686zm239.03 121.937c-4.01-.034-9.278 1.558-15.592 5.564-9.622 6.103-20.325 17.327-28.688 31.812-8.363 14.486-12.713 29.366-13.188 40.75-.474 11.385 2.692 17.85 6.688 20.156 3.996 2.307 11.222 1.823 20.844-4.28 9.62-6.104 20.323-17.297 28.686-31.782s12.713-29.365 13.188-40.75c.474-11.385-2.693-17.88-6.688-20.188-.998-.576-2.206-.973-3.594-1.156-.52-.068-1.083-.12-1.656-.125zm-210.81 44.282C80.93 367.197 4.35 418.813 21.937 462.875c8.065 20.204 31.467 36.36 55.218 28.78 49.34-15.74 59.974-94.006 173.094-278.124a55.302 55.302 0 0 1-3.406-.343c-9.516-1.22-18.924-4.76-27.313-9.656-8.387-4.895-15.804-11.11-20.874-18.655-.016-.024-.046-.04-.062-.063zM492 256.97l-110.438 22.436 51.313 15.53 31.47 148.94 18.31-3.845-31.467-148.81L492 256.97zm-200.125 15.874-80 79.375 51.438-15.19 68.093 67.564L308.28 489.5l18.064 4.906 20.312-74.656 24.72 24.5L384.53 431l-32.217-31.97 14-51.5 52.125-12.56-108.97-28.75 38.75 36.56-11.187 41.095-60.467-60 15.312-51.03z"
    />
  </Svg>
);
export default SettingsIcon;
