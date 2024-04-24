import { useState, useEffect, useRef } from "react";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import { Flex, Box, VStack, Link as ChakraLink, Table, Thead, Tbody, Tr, Th, Td, Heading, IconButton, AlertDialog, AlertDialogBody, AlertDialogFooter, AlertDialogHeader, AlertDialogContent, Button } from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import NavBar from "../../components/NavBar";
import { db } from "../../utils/firebase/config";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { languageMap } from "../../utils/vocabulary/translation";
import { capitalizeFirstLetter } from "../../utils/vocabulary/capitalizeFirstLetter";

const VocabularyPage = ({ session }) => {
    const [selectedLanguage, setSelectedLanguage] = useState(Object.values(languageMap)[0]);
    const [vocabulary, setVocabulary] = useState([]);
    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const [indexToDelete, setIndexToDelete] = useState(null);
    const cancelRef = useRef(); // For the cancel button focus

    useEffect(() => {
        session && (async function fetchDoc() {
            const docRef = doc(db, 'users', session.user.id);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists() && docSnap.data().vocabulary) {
                setVocabulary(docSnap.data().vocabulary[selectedLanguage + 'Words'])
            } else {
                console.log('No such document!');
                setVocabulary([]); // Ensure vocabulary is set to an empty array if it doesn't exist
            }
        })();
    }, [session, selectedLanguage])

    const onOpenAlert = (index: number) => {
        setIndexToDelete(index);
        setIsAlertOpen(true);
    }

    const onCloseAlert = () => {
        setIsAlertOpen(false);
    }

    const onDeleteConfirm = async () => {
        const fieldPath = `vocabulary.${selectedLanguage}Words`;
        const updatedVocabulary = vocabulary.filter((_, i) => i !== indexToDelete);
        const docRef = doc(db, 'users', session.user.id);
        await updateDoc(docRef, {
            [fieldPath]: updatedVocabulary
        });
        setVocabulary(updatedVocabulary);
        onCloseAlert();
    };

    return (
        <>
            <NavBar />
            <Flex>
               <Box width='20%' p={5} borderRight='1px' borderColor='gray.200'>
                    <VStack align='stretch' spacing={4}>
                        {Object.keys(languageMap).map(languageKey => (
                            <ChakraLink
                                key={languageKey}
                                onClick={() => setSelectedLanguage(languageMap[languageKey])}
                                fontWeight={selectedLanguage === languageMap[languageKey] ? 'bold' : 'normal'}
                                cursor='pointer'
                                _hover={{ color: 'blue.500' }}
                            >
                                {capitalizeFirstLetter(languageKey)}
                            </ChakraLink>
                        ))}
                    </VStack>
                </Box>
                <Box width='80%' p={5}>
                    <Heading mb={4}>
                        {capitalizeFirstLetter(Object.keys(languageMap).find(key => languageMap[key] === selectedLanguage))}
                    </Heading>
                    <VocabularyTable words={vocabulary} onDelete={onOpenAlert} />
                </Box> 
            </Flex>
            <AlertDialog
                isOpen={isAlertOpen}
                leastDestructiveRef={cancelRef}
                onClose={onCloseAlert}
            >
                <AlertDialogContent>
                    <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                        Delete Word
                    </AlertDialogHeader>
                    <AlertDialogBody>
                        Are you sure you want to delete this word?
                    </AlertDialogBody>
                    <AlertDialogFooter>
                        <Button ref={cancelRef} onClick={onCloseAlert}>
                            Cancel
                        </Button>
                        <Button colorScheme='red' onClick={onDeleteConfirm}>
                            Delete
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}

const VocabularyTable = ({ words, onDelete }) => {
    if(!words || words.length === 0) {
        return <Box>No words added yet.</Box>
    }

    return (
        <Table variant='simple'>
            <Thead>
                <Tr>
                    <Th>Word</Th>
                    <Th>Translation</Th>
                    {/* empty table header for a delete button */}
                    <Th></Th>
                </Tr>
            </Thead>
            <Tbody>
                {words.length > 0 && words.map((entry, index: number) => (
                    <Tr key={index}>
                        <Td>{entry.word}</Td>
                        <Td>{entry.translation}</Td>
                        <Td textAlign='center'>
                            <IconButton 
                                aria-label="Delete word"
                                icon={<DeleteIcon />}
                                size='sm'
                                colorScheme='red'
                                variant='ghost'
                                onClick={() => onDelete(index)}
                            />
                        </Td>
                    </Tr>
                ))}
            </Tbody>
        </Table>
    )
};

export default VocabularyPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getSession(context);

    if (!session) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            }
        }
    }

    const docRef = doc(db, 'users', session.user.id);
    const docSnap = await getDoc(docRef);

    const vocabulary = docSnap.exists() && docSnap.data().vocabulary ? docSnap.data().vocabulary[Object.values(languageMap)[0] + 'Words'] : {};

    return {
        props: { session },
    };
};