import { useColorScheme } from 'react-native';

const light = {
  bg: '#F7F3FF', surface: '#FFFFFF', surface2: '#EFE8FD', ink: '#1E1038', sub: '#6F6590', line: '#E6DDF8',
  primary: '#7C3AED', primaryInk: '#FFFFFF', primarySoft: '#EDE5FD', accent: '#D946EF', accentSoft: '#FBE5FC',
  danger: '#D2473F', dangerSoft: '#FBE6E4', shadow: 'rgba(76,29,149,0.10)', dark: false,
};
const dark = {
  bg: '#120A24', surface: '#1C1233', surface2: '#271A45', ink: '#F5F0FF', sub: '#A99CCB', line: '#33264F',
  primary: '#A78BFA', primaryInk: '#1A0B3A', primarySoft: '#2E1F58', accent: '#E879F9', accentSoft: '#3D1B4A',
  danger: '#F0706A', dangerSoft: '#3B1D1B', shadow: 'rgba(0,0,0,0.45)', dark: true,
};

export const useTheme = () => (useColorScheme() === 'dark' ? dark : light);

// Poppins: satu keluarga font per ketebalan (dimuat di App.js).
export const FONT_FILES = {
  Poppins_400Regular: require('@expo-google-fonts/poppins/400Regular/Poppins_400Regular.ttf'),
  Poppins_500Medium: require('@expo-google-fonts/poppins/500Medium/Poppins_500Medium.ttf'),
  Poppins_600SemiBold: require('@expo-google-fonts/poppins/600SemiBold/Poppins_600SemiBold.ttf'),
  Poppins_700Bold: require('@expo-google-fonts/poppins/700Bold/Poppins_700Bold.ttf'),
};
export const pf = (w) => {
  const n = w === 'bold' ? 700 : parseInt(w, 10) || 400;
  return n >= 700 ? 'Poppins_700Bold' : n >= 600 ? 'Poppins_600SemiBold' : n >= 500 ? 'Poppins_500Medium' : 'Poppins_400Regular';
};
export const sans = 'Poppins_400Regular';
