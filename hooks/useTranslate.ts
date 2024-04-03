import { useQuery } from "@tanstack/react-query";

const fetchTranslation = async ({ queryKey }) => {
    console.log('Fetching translation for key:', queryKey);
    const [_key, { query, sourceLang, targetLang }] = queryKey;
    const response = await fetch('/api/translate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            text: query,
            sourceLang,
            targetLang,
        }),
    });
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
};

export const useTranslate = ({ query, sourceLang, targetLang }) => {
    return useQuery({
        queryKey: ['translate', { query, sourceLang, targetLang }],
        queryFn: fetchTranslation,
        enabled: !!query,
        staleTime: 1000 * 60 * 60 * 24,
    });
};
