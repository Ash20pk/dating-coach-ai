import React, { useState, useEffect } from 'react';
import { ChakraProvider, Box, Flex, Heading, Button, useColorMode, Container, useColorModeValue, Img } from '@chakra-ui/react';
import { Sun, Moon, Heart, LogOut } from 'lucide-react';
import { useRouter } from 'next/router';
import theme from '../styles/theme';
import Image from 'next/image';
import loadingGif from '../public/cupidLoading.gif'

function MyApp({ Component, pageProps }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { colorMode, toggleColorMode } = useColorMode();
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUser(token);
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchUser = async (token) => {
    try {
      const response = await fetch('/api/user', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        localStorage.removeItem('token');
        setUser(null);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      setUser(null);
    }
    setIsLoading(false);
  };

  const login = (token, userData) => {
    localStorage.setItem('token', token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    router.push('/');
  };

  // Use theme colors directly
  const bgColor = useColorModeValue('purple.50', 'gray.900');
  const textColor = useColorModeValue('gray.800', 'white');
  const headerBgColor = useColorModeValue('white', 'gray.800');
  const headerShadow = useColorModeValue('sm', 'md');

  if (isLoading) {
    return (
      <ChakraProvider theme={theme}>
        <Flex height="100vh" alignItems="center" justifyContent="center" bg={bgColor}>
          <Image
            src="/cupidLoading.gif"
            alt="Loading"
            width={100}
            height={100}
          />
        </Flex>
      </ChakraProvider>
    );
  }

  return (
    <ChakraProvider theme={theme}>
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
            <Flex alignItems="center" cursor="pointer" onClick={() => console.log('Navigate to home')}>
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
          <Component {...pageProps} user={user} login={login} logout={logout} />
        </Container>
      </Box>
    </ChakraProvider>
  );
}

export default MyApp;