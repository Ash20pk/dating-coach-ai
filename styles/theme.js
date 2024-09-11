import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  styles: {
    global: (props) => ({
      body: {
        bg: props.colorMode === 'dark' ? 'gray.900' : 'purple.50',
        color: props.colorMode === 'dark' ? 'white' : 'gray.800',
        minHeight: '100vh',
        margin: 0,
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale',
      },
      '#__next': {
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      },
      config: {
        initialColorMode: 'light',
        useSystemColorMode: false,
      },
    }),
  },
  colors: {
    brand: {
      50: '#ffe6ff',
      100: '#ffb3ff',
      200: '#ff80ff',
      300: '#ff4dff',
      400: '#ff1aff',
      500: '#e600e6',
      600: '#b300b3',
      700: '#800080',
      800: '#4d004d',
      900: '#1a001a',
    },
    accent: {
      50: '#e6faff',
      100: '#b3f0ff',
      200: '#80e6ff',
      300: '#4ddbff',
      400: '#1ad1ff',
      500: '#00bfff',
      600: '#0099cc',
      700: '#007399',
      800: '#004d66',
      900: '#001a22',
    },
  },
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: 'bold',
      },
      variants: {
        solid: (props) => ({
          bg: props.colorMode === 'dark' ? 'brand.300' : 'brand.500',
          color: 'white',
          _hover: {
            bg: props.colorMode === 'dark' ? 'brand.400' : 'brand.600',
          },
        }),
      },
    },
    Input: {
      variants: {
        outline: (props) => ({
          field: {
            borderColor: props.colorMode === 'dark' ? 'brand.600' : 'brand.200',
            _hover: {
              borderColor: props.colorMode === 'dark' ? 'brand.500' : 'brand.300',
            },
            _focus: {
              borderColor: props.colorMode === 'dark' ? 'brand.400' : 'brand.500',
              boxShadow: `0 0 0 1px ${props.colorMode === 'dark' ? 'brand.400' : 'brand.500'}`,
            },
          },
        }),
      },
    },
  },
});

export default theme;