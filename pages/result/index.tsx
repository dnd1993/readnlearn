import { Text, Box, Button, VStack } from "@chakra-ui/react";
import { useFormData } from "../../context/FormDataContext";
import { useRouter } from 'next/router';

export default function Result() {
    const router = useRouter();
    const { formData } = useFormData();
    // This regex splits on spaces while preserving punctuation as separate "words"
    const words = formData.text.split(/(\s+|\b)/);
    const handleWordClick = (word: string) => {
        console.log(`You clicked on: ${word}`);
    }
    return (
        <VStack spacing={4} mt='20px'>
            <Button colorScheme="blue" onClick={() => router.push('/')}>
                Back to Home
            </Button>
            <Box p={5} textAlign="justify" whiteSpace="pre-wrap">
                {words.map((word, index) => (
                    <Text as="span" key={index} cursor="pointer"
                         _hover={{ textDecoration: "underline" }} 
                         onClick={() => handleWordClick(word)}
                         marginRight="1px">
                        {word}
                    </Text>
                ))}
            </Box>
        </VStack>
    )
}
