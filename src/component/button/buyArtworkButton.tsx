import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export function BuyArtworkButton({ artworkId }: { artworkId: string }) {
  const { data: session } = useSession();
  const router = useRouter();

  const handleBuyArtwork = () => {
    if (!session) {
      // Redirect to login page
      router.push('/auth/login');
    } else {
      // Redirect to buy artwork page
      router.push(`/artworks/${artworkId}/buy`);
    }
  };

  return (
    <button onClick={handleBuyArtwork} disabled={!session}>
      Buy Artwork
    </button>
  );
}
