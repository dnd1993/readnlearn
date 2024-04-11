import NextAuth from "next-auth";
import GoogleProvider from 'next-auth/providers/google';

export const authOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!
        })
    ],
    pages: {
        signIn: '/auth/signIn',
        callbackUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/input`
    },
}

export default NextAuth(authOptions);