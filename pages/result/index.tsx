import React, { useState } from "react";
import { useSession, signIn } from "next-auth/react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../utils/firebase/config";
import { Box, Button, Popover, PopoverTrigger, PopoverContent, PopoverBody, Text, VStack, PopoverFooter } from "@chakra-ui/react";
import { useFormData } from "../../context/FormDataContext";
import { useTranslate } from "../../hooks/useTranslate";
import { useRouter } from 'next/router';
import { languageMap } from "../../utils/translation";
import NavBar from "../../components/NavBar";

export default function Result() {
    const { status } = useSession({
        required: true,
        onUnauthenticated() {
            signIn('google');
        }
    })
    const router = useRouter();
    const { formData } = useFormData();

    const [selectedWordIndex, setSelectedWordIndex] = useState(null);
    const [selectedWord, setSelectedWord] = useState("");

    // Use a regex that captures words, spaces, and punctuation as separate groups
    const words = formData.text.match(/(\w+|\s+|[^\w\s]+)/g) || [];

    const handleWordClick = async (word: string, index: number) => {
        setSelectedWordIndex(index);
        setSelectedWord(word);
    }

    const { data: translation, isLoading } = useTranslate({
        query: selectedWord,
        sourceLang: languageMap[formData.language],
        targetLang: 'en',
    });

    if (!formData.text) {
        return (
            <VStack spacing={4} mt='20px'>
                <Text>Oops! You must have gotten here using direct link and skipped the input page! Please go back and paste in some text to start Reading N Learning!</Text>
                <Button colorScheme='blue' onClick={() => router.push('/input')}>Go To Input Page</Button>
            </VStack>
        )
    }
    
    if (status === 'loading') {
        return <div>Loading...</div>
    }

    return (
        <>
            <NavBar />
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
        </>
    );
}
