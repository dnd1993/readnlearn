import { SessionProvider } from 'next-auth/react';
import { FormDataProvider } from '../context/FormDataContext';
import { ChakraProvider } from '@chakra-ui/react';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import AuthWrapper from '../components/AuthWrapper';

const queryClient = new QueryClient();

// This function wraps all page components in the ChakraProvider component
export default function MyApp({ Component, pageProps }) {
  return (
    <SessionProvider session={pageProps.session}>
      <AuthWrapper>
        <QueryClientProvider client={queryClient}>
          <ChakraProvider>
            <FormDataProvider>
              <Component {...pageProps} />
            </FormDataProvider>
          </ChakraProvider>
        </QueryClientProvider>
      </AuthWrapper>
    </SessionProvider>
  );
}
