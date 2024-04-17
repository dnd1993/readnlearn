import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Flex, Box, VStack, Link as ChakraLink, Table, Thead, Tbody, Tr, Th, Td, Heading } from "@chakra-ui/react";
import NavBar from "../../components/NavBar";
import { db } from "../../utils/firebase/config";
import { collection, doc, getDoc } from "firebase/firestore";
import { languageMap } from "../../utils/vocabulary/translation";

const VocabularyPage = () => {
    const { data: session } = useSession();
    const [selectedLanguage, setSelectedLanguage] = useState(Object.keys(languageMap)[0]);
    const [vocabulary, setVocabulary] = useState({});

    useEffect(() => {
        if (session) {
            const vocabRef = doc(db, 'users', session.user.id);
            getDoc(vocabRef).then(docSnap => {
                if (docSnap.exists()) {
                    setVocabulary(docSnap.data().vocabulary || {});
                }
            })
        }
    }, [session, selectedLanguage])

    return (
        <>
            <NavBar />
            <Flex>
               <Box width='20%' p={5} borderRight='1px' borderColor='gray.200'>
                    <VStack align='stretch' spacing={4}>
                        {Object.keys(languageMap).map(language => (
                            <ChakraLink
                                key={language}
                                onClick={() => setSelectedLanguage(language)}
                                fontWeight={selectedLanguage === language ? 'bold' : 'normal'}
                                cursor='pointer'
                                _hover={{ color: 'blue.500' }}
                            >
                                {language[0].toUpperCase()}{language.slice(1)}
                            </ChakraLink>
                        ))}
                    </VStack>
                </Box>
                <Box width='80%' p={5}>
                    <Heading mb={4}>{selectedLanguage[0].toUpperCase()}{selectedLanguage.slice(1)}</Heading>
                    <VocabularyTable words={vocabulary[selectedLanguage + 'Words']} />
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
                </Tr>
            </Thead>
            <Tbody>
                {words.map((entry, index) => (
                    <Tr key={index}>
                        <Td>{entry.word}</Td>
                        <Td>{entry.translation}</Td>
                    </Tr>
                ))}
            </Tbody>
        </Table>
    )
};

export default VocabularyPage;
