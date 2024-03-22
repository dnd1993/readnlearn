import { FormDataProvider } from '../context/FormDataContext';
import { ChakraProvider } from '@chakra-ui/react';

// This function wraps all page components in the ChakraProvider component
export default function MyApp({ Component, pageProps }) {
  return (
    <FormDataProvider>
        <ChakraProvider>
            <Component {...pageProps} />
        </ChakraProvider>
    </FormDataProvider>
  );
}
