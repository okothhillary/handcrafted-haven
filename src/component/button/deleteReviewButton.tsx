import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export function DeleteReviewButton({ reviewId }: { reviewId: string }) {
  const { data: session } = useSession();
  const router = useRouter();

  const handleDeleteReview = async () => {
    if (!session) {
      // Redirect to login page
      router.push('/auth/login');
      return;
    }

    try {
      const res = await fetch(`/api/reviews/${reviewId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });

      if (res.ok) {
        // Optionally, redirect or update UI after successful deletion
        router.push('/reviews'); // Redirect to reviews page
      } else {
        console.error('Failed to delete review');
      }
    } catch (error) {
      console.error('Error deleting review:', error);
    }
  };

  return (
    <button onClick={handleDeleteReview} disabled={!session}>
      Delete Review
    </button>
  );
}