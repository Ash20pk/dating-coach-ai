import { VStack, Text, Box, Fade, useColorModeValue } from '@chakra-ui/react';
import { useAuth } from '../contexts/authContext';


export default function Home() {
  const { AuthComponent } = useAuth();

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
          <AuthComponent/>
        </Box>
      </VStack>
    </Fade>
  );
}