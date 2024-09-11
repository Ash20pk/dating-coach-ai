import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { VStack, Text, Box, Fade, useColorModeValue } from '@chakra-ui/react';
import Auth from './components/auth';

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await fetch('/api/user', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (response.ok) {
            const userData = await response.json();
            if (!userData.onboardingComplete) {
              router.push('/onboarding');
            } else {
              router.push('/dating-assistant');
            }
          } else {
            // Token is invalid, remove it
            localStorage.removeItem('token');
            setIsLoading(false);
          }
        } catch (error) {
          console.error('Error checking authentication:', error);
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const handleAuth = async (token, userData) => {
    localStorage.setItem('token', token);
    if (!userData.onboardingComplete) {
      router.push('/onboarding');
    } else {
      router.push('/dating-assistant');
    }
  };

  if (isLoading) {
    return null; // or a loading spinner
  }

  const bgColor = useColorModeValue('purple.50', 'gray.900');
  const titleColor = useColorModeValue('brand.600', 'brand.300');
  const subtitleColor = useColorModeValue('gray.600', 'gray.400');

  return (
    <Fade in={true}>
      <VStack spacing={2} minH="80vh" bg={bgColor} justify="center" p={4}>
        <Box textAlign="center">
          <Text fontSize="4xl" fontWeight="bold" color={titleColor} mb={2}>
            Welcome to LoveGuide
          </Text>
          <Text fontSize="xl" color={subtitleColor}>
            Your Personal Dating Coach
          </Text>
          <Auth onAuth={handleAuth} />
        </Box>
      </VStack>
    </Fade>
  );
}