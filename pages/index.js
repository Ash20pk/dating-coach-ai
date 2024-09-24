import React from 'react';
import { VStack, Box, Fade, useColorModeValue } from '@chakra-ui/react';
import { useAuth } from '../contexts/authContext';
import LandingPage from './landing_page';

export default function Home() {
  const { AuthComponent, setIsAuthModalOpen } = useAuth();
  const bgColor = useColorModeValue('gray.50', 'gray.900');

  const handleShowAuth = () => {
    setIsAuthModalOpen(true);
  };

  return (
    <Fade in={true}>
      <VStack spacing={2} minH="80vh" bg={bgColor} justify="center" p={4}>
        <Box textAlign="center">
          <LandingPage onShowAuth={handleShowAuth} />
        </Box>
        <AuthComponent />
      </VStack>
    </Fade>
  );
}