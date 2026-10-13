import { Platform, useColorScheme } from 'react-native';

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

export const serif = Platform.select({ ios: 'Georgia', android: 'serif', default: 'Georgia, "Times New Roman", serif' });
export const sans = Platform.select({ web: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif', default: undefined });
