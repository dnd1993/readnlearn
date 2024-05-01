import { useState, useEffect, useRef, useMemo } from "react";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import { Flex, Box, VStack, Link as ChakraLink, Table, Thead, Tbody, Tr, Th, Td, Heading, IconButton, AlertDialog, AlertDialogBody, AlertDialogFooter, AlertDialogHeader, AlertDialogContent, Button, InputGroup, InputLeftElement, Input, useToast, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, useDisclosure, FormControl, FormLabel, FormErrorMessage} from "@chakra-ui/react";
import { AddIcon, DeleteIcon, SearchIcon } from "@chakra-ui/icons";
import NavBar from "../../components/NavBar";
import { db } from "../../utils/firebase/config";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { languageMap } from "../../utils/vocabulary/translation";
import { capitalizeFirstLetter } from "../../utils/vocabulary/capitalizeFirstLetter";
import { entry } from "../../types/vocabulary";
import { useForm } from "react-hook-form";
import { addToVocabulary } from "../../utils/vocabulary/addToVocabulary";


const VocabularyPage = ({ session }) => {
    const [selectedLanguage, setSelectedLanguage] = useState(Object.values(languageMap)[0]);
    const [vocabulary, setVocabulary] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const [indexToDelete, setIndexToDelete] = useState(null);

    const { isOpen, onOpen, onClose } = useDisclosure()

    const cancelRef = useRef(); // For the cancel button focus
    const toast = useToast();

    const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm();

    console.log(selectedLanguage);

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
    }, [session, selectedLanguage]);

    const filteredVocabulary = useMemo(() => {
        return vocabulary.filter(entry => entry.word.includes(searchTerm));
    }, [vocabulary, searchTerm]);

    const onAddWordSubmit = async (newWordData: entry) => {
        console.log(`The word ${newWordData.word} has been successfully added to the vocabulary!`);
        const newWord = {
            word: newWordData.word,
            translation: newWordData.translation
        }
        await addToVocabulary(session.user.id, selectedLanguage, newWord.word, newWord.translation, toast)
        setVocabulary(prevVocabulary => [...prevVocabulary, newWord])
        onClose();
        reset();
    }

    const onOpenAlert = (index: number) => {
        setIndexToDelete(index);
        setIsAlertOpen(true);
    };

    const onCloseAlert = () => {
        setIsAlertOpen(false);
    };

    const onDeleteConfirm = async () => {
        const fieldPath = `vocabulary.${selectedLanguage}Words`;
        const updatedVocabulary = vocabulary.filter((_, i) => i !== indexToDelete);
        const docRef = doc(db, 'users', session.user.id);
        await updateDoc(docRef, {
            [fieldPath]: updatedVocabulary
        });
        setVocabulary(updatedVocabulary);
        onCloseAlert();
        toast({
            description: `The word '${vocabulary[indexToDelete].word}' has been successfully removed from your vocabulary.`,
            status: 'success',
            duration: 3000,
            isClosable: true,
        });
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
                    <Flex justify='space-between' align='center' mb={4}>
                    <Heading mb={4}>
                        {capitalizeFirstLetter(Object.keys(languageMap).find(key => languageMap[key] === selectedLanguage))}
                    </Heading>
                    <Button
                        leftIcon={<AddIcon />} 
                        colorScheme='blue'
                        onClick={onOpen}
                    >
                        Add a Word
                    </Button>
                    </Flex>
                    <InputGroup mb={4}>
                        <InputLeftElement pointerEvents='none'>
                            <SearchIcon />
                        </InputLeftElement>
                        <Input
                            placeholder="Search for a word in your vocabulary..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </InputGroup>
                    <VocabularyTable words={filteredVocabulary} onDelete={onOpenAlert} />
                </Box> 
            </Flex>
            <Modal 
                isOpen={isOpen} 
                onClose={onClose}
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Add a new word</ModalHeader>
                    <ModalCloseButton />
                    <form onSubmit={handleSubmit(onAddWordSubmit)}>
                        <ModalBody pb={6}>
                            <FormControl mt={2} isInvalid={!!errors.word}>
                                <FormLabel>Word</FormLabel>
                                <Input 
                                    id='word'
                                    placeholder='Enter a new word...'
                                    {...register('word', { required: 'Please type in a word' })} 
                                />
                                {errors.word && <FormErrorMessage>{errors.word.message}</FormErrorMessage>}
                            </FormControl>
                            <FormControl isInvalid={!!errors.translation}>
                                <FormLabel mt={4}>Translation</FormLabel>
                                <Input 
                                    id='word'
                                    placeholder='Enter the translation...'
                                    {...register('translation', { required: 'Please type in the translation' })} 
                                />
                               {errors.translation && <FormErrorMessage>{errors.translation.message}</FormErrorMessage>} 
                            </FormControl>
                        </ModalBody>
                        <ModalFooter>
                            <Button
                                type='submit'
                                isLoading={isSubmitting}
                                colorScheme='blue'
                                mr={4}
                            >
                                Add to vocabulary
                            </Button>
                            <Button 
                                onClick={() => {
                                    onClose();
                                    reset();
                            }}>
                                Cancel
                            </Button>
                        </ModalFooter>
                    </form>  
                </ModalContent>                
            </Modal>
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
                        <Button mr='4' ref={cancelRef} onClick={onCloseAlert}>
                            Cancel
                        </Button>
                        <Button colorScheme='red' onClick={onDeleteConfirm}>
                            Delete
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};

const VocabularyTable = ({ words, onDelete }) => {
    if(!words || words.length === 0) {
        return <Box>No words added yet.</Box>
    };

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
                {words.length > 0 && words.map((entry: entry, index: number) => (
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
    );
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
        };
    };

    return {
        props: { session },
    };
};