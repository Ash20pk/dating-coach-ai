import { useState } from 'react';
import { useRouter } from 'next/router';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Text,
  useColorModeValue,
  InputGroup,
  InputRightElement,
  useToast,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Heading,
  Flex,
} from '@chakra-ui/react';
import { Eye, EyeOff, Heart } from 'lucide-react';

export default function AuthPage({onAuth}) {
  const [showPassword, setShowPassword] = useState(false);
  const toast = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);


  const handleSubmit = async (e, isLogin) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const userData = Object.fromEntries(formData.entries());

    try {
      setIsLoading(true)
      const response = await fetch(`/api/${isLogin ? 'login' : 'signup'}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      const data = await response.json();
      if (response.ok) {
        setIsLoading(false)
        toast({
          title: isLogin ? "Login successful" : "Account created",
          description: `Welcome ${isLogin ? 'back to LoveGuide!' : 'to LoveGuide!'}`,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        onAuth(data.token, data.user);
      } else {
        setIsLoading(false)
        toast({
          title: isLogin ? "Login failed" : "Signup failed",
          description: data.message,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Auth error:', error);
      setIsLoading(false)
      toast({
        title: "An error occurred",
        description: "Unable to process your request. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.600', 'gray.200');
  const tabBg = useColorModeValue('purple.50', 'gray.700');
  const activeTabBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('brand.200', 'brand.600');

  return (
    <Flex width="full" mt="10%" align="center" justifyContent="center" bg={useColorModeValue('purple.50', 'gray.900')}>
      <Box 
        bg={bgColor} 
        p={8} 
        borderRadius="lg" 
        boxShadow="xl" 
        width="100%" 
        maxWidth="400px"
        borderWidth={2}
        borderColor={borderColor}
      >
        <Tabs isFitted variant="enclosed">
          <TabList mb="1em">
            <Tab 
              _selected={{ color: 'brand.500', bg: activeTabBg, borderBottomColor: 'brand.500' }}
              _hover={{ bg: tabBg }}
            >
              Login
            </Tab>
            <Tab 
              _selected={{ color: 'brand.500', bg: activeTabBg, borderBottomColor: 'brand.500' }}
              _hover={{ bg: tabBg }}
            >
              Sign Up
            </Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <form onSubmit={(e) => handleSubmit(e, true)}>
                <VStack spacing={4}>
                  <FormControl isRequired>
                    <FormLabel>Email</FormLabel>
                    <Input name="email" type="email" focusBorderColor="brand.500" />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Password</FormLabel>
                    <InputGroup>
                      <Input
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        focusBorderColor="brand.500"
                      />
                      <InputRightElement width="3rem">
                        <Button
                          h="1.5rem"
                          size="sm"
                          onClick={() => setShowPassword(!showPassword)}
                          bg="transparent"
                          _hover={{ color: 'brand.500' }}
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </Button>
                      </InputRightElement>
                    </InputGroup>
                  </FormControl>
                  <Button type="submit" colorScheme="brand" width="full" isLoading={isLoading}>
                    Login
                  </Button>
                </VStack>
              </form>
            </TabPanel>
            <TabPanel>
              <form onSubmit={(e) => handleSubmit(e, false)}>
                <VStack spacing={4}>
                  <FormControl isRequired>
                    <FormLabel>Name</FormLabel>
                    <Input name="name" type="text" focusBorderColor="brand.500" />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Email</FormLabel>
                    <Input name="email" type="email" focusBorderColor="brand.500" />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Password</FormLabel>
                    <InputGroup>
                      <Input
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        focusBorderColor="brand.500"
                      />
                      <InputRightElement width="3rem">
                        <Button
                          h="1.5rem"
                          size="sm"
                          onClick={() => setShowPassword(!showPassword)}
                          bg="transparent"
                          _hover={{ color: 'brand.500' }}
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </Button>
                      </InputRightElement>
                    </InputGroup>
                  </FormControl>
                  <Button type="submit" colorScheme="brand" width="full" isLoading={isLoading}>
                    Sign Up
                  </Button>
                  <Text mt={4} textAlign="center" fontSize="sm" color={textColor}>
                    By signing up, you agree to our Terms of Service and Privacy Policy.
                  </Text>
                </VStack>
              </form>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Flex>
  );
}