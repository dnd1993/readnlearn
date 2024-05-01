import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../firebase/config";
import { UseToastOptions } from "@chakra-ui/react";

export async function addToVocabulary(
    userId: string, 
    language: string, 
    word: string, 
    translation: string, 
    toast: (options: UseToastOptions) => void
    ) {
        const userRef = doc(db, 'users', userId);
        const fieldName = `vocabulary.${language}Words`;
        const wordData = {word, translation};

        try {
            await updateDoc(userRef, {
                [fieldName]: arrayUnion(wordData)
            });
            toast({
                title: 'Success',
                description: `"${word}" has been added to your vocabulary.`,
                status: 'success',
                duration: 5000,
                isClosable: true,
            });
        } catch (e) {
            console.error('Error updating document: ', e)
            toast({
                title: 'Error',
                description: 'There was an error adding the word to your vocabulary.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
}

