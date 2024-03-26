import { useState, useRef } from "react";
import { Text, Box, Button, VStack, Popover, PopoverTrigger, PopoverContent, PopoverHeader, PopoverArrow, PopoverCloseButton, PopoverBody, PopoverFooter, ButtonGroup } from "@chakra-ui/react";
import { useFormData } from "../../context/FormDataContext";
import { useRouter } from 'next/router';

export default function Result() {
    const router = useRouter();
    const initialFocusRef = useRef();
    const { formData } = useFormData();

    // This regex splits the text into words and punctuation, preserving both
    const words = formData.text.split(/(\s+|\b)/);

    // Function to handle word clicks
    const handleWordClick = (word) => {
        console.log(`You clicked on: ${word}`);
    }

    return (
        <VStack spacing={4} mt='20px'>
            <Button colorScheme="blue" onClick={() => router.push('/')}>
                Back to Home
            </Button>
            <Box p={5} textAlign="justify" whiteSpace="pre-wrap">
                {words.map((word, index) => {
                    // Check if the word is actually a word and not just spaces or punctuation
                    if (!word.trim().length || word.match(/^\s+$/)) {
                        // It's a space or punctuation, render without popover
                        return <Text as="span" key={index} marginRight="1px">{word}</Text>;
                    }
                    // It's an actual word, render with popover
                    return (
                        <Popover key={index} initialFocusRef={initialFocusRef} placement='bottom' closeOnBlur={true}>
                            <PopoverTrigger>
                                <Text as="span" cursor="pointer" _hover={{ textDecoration: "underline" }} onClick={() => handleWordClick(word)} marginRight="1px">
                                    {word}
                                </Text>
                            </PopoverTrigger>
                            <PopoverContent color='white' bg='blue.800' borderColor='blue.800'>
                                <PopoverHeader pt={4} fontWeight='bold' border='0'>
                                    Translation
                                </PopoverHeader>
                                <PopoverArrow bg='blue.800' />
                                <PopoverCloseButton />
                                <PopoverBody>
                                    This is where stuff from Google Translate API will come.
                                </PopoverBody>
                                <PopoverFooter border='0' display='flex' alignItems='center' justifyContent='space-between' pb={4}>
                                    <Button colorScheme='blue'>Add to Vocabulary</Button>
                                </PopoverFooter>
                            </PopoverContent>
                        </Popover>
                    );
                })}
            </Box>
        </VStack>
    );
}
