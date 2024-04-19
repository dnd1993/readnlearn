// pages/index.tsx
import { useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import {
  Box,
  Button,
  Center,
  Heading,
  Image,
  Stack,
  Text,
  Container,
  AspectRatio,
  useColorModeValue,
  Divider,
} from "@chakra-ui/react";
import { FaGoogle } from 'react-icons/fa';

export default function Home() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/input');
    }
  }, [status, router]);

  if (status === 'loading') {
    return <Center height="100vh"><Text>Loading...</Text></Center>;
  }

  if (status === 'authenticated') {
    return null;
  }

  const sectionBgColor = useColorModeValue('gray.50', 'gray.900');
  const textColor = useColorModeValue('gray.700', 'gray.200');

  return (
    <Box>
      <Container maxW="container.xl" py={48}>
        <Stack direction={{ base: 'column', md: 'row' }} spacing={8} align="center" justify="center">
          <Box flex="1">
            <Heading as="h1" size="2xl" mb={6}>
              ReadNLearn
            </Heading>
            <Text fontSize="lg" color={textColor} mb={6}>
              Practice and learn a new language by reading your favorite texts. Click on words for translations and add them to your vocabulary list.
            </Text>
            <Button leftIcon={<FaGoogle />} colorScheme="red" onClick={() => signIn('google')}>
              Sign In with Google
            </Button>
          </Box>
          <Box flex="1">
            <Image
              src="https://images.unsplash.com/photo-1584697964358-3e14ca57658b?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Language Learning"
              borderRadius="lg"
              shadow="lg"
              objectFit="cover"
            />
          </Box>
        </Stack>
      </Container>
      <Box bg={sectionBgColor} py={48} px={4}>
        <Container maxW="container.xl">
          <Stack direction={{ base: 'column', md: 'row' }} spacing={10} align="center" justify="center">
            <Box flex="1" textAlign={{ base: 'center', md: 'left' }}>
              <Heading as="h2" size="xl" mb={6}>
                How ReadNLearn Works
              </Heading>
              <Text fontSize="lg" color={textColor} mb={6}>
                Watch our quick tutorial to get started and make the most out of ReadNLearn!
              </Text>
            </Box>
            <Box flex="1">
              <AspectRatio ratio={16 / 9} w="100%">
                <Box as="video" autoPlay loop muted playsInline borderRadius="lg" shadow="lg">
                  <source src="/videos/readnlearn.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </Box>
              </AspectRatio>
            </Box>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}
