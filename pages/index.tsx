import { Textarea, Heading, Button, VStack, Select } from '@chakra-ui/react'

export default function Home() {
  return (
    <VStack>
      <Heading as='h1' size='4xl' noOfLines={1}>
        ReadNLearn
      </Heading>
      <Select placeholder='Select Language of Text to Paste'>
        <option value='option1'>French</option>
        <option value='option2'>Spanish</option>
        <option value='option3'>Russian</option>
      </Select>
      <Textarea placeholder='Paste your text in here...' />
      <Button colorScheme='telegram'>Start learning!</Button>
    </VStack>
  );
}
