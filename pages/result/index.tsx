import { useState, useRef } from "react";
import { Text, Box, Button, VStack, Popover, PopoverTrigger, PopoverContent, PopoverHeader, PopoverArrow, PopoverCloseButton, PopoverBody, PopoverFooter, ButtonGroup } from "@chakra-ui/react";
import { useFormData } from "../../context/FormDataContext";
import { useRouter } from 'next/router';

export default function Result() {
    // ! TO DO: change the functionality so that 2 popovers can't be open at the same time
    const router = useRouter();
    const initialFocusRef = useRef();
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
                    <Popover
                        initialFocusRef={initialFocusRef}
                        placement='bottom'
                        closeOnBlur={false}
                    >
                        <PopoverTrigger>
                            <Text as="span" key={index} cursor="pointer"
                                _hover={{ textDecoration: "underline" }} 
                                onClick={() => handleWordClick(word)}
                                marginRight="1px">
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
                            <PopoverFooter
                                border='0'
                                display='flex'
                                alignItems='center'
                                justifyContent='space-between'
                                pb={4}
                            >
                                <Button 
                                    colorScheme='blue'
                                    ref={initialFocusRef}
                                >
                                    Add to Vocabulary
                                </Button>
                            </PopoverFooter>
                        </PopoverContent>
                    </Popover>
                ))}
            </Box>
        </VStack>
    )
}