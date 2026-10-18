import type { ColorValue } from 'react-native';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

// SF Symbols-style glyphs drawn once, used everywhere in one weight.
const GLYPHS = {
  home: <Path d="M4 10.5 12 4l8 6.5V19a1.5 1.5 0 0 1-1.5 1.5H15v-6H9v6H5.5A1.5 1.5 0 0 1 4 19v-8.5Z" />,
  medal: (
    <>
      <Circle cx="12" cy="14.5" r="6" />
      <Path d="M8.5 9.6 6 3.5h4l2 4.2 2-4.2h4l-2.5 6.1" />
    </>
  ),
  podium: <Path d="M3.5 20.5h17M5 20.5v-6h4.5v6M9.5 20.5V9h5v11.5M14.5 20.5v-8H19v8" />,
  person: (
    <>
      <Circle cx="12" cy="8.5" r="4" />
      <Path d="M4.5 20.5c1-3.6 3.9-5.5 7.5-5.5s6.5 1.9 7.5 5.5" />
    </>
  ),
  plussq: (
    <>
      <Rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <Path d="M12 8v8M8 12h8" />
    </>
  ),
  plus: <Path d="M12 5v14M5 12h14" />,
  back: <Path d="m15 5-7 7 7 7" />,
  chevr: <Path d="m9 5 7 7-7 7" />,
  chevd: <Path d="m6 9 6 6 6-6" />,
  close: <Path d="M6 6l12 12M18 6 6 18" />,
  star: <Path d="m12 3.6 2.6 5.3 5.8.8-4.2 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.2-4.1 5.8-.8z" />,
  heart: <Path d="M12 20s-7.5-4.4-7.5-10A4.3 4.3 0 0 1 12 7.3 4.3 4.3 0 0 1 19.5 10c0 5.6-7.5 10-7.5 10Z" />,
  bubble: <Path d="M20 11.5a8 8 0 0 1-11.6 7.1L4 20l1.4-4.2A8 8 0 1 1 20 11.5Z" />,
  send: <Path d="M21 3.5 10.5 13.5M21 3.5l-6.5 17-4-7-7-4z" />,
  dots: <Path d="M6 12h.01M12 12h.01M18 12h.01" strokeWidth={2.6} />,
  menu: <Path d="M4 7h16M4 12h16M4 17h16" />,
  lock: (
    <>
      <Rect x="5" y="10.5" width="14" height="10" rx="2.5" />
      <Path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" />
    </>
  ),
  check: <Path d="m5 12.5 4.5 4.5L19 7.5" />,
  cam: (
    <>
      <Path d="M3 8.5A2.5 2.5 0 0 1 5.5 6h2l1.6-2.2h5.8L16.5 6h2A2.5 2.5 0 0 1 21 8.5v9A2.5 2.5 0 0 1 18.5 20h-13A2.5 2.5 0 0 1 3 17.5v-9Z" />
      <Circle cx="12" cy="12.8" r="3.8" />
    </>
  ),
  photo: (
    <>
      <Rect x="3.5" y="4.5" width="17" height="15" rx="3" />
      <Path d="m3.5 16 5-5 4 4 2.5-2.5 5.5 5.5" />
    </>
  ),
  search: (
    <>
      <Circle cx="11" cy="11" r="6.5" />
      <Path d="m16 16 4.5 4.5" />
    </>
  ),
  addp: (
    <>
      <Circle cx="10" cy="8.5" r="4" />
      <Path d="M3 20.5c.9-3.4 3.6-5.5 7-5.5 1.4 0 2.7.3 3.8 1M18.5 13v7M15 16.5h7" />
    </>
  ),
  gear: (
    <>
      <Circle cx="12" cy="12" r="3.2" />
      <Path d="M12 3v2.2M12 18.8V21M3 12h2.2M18.8 12H21M5.6 5.6l1.6 1.6M16.8 16.8l1.6 1.6M5.6 18.4l1.6-1.6M16.8 7.2l1.6-1.6" />
    </>
  ),
} as const;

export type IconName = keyof typeof GLYPHS;

export function Icon({ name, size = 24, color, fill, strokeWidth = 1.8 }: { name: IconName; size?: number; color: ColorValue; fill?: ColorValue; strokeWidth?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={fill ?? 'none'} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      {GLYPHS[name]}
    </Svg>
  );
}
