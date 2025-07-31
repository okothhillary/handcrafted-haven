'use client'

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export function CreateReviewButton({ artworkId }: { artworkId: string }) {
  const { data: session } = useSession();
  const router = useRouter();

  const handleCreateReview = () => {
    if (!session) {
      // Redirect to login page with callback URL
      router.push('/auth/login');
    } else {
      // Redirect to create review page
      router.push(`/artworks/${artworkId}/review/create`);
    }
  };

  return (
    <button onClick={handleCreateReview} disabled={!session}>
      Create Review
    </button>
  );
}   