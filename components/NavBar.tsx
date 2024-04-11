import { signOut, useSession } from "next-auth/react";

const NavBar = () => {
    const { data: session } = useSession();

    return (
        <nav style={{marginBottom: '20px'}}>
            {session && (
                <button onClick={() => signOut({ callbackUrl: '/' })}>Sign Out</button>
            )}
        </nav>
    )
}

export default NavBar;