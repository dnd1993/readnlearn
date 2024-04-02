import React, { useState } from "react";
import { Box, Button, Popover, PopoverTrigger, PopoverContent, PopoverBody, Text, VStack, PopoverFooter } from "@chakra-ui/react";
import { useFormData } from "../../context/FormDataContext";
import { useRouter } from 'next/router';

export default function Result() {
    const router = useRouter();
    const { formData } = useFormData();
    const [selectedWordIndex, setSelectedWordIndex] = useState(null);

    // Use a regex that captures words, spaces, and punctuation as separate groups
    const words = formData.text.match(/(\w+|\s+|[^\w\s]+)/g) || [];

    const handleWordClick = (index: number) => setSelectedWordIndex(index);

    return (
        <VStack spacing={4} mt="20px">
            <Button colorScheme="blue" onClick={() => router.push('/')}>Back to Home</Button>
            <Box p={5} textAlign="justify" whiteSpace="pre-wrap">
                {words.map((word: string, index: number) => {
                    const isWord = /\w+/.test(word);
                    return (
                        <React.Fragment key={index}>
                            {isWord ? (
                                <Popover
                                    isOpen={selectedWordIndex === index}
                                    onClose={() => setSelectedWordIndex(null)}
                                    placement="bottom"
                                    closeOnBlur={true}
                                >
                                    <PopoverTrigger>
                                        <Text as="span" cursor="pointer" _hover={{ textDecoration: "underline" }} onClick={() => handleWordClick(index)}>
                                            {word}
                                        </Text>
                                    </PopoverTrigger>
                                    <PopoverContent>
                                        <PopoverBody>
                                            This is placeholder content for "{word}".
                                        </PopoverBody>
                                        <PopoverFooter>
                                            <Button>Add To Vocabulary</Button>
                                        </PopoverFooter>
                                    </PopoverContent>
                                </Popover>
                            ) : (
                                // Directly render spaces and punctuation without wrapping them in Popover
                                <Text as="span" display="inline">{word}</Text>
                            )}
                        </React.Fragment>
                    );
                })}
            </Box>
        </VStack>
    );
}
