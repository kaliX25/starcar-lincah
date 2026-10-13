import { useColorScheme } from 'react-native';

const light = {
  bg: '#FAF8F4', surface: '#FFFFFF', surface2: '#F2EFE9', ink: '#15211D', sub: '#6E7A75', line: '#EBE7DF',
  primary: '#0B8F63', primaryInk: '#FFFFFF', primarySoft: '#E2F3EB', accent: '#E39B2D', accentSoft: '#FBEFD9',
  danger: '#D2473F', dangerSoft: '#FBE6E4', shadow: 'rgba(30,45,38,0.08)', dark: false,
};
const dark = {
  bg: '#0D1210', surface: '#161D1A', surface2: '#1F2824', ink: '#F0F5F2', sub: '#93A39C', line: '#26312C',
  primary: '#2FC48D', primaryInk: '#06231A', primarySoft: '#163A2D', accent: '#F0B050', accentSoft: '#3A2D14',
  danger: '#F0706A', dangerSoft: '#3B1D1B', shadow: 'rgba(0,0,0,0.4)', dark: true,
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
