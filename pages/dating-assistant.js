import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
  Box,
  VStack,
  Text,
  Input,
  Button,
  useColorModeValue,
  Flex,
  InputGroup,
  InputRightElement,
  useToast,
  Container,
  UnorderedList,
  ListItem,
  Heading,
  Avatar,
  keyframes,
} from '@chakra-ui/react';
import { Send } from 'lucide-react';

const dotAnimation = keyframes`
  0% { opacity: 0; }
  50% { opacity: 1; }
  100% { opacity: 0; }
`;

const TypingIndicator = () => {
  return (
    <Flex alignItems="center">
      <Text fontSize="xl" mr={2}>•</Text>
      {[0, 1].map((index) => (
        <Text
          key={index}
          fontSize="xl"
          animation={`${dotAnimation} 1.4s linear ${index * 0.2}s infinite`}
        >
          •
        </Text>
      ))}
    </Flex>
  );
};

export default function DatingAssistantPage() {
  const [input, setInput] = useState('');
  const [conversation, setConversation] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const toast = useToast();
  const router = useRouter();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [conversation]);

  useEffect(() => {
    checkUser();
  }, [router]);

  const checkUser = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/');
    } else {

      const response = await fetch('/api/user', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
  
      if(response.ok) {
      const data = await response.json()
      const name = data.name.split(' ')[0] || data.name  
          
      // Add initial greeting message
      setConversation([
        {
          role: 'assistant',
          content: `Hello ${name}! I'm your dating assistant. How can I help you with your dating life today?`
        }
      ])
    }
    }
  }


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      setConversation(prev => [...prev, { role: 'user', content: input }]);
      const currentInput = input;
      setInput('');
      setIsLoading(true);

      const encodedInput = encodeURIComponent(currentInput);
      const eventSource = new EventSource(`/api/dating-guide/stream?input=${encodedInput}&token=${token}`);

      let assistantResponse = '';

      eventSource.onmessage = (event) => {
        try {
          setIsLoading(false);
          const data = JSON.parse(event.data);
          if (data.content === "[DONE]") {
            eventSource.close();
          } else {
            assistantResponse += data.content;
            setConversation(prev => {
              const newConv = [...prev];
              if (newConv[newConv.length - 1]?.role === 'assistant') {
                newConv[newConv.length - 1].content = assistantResponse;
              } else {
                newConv.push({ role: 'assistant', content: assistantResponse.trim() });
              }
              return newConv;
            });
          }
        } catch (error) {
          console.error('Error parsing event data:', error);
        }
      };

      eventSource.onerror = (error) => {
        console.error('EventSource failed:', error);
        eventSource.close();
        toast({
          title: "Connection Error",
          description: "Failed to connect to the server. Please try again.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      };

    } catch (error) {
      console.error('Error getting advice:', error);
      toast({
        title: "Error",
        description: "An error occurred while getting advice. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

const bg = useColorModeValue('purple.50', 'gray.900');
const chatBg = useColorModeValue('white', 'gray.800');
const userBubbleBg = useColorModeValue('brand.400', 'brand.300');
const assistantBubbleBg = useColorModeValue('accent.100', 'accent.700');
const textColor = useColorModeValue('gray.800', 'white');
const borderColor = useColorModeValue('brand.200', 'brand.600');

  const formatMessage = (content) => {
    const lines = content.split('\n');
    let formattedContent = [];
    let currentList = [];
    let inList = false;
    
    lines.forEach((line, index) => {
      if (line.trim() === '') {
        if (inList) {
          formattedContent.push(
            <UnorderedList key={`list-${index}`} pl={4} mt={2}>
              {currentList}
            </UnorderedList>
          );
          currentList = [];
          inList = false;
        }
        formattedContent.push(<Box key={`space-${index}`} height="0.5em" />);
      } else if (line.startsWith('###')) {
        if (inList) {
          formattedContent.push(
            <UnorderedList key={`list-${index}`} pl={4} mt={2}>
              {currentList}
            </UnorderedList>
          );
          currentList = [];
          inList = false;
        }
        formattedContent.push(
          <Heading as="h3" size="md" mt={4} mb={2} key={`heading-${index}`}>
            {line.replace('###', '').trim()}
          </Heading>
        );
      } else if (line.startsWith('**') && line.endsWith('**')) {
        formattedContent.push(
          <Heading as="h4" size="sm" mt={3} mb={1} key={`subheading-${index}`}>
            {line.slice(2, -2).trim()}
          </Heading>
        );
      } else if (line.startsWith('*') || line.startsWith('-')) {
        inList = true;
        currentList.push(
          <ListItem key={`item-${index}`}>
            {formatInline(line.replace(/^[*-]\s*/, ''))}
          </ListItem>
        );
      } else {
        if (inList) {
          formattedContent.push(
            <UnorderedList key={`list-${index}`} pl={4} mt={2}>
              {currentList}
            </UnorderedList>
          );
          currentList = [];
          inList = false;
        }
        formattedContent.push(<Text key={`text-${index}`}>{formatInline(line)}</Text>);
      }
    });

    if (inList) {
      formattedContent.push(
        <UnorderedList key="final-list" pl={4} mt={2}>
          {currentList}
        </UnorderedList>
      );
    }

    return formattedContent;
  };

  const formatInline = (text) => {
    const parts = text.split(/(\*\*.*?\*\*|\*.*?\*)/);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <Text as="span" fontWeight="bold" key={index}>{part.slice(2, -2)}</Text>;
      } else if (part.startsWith('*') && part.endsWith('*')) {
        return <Text as="span" fontStyle="italic" key={index}>{part.slice(1, -1)}</Text>;
      }
      return part;
    });
  };

  return (
    <Container maxW="container.md" h="80vh" py={4}>
      <VStack spacing={4} h="full">
        <Box
          flex={1}
          w="full"
          bg={chatBg}
          borderRadius="lg"
          boxShadow="md"
          overflowY="auto"
          p={4}
          borderWidth={1}
          borderColor={borderColor}
        >
          <VStack spacing={4} align="stretch">
            {conversation.map((message, index) => (
              <Flex key={index} justifyContent={message.role === 'user' ? 'flex-end' : 'flex-start'}>
                <Flex
                  maxW="70%"
                  bg={message.role === 'user' ? userBubbleBg : assistantBubbleBg}
                  color={message.role === 'user' ? 'white' : textColor}
                  borderRadius="lg"
                  px={3}
                  py={2}
                  boxShadow="sm"
                  alignItems="center"
                >
                  <Box>
                    {message.role === 'user' ? (
                      <Text>{message.content}</Text>
                    ) : (
                      formatMessage(message.content)
                    )}
                  </Box>
                </Flex>
              </Flex>
            ))}
            {isLoading && (
              <Flex justifyContent="flex-start">
                <Flex
                  maxW="70%"
                  bg={assistantBubbleBg}
                  color={textColor}
                  borderRadius="lg"
                  px={3}
                  py={2}
                  boxShadow="sm"
                  alignItems="center"
                >
                  <TypingIndicator />
                </Flex>
              </Flex>
            )}
            <div ref={messagesEndRef} />
          </VStack>
        </Box>
        <Box w="full">
          <form onSubmit={handleSubmit}>
            <InputGroup size="md">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask for dating advice..."
                focusBorderColor="brand.500"
                bg={chatBg}
                borderWidth={1}
                borderColor={borderColor}
                isDisabled={isLoading}
              />
              <InputRightElement width="4.5rem">
                <Button h="1.75rem" size="sm" type="submit" colorScheme="brand" isDisabled={isLoading}>
                  <Send size={18} />
                </Button>
              </InputRightElement>
            </InputGroup>
          </form>
        </Box>
      </VStack>
    </Container>
  );
}