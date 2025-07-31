import {useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export function CreateArtworkButton() {
  const { data: session } = useSession();
  const router = useRouter();

  const handleCreateArtwork = () => {
    if (!session) {
      // Redirect to login page
      router.push('/auth/login');
    } else {
      // Redirect to create artwork page
      router.push('/artworks/create');
    }
  };

  return (
    <button onClick={handleCreateArtwork} disabled={!session}>
      Create Artwork
    </button>
  );
}
