import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { getSession } from 'next-auth/react';
import { useFormData } from '../../context/FormDataContext';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { FormErrorMessage, FormControl, Textarea, Heading, Button, VStack, Select, Container, Text, Box, useColorModeValue } from '@chakra-ui/react'
import NavBar from '../../components/NavBar';

type FormData = {
  language: string;
  text: string;
}

export default function InputPage() {
  const { handleSubmit, register, formState: { errors, isSubmitting }, } = useForm();
  const { setFormData } = useFormData();
  const router = useRouter();
  
  async function onSubmit(values: FormData) {
    setFormData(values);
    router.push({
      pathname: '/result',
    });
  };

  const formBgColor = useColorModeValue('white', 'gray.600');

  return (
    <>
      <NavBar />
      <Container maxW="container.lg" py={12}>
      <VStack spacing={8}>
        <Heading as='h1' size='2xl'>
          Practice a New Language
        </Heading>
        <Text fontSize="lg" textAlign="center">
            Enter text in the language you're learning, get translations, and add new words to your vocabulary.
        </Text>
        <Box p={8} bg={formBgColor} borderRadius="lg" boxShadow="lg" w="full">
        <form onSubmit={handleSubmit(onSubmit)}>
          <VStack spacing={6}>
            <FormControl isInvalid={!!errors.language}>  
              <Select
                id='language' 
                placeholder='Select Language of Text to Paste'
                {...register('language', { required: true })}
                size="lg"
              >
                <option value='french'>French</option>
                <option value='spanish'>Spanish</option>
                <option value='german'>German</option>
              </Select>
                {errors.language && <FormErrorMessage>Please select the language.</FormErrorMessage>}
              </FormControl>
            <FormControl isInvalid={!!errors.text}>
              <Textarea
                id='text' 
                placeholder='Paste your text in here...'
                {...register('text', { required: 'You need to paste some text to proceed' })}
                size="lg"
                minHeight="200px" 
              />
              {errors.text && <FormErrorMessage>Please paste in some text.</FormErrorMessage>}
            </FormControl>
            <Button 
              colorScheme='telegram'
              isLoading={isSubmitting}
              type='submit'
              size="lg"
            >
              Start learning
            </Button>
          </VStack>
        </form>
        </Box>
      </VStack>
      </Container>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
  const session = await getSession(context);

  if(!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  }
}