import { signOut, useSession } from "next-auth/react";
import { Button, Flex, HStack, Text } from "@chakra-ui/react";
import Link from 'next/link';

const NavBar = () => {
    const { data: session } = useSession();

    return (
        <Flex as="nav" align="center" justify="space-between" padding="1.5rem" bg="blue.500" color="white" marginBottom="20px">
            <HStack spacing={4}>
                <Link href="/" passHref>
                    <Text fontSize="xl" fontWeight="bold" _hover={{ textDecoration: 'underline' }}>
                        Home
                    </Text>
                </Link>
                {session && (
                    <Link href="/vocabulary" passHref>
                        <Text fontSize="xl" fontWeight="bold" _hover={{ textDecoration: 'underline' }}>
                            Vocabulary
                        </Text>
                    </Link>
                )}
            </HStack>
            {session && (
                <Button onClick={() => signOut({ callbackUrl: '/' })} bg="red.400" _hover={{ bg: 'red.600' }}>
                    Sign Out
                </Button>
            )}
        </Flex>
    );
};

export default NavBar;
