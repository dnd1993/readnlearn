import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

const AuthWrapper = ({ children }) => {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === 'loading') return;

        if (!session && router.pathname !== '/') {
            // If not logged in and not on the home page, redirect to home
            router.push('/');
        }

        if (session && router.pathname === '/') {
            // If logged in and on the home page, redirect to the input page
            router.push('/input');
        }
    }, [session, status, router])

    return children;
}

export default AuthWrapper;