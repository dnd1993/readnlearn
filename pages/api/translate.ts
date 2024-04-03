import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
       const { text, targetLang, sourceLang = 'en' } = req.body;
       
       const response = await fetch(`https://translation.googleapis.com/language/translate/v2?key=${process.env.GOOGLE_TRANSLATE_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body:JSON.stringify({
                q: text,
                source: sourceLang,
                target: targetLang,
                format: 'text',
            }),
       });

       const data = await response.json();

       if (response.ok) {
        return res.status(200).json(data);        
       } else {
        return res.status(response.status).json(data);
       }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}