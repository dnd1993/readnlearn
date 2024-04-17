import NextAuth from "next-auth";
import GoogleProvider from 'next-auth/providers/google';
import { db } from "../../../utils/firebase/config";
import { doc, setDoc } from "firebase/firestore";

export default NextAuth ({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!
        })
    ],
    callbacks: {
        async signIn({ user }) {
            const userRef = doc(db, 'users', user.id);
            try {
                await setDoc(userRef, {
                    name: user.name,
                    email: user.email,
                    image: user.image
                }, { merge: true });
                console.log("Firestore document for user set/updated during signIn");
                return true; // Continue the sign-in process
            } catch (error) {
                console.error("Error setting Firestore user document:", error);
                // Returning false to stop the sign-in process
                return false;
            }
        },
        async session({ session, token }) {
            if (token.sub) {
                session.user.id = token.sub; // Extend the session object with the user's ID
            }
            return session;
        },
    }
})