import React, { useState } from "react";
import { useSession, signIn } from "next-auth/react";
import { Box, Button, Popover, PopoverTrigger, PopoverContent, PopoverBody, Text, VStack, PopoverFooter, PopoverHeader } from "@chakra-ui/react";
import { useFormData } from "../../context/FormDataContext";
import { useTranslate } from "../../hooks/useTranslate";
import { useRouter } from 'next/router';
import { languageMap } from "../../utils/vocabulary/translation";
import NavBar from "../../components/NavBar";
import TextToSpeechBtn from '../../components/TextToSpeechBtn';
import { useToast } from "@chakra-ui/react";
import { addToVocabulary } from "../../utils/vocabulary/addToVocabulary";

export default function Result() {
    const { data: session, status } = useSession({
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

    const toast = useToast();

    const handleWordClick = async (word: string, index: number) => {
        setSelectedWordIndex(index);
        setSelectedWord(word);
    }

    const handleAddToVocabulary = async () => {
        await addToVocabulary(
            session.user.id,
            languageMap[formData.language],
            selectedWord,
            translation.data.translations[0].translatedText,
            toast
        )
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
                <TextToSpeechBtn text={formData.text} language={languageMap[formData.language]}/>
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
                                            <PopoverHeader fontWeight='bold'>
                                                {word} <TextToSpeechBtn language={languageMap[formData.language]} text={word} />
                                            </PopoverHeader>
                                            <PopoverBody>
                                            {isLoading ? "Loading translation..." : translation?.data.translations[0].translatedText || "Translation not available."}
                                            </PopoverBody>
                                            <PopoverFooter>
                                                <Button onClick={handleAddToVocabulary}>Add To Vocabulary</Button>
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
