import React, { useState } from "react";
import { Box, Button, Popover, PopoverTrigger, PopoverContent, PopoverBody, Text, VStack, PopoverFooter } from "@chakra-ui/react";
import { useFormData } from "../../context/FormDataContext";
import { useTranslate } from "../../hooks/useTranslate";
import { useRouter } from 'next/router';
import { languageMap } from "../../utils/translation";

export default function Result() {
    const router = useRouter();
    const { formData } = useFormData();

    const [selectedWordIndex, setSelectedWordIndex] = useState(null);
    const [selectedWord, setSelectedWord] = useState("");

    // Use a regex that captures words, spaces, and punctuation as separate groups
    const words = formData.text.match(/(\w+|\s+|[^\w\s]+)/g) || [];

    const handleWordClick = (word: string, index: number) => {
        setSelectedWordIndex(index);
        setSelectedWord(word);
    }

    const { data: translation, isLoading } = useTranslate({
        query: selectedWord,
        sourceLang: languageMap[formData.language],
        targetLang: 'en',
    });

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
                                        <Text as="span" cursor="pointer" _hover={{ textDecoration: "underline" }} onClick={() => handleWordClick(word, index)}>
                                            {word}
                                        </Text>
                                    </PopoverTrigger>
                                    <PopoverContent>
                                        <PopoverBody>
                                        {isLoading ? "Loading translation..." : translation?.data.translations[0].translatedText || "Translation not available."}
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
