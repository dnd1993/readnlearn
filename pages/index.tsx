import { useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";

export default function Home() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/input')
    }
  }, [status, router]);

    if (status === 'loading') {
      return <div>Loading...</div>
    }

    if (status === 'authenticated') {
      return null;
    }

  return (
    <div>
      <h1>Home Page</h1>
      <button onClick={() => signIn('google')}>Sign In with Google</button>
    </div>
  );
}
