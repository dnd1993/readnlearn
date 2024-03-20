import { Form, useForm } from 'react-hook-form';
import { FormErrorMessage, FormLabel, FormControl, Textarea, Heading, Button, VStack, Select } from '@chakra-ui/react'

export default function Home() {
  const { handleSubmit, register, formState: { errors, isSubmitting }, } = useForm();
  function onSubmit(values) {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        alert(JSON.stringify(values, null, 2))
        resolve()
      }, 3000)
    })
  }
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
              <option value='option1'>French</option>
              <option value='option2'>Spanish</option>
              <option value='option3'>Russian</option>
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
