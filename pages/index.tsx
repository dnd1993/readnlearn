import { Textarea, Heading, Button, VStack } from '@chakra-ui/react'

export default function Home() {
  return (
    <VStack>
      <Heading as='h1' size='4xl' noOfLines={1}>
        ReadNLearn
      </Heading>
      <Textarea placeholder='Paste your text in here...' />
      <Button colorScheme='telegram'>Start learning!</Button>
    </VStack>
  );
}
