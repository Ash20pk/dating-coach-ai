import React from 'react';
import { ChakraProvider, Box, Flex, Heading, Button, useColorMode, Container, useColorModeValue } from '@chakra-ui/react';
import { Sun, Moon, Heart, LogOut } from 'lucide-react';
import { useRouter } from 'next/router';
import theme from '../styles/theme';
import Image from 'next/image';
import loadingGif from '../public/cupidLoading.gif'
import { AuthProvider, useAuth } from '../contexts/authContext';

function AppContent({ Component, pageProps }) {
  const { colorMode, toggleColorMode } = useColorMode();
  const router = useRouter();
  const { user, logout, loading } = useAuth();

  const bgColor = useColorModeValue('purple.50', 'gray.900');
  const textColor = useColorModeValue('gray.800', 'white');
  const headerBgColor = useColorModeValue('white', 'gray.800');
  const headerShadow = useColorModeValue('sm', 'md');

  if (loading) {
    return (
      <Flex height="100vh" alignItems="center" justifyContent="center" bg={bgColor}>
        <Image
          src="/cupidLoading.gif"
          alt="Loading"
          width={300}
          height={300}
        />
      </Flex>
    );
  }

  return (
    <Box minHeight="100vh" bg={bgColor} color={textColor}>
      <Flex 
        as="header" 
        bg={headerBgColor} 
        py={4} 
        px={8}
        boxShadow={headerShadow} 
        position="sticky" 
        top={0} 
        zIndex={10}
        alignItems="center"
      >
        <Container maxW="container.xl" display="flex" alignItems="center">
          <Flex alignItems="center" cursor="pointer" onClick={() => router.push('/')}>
            <Heart size={24} color={theme.colors.brand[500]} />
            <Heading size="lg" color="brand.500" ml={2}>LoveGuide</Heading>
          </Flex>
          <Flex ml="auto" alignItems="center">
            <Button 
              onClick={toggleColorMode} 
              mr={4} 
              variant="ghost" 
              size="sm"
              aria-label={colorMode === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
            >
              {colorMode === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </Button>
            {user && (
              <Button 
                onClick={logout} 
                colorScheme="brand" 
                size="sm" 
                leftIcon={<LogOut size={18} />}
              >
                Logout
              </Button>
            )}
          </Flex>
        </Container>
      </Flex>
      <Container maxW="container.xl" py={8}>
        <Component {...pageProps} />
      </Container>
    </Box>
  );
}

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider theme={theme}>
      <AuthProvider>
        <AppContent Component={Component} pageProps={pageProps} />
      </AuthProvider>
    </ChakraProvider>
  );
}

export default MyApp;