import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Flex, Box, VStack, Link as ChakraLink, Table, Thead, Tbody, Tr, Th, Td, Heading, IconButton } from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import NavBar from "../../components/NavBar";
import { db } from "../../utils/firebase/config";
import { doc, getDoc } from "firebase/firestore";
import { languageMap } from "../../utils/vocabulary/translation";
import { capitalizeFirstLetter } from "../../utils/vocabulary/capitalizeFirstLetter";

const VocabularyPage = () => {
    const { data: session } = useSession();
    const [selectedLanguage, setSelectedLanguage] = useState(Object.values(languageMap)[0]);
    const [vocabulary, setVocabulary] = useState([]);

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
                    <VocabularyTable words={vocabulary} />
                </Box> 
            </Flex>
        </>
    )
}

const VocabularyTable = ({ words }) => {
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
                {words.length > 0 && words.map((entry, index) => (
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
                            />
                        </Td>
                    </Tr>
                ))}
            </Tbody>
        </Table>
    )
};

export default VocabularyPage;
