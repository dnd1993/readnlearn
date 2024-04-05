import { useFormData } from '../context/FormDataContext';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { FormErrorMessage, FormControl, Textarea, Heading, Button, VStack, Select } from '@chakra-ui/react'

type FormData = {
  language: string;
  text: string;
}

export default function Home() {
  const { handleSubmit, register, formState: { errors, isSubmitting }, } = useForm();
  const { setFormData } = useFormData();
  const router = useRouter();
  
  async function onSubmit(values: FormData) {
    setFormData(values);
    router.push({
      pathname: '/result',
    });
  };
  return (
    <VStack spacing={4}>
      <Heading as='h1' size='4xl' noOfLines={1}>
        ReadNLearn
      </Heading>
      <form onSubmit={handleSubmit(onSubmit)}>
        <VStack spacing={4}>
          <FormControl isInvalid={!!errors.language}>  
            <Select
              id='language' 
              placeholder='Select Language of Text to Paste'
              {...register('language', { required: true })}
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
            />
            {errors.text && <FormErrorMessage>Please paste in some text.</FormErrorMessage>}
          </FormControl>
          <Button 
            colorScheme='telegram'
            isLoading={isSubmitting}
            type='submit'
          >
            Start learning!
          </Button>
        </VStack>
      </form>
    </VStack>
  );
}
