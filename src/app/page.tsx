

import Link from "next/link";

export default function Home() {
 

  return (
    <main>
      <h1>Welcome to HANDCRAFTED-HAVEN</h1>
      <p>
        Home of exotic crafts from around the world.
      </p>
      <Link href="/auth/login">Log in</Link>
      <Link href="/auth/signup">Sign up</Link>
    </main>
  );
}
