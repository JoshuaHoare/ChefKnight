import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  colors: {
    brand: {
      50: '#f5f9ff',
      100: '#e6f0ff',
      200: '#cce0ff',
      300: '#99c1ff',
      400: '#66a3ff',
      500: '#3385ff',
      600: '#0066ff',
      700: '#0052cc',
      800: '#003d99',
      900: '#002966',
    },
  },
  fonts: {
    heading: '"Merriweather", serif',
    body: '"Open Sans", sans-serif',
  },
  styles: {
    global: {
      body: {
        bg: 'gray.50',
        color: 'gray.800',
      },
    },
  },
});

export default theme;
