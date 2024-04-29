import { signOut, useSession } from "next-auth/react";
import { Button, Flex, HStack, Text } from "@chakra-ui/react";
import Link from 'next/link';
import { useRouter } from "next/router";

const NavBar = () => {
    const { data: session } = useSession();
    const router = useRouter();

    // Style for the active link
    const activeLinkStyle = {
        textDecoration: 'underline',
        fontWeight: 'extrabold',
    };

    // Function to determine if the link is the current page
    const isActive = (pathname: string) => router.pathname === pathname;

    return (
        <Flex as="nav" align="center" justify="space-between" padding="1.5rem" bg="blue.500" color="white" marginBottom="20px">
            <HStack spacing={4}>
                <Link href="/input" passHref>
                    <Text
                      fontSize="xl"
                      fontWeight="bold"
                      _hover={{ textDecoration: 'underline' }}
                      style={isActive('/input') ? activeLinkStyle : {}}
                    >
                        Input
                    </Text>
                </Link>
                {session && (
                    <Link href="/vocabulary" passHref>
                        <Text
                          fontSize="xl"
                          fontWeight="bold"
                          _hover={{ textDecoration: 'underline' }}
                          style={isActive('/vocabulary') ? activeLinkStyle : {}}
                        >
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
