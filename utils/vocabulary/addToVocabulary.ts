import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../firebase/config";

export async function addToVocabulary(userId: string, language: string, word: string, translation: string) {
    const userRef = doc(db, 'users', userId);
    const fieldName = `vocabulary.${language}Words`;
    const wordData = {word, translation};

    try {
        await updateDoc(userRef, {
            [fieldName]: arrayUnion(wordData)
        });
        console.log('Word added to vocabulary');
    } catch (e) {
        console.error('Error updating document: ', e)
    }
}