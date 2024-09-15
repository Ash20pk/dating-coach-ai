import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  fonts: {
    heading: 'Söhne, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Ubuntu, Cantarell, "Noto Sans", sans-serif, "Helvetica Neue", Arial',
    body: 'Söhne, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Ubuntu, Cantarell, "Noto Sans", sans-serif, "Helvetica Neue", Arial',
  },
  styles: {
    global: (props) => ({
      body: {
        bg: props.colorMode === 'dark' ? '#343541' : 'white',
        color: props.colorMode === 'dark' ? 'white' : 'gray.800',
        minHeight: '100vh',
        margin: 0,
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale',
      },
      '#__next': {
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      },
    }),
  },
  colors: {
    gray: {
      50: '#f7f7f8',
      100: '#ececf1',
      200: '#d9d9e3',
      300: '#c5c5d2',
      400: '#acacbe',
      500: '#8e8ea0',
      600: '#565869',
      700: '#40414f',
      800: '#343541',
      900: '#202123',
    },
    brand: {
      50: '#ffe6eb',
      100: '#ffb3c2',
      200: '#ff8099',
      300: '#ff4d71',
      400: '#ff1a48',
      500: '#e6002e',
      600: '#b30024',
      700: '#80001a',
      800: '#4d0010',
      900: '#1a0005',
    },
  },
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: 'medium',
        borderRadius: 'md',
      },
      variants: {
        solid: (props) => ({
          bg: props.colorMode === 'dark' ? 'brand.400' : 'brand.500',
          color: 'white',
          _hover: {
            bg: props.colorMode === 'dark' ? 'brand.500' : 'brand.600',
          },
        }),
        ghost: (props) => ({
          color: props.colorMode === 'dark' ? 'gray.200' : 'gray.700',
          _hover: {
            bg: props.colorMode === 'dark' ? 'gray.700' : 'gray.100',
          },
        }),
      },
    },
    Input: {
      variants: {
        outline: (props) => ({
          field: {
            borderColor: props.colorMode === 'dark' ? 'gray.600' : 'gray.300',
            bg: props.colorMode === 'dark' ? 'gray.700' : 'white',
            _hover: {
              borderColor: props.colorMode === 'dark' ? 'gray.500' : 'gray.400',
            },
            _focus: {
              borderColor: 'brand.400',
              boxShadow: `0 0 0 1px ${props.colorMode === 'dark' ? 'brand.400' : 'brand.500'}`,
            },
          },
        }),
      },
    },
    Heading: {
      baseStyle: {
        fontWeight: 'semibold',
      },
    },
  },
});

export default theme;