'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { useAuth } from '@/contexts/AuthContext';

export interface Review {
  id: string;
  productId: number;
  userId: string;
  userName: string;
  rating: number;
  title: string;
  content: string;
  photos: string[];
  date: Date;
  verified: boolean;
  helpful: number;
}

interface ReviewFormProps {
  productId: number;
  onSubmit: (review: Omit<Review, 'id' | 'date' | 'helpful'>) => void;
  onCancel: () => void;
}

export function ReviewForm({ productId, onSubmit, onCancel }: ReviewFormProps) {
  const { state: authState } = useAuth();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authState.user || rating === 0 || !title.trim() || !content.trim()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        productId,
        userId: authState.user.id,
        userName: authState.user.name,
        rating,
        title: title.trim(),
        content: content.trim(),
        photos: [],
        verified: true, // Assume verified for demo
      });
      
      // Reset form
      setRating(0);
      setTitle('');
      setContent('');
    } catch (error) {
      console.error('Error submitting review:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!authState.user) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <i className="ri-user-line text-4xl text-gray-400 mb-4"></i>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Sign in to write a review</h3>
          <p className="text-gray-600 mb-4">Share your experience with other customers</p>
          <Button onClick={() => alert('Please sign in first')}>
            Sign In
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Write a Review</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Rating *
          </label>
          <div className="flex items-center space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className={`text-2xl transition-colors ${
                  star <= (hoverRating || rating)
                    ? 'text-yellow-400'
                    : 'text-gray-300'
                }`}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
              >
                <i className="ri-star-fill"></i>
              </button>
            ))}
            <span className="ml-2 text-sm text-gray-600">
              {rating > 0 && (
                <>
                  {rating} out of 5 stars
                </>
              )}
            </span>
          </div>
        </div>

        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Review Title *
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Summarize your experience"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            required
          />
        </div>

        {/* Content */}
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
            Your Review *
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Tell us about your experience with this product..."
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-vertical"
            required
          />
        </div>

        {/* Actions */}
        <div className="flex gap-4 pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={rating === 0 || !title.trim() || !content.trim() || isSubmitting}
          >
            {isSubmitting ? (
              <>
                <i className="ri-loader-4-line animate-spin mr-2"></i>
                Submitting...
              </>
            ) : (
              'Submit Review'
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
}

interface ReviewDisplayProps {
  review: Review;
  onHelpful?: (reviewId: string) => void;
}

export function ReviewDisplay({ review, onHelpful }: ReviewDisplayProps) {
  const [isHelpful, setIsHelpful] = useState(false);

  const handleHelpful = () => {
    if (onHelpful && !isHelpful) {
      onHelpful(review.id);
      setIsHelpful(true);
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center text-white font-semibold">
            {review.userName.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-medium text-gray-900">{review.userName}</span>
              {review.verified && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  <i className="ri-check-line mr-1"></i>
                  Verified Purchase
                </span>
              )}
            </div>
            <div className="flex items-center space-x-2 mt-1">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <i
                    key={star}
                    className={`ri-star-fill text-sm ${
                      star <= review.rating ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                  ></i>
                ))}
              </div>
              <span className="text-sm text-gray-500">
                {new Date(review.date).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <h4 className="font-semibold text-gray-900 mb-2">{review.title}</h4>
        <p className="text-gray-700 leading-relaxed">{review.content}</p>
      </div>

      {review.photos.length > 0 && (
        <div className="flex space-x-2 mb-4">
          {review.photos.map((photo, index) => (
            <img
              key={index}
              src={photo}
              alt={`Review photo ${index + 1}`}
              className="w-16 h-16 object-cover rounded-md"
            />
          ))}
        </div>
      )}

      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <button
          onClick={handleHelpful}
          className={`flex items-center space-x-2 text-sm transition-colors ${
            isHelpful
              ? 'text-amber-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
          disabled={isHelpful}
        >
          <i className={`ri-thumb-up-${isHelpful ? 'fill' : 'line'}`}></i>
          <span>Helpful ({review.helpful + (isHelpful ? 1 : 0)})</span>
        </button>
      </div>
    </Card>
  );
}

interface ReviewSummaryProps {
  reviews: Review[];
  averageRating: number;
  totalReviews: number;
}

export function ReviewSummary({ reviews, averageRating, totalReviews }: ReviewSummaryProps) {
  const ratingCounts = [0, 0, 0, 0, 0];
  reviews.forEach(review => {
    if (review.rating >= 1 && review.rating <= 5) {
      ratingCounts[review.rating - 1]++;
    }
  });

  const getPercentage = (count: number) => totalReviews > 0 ? (count / totalReviews) * 100 : 0;

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Reviews</h3>
      
      <div className="flex items-center space-x-6 mb-6">
        <div className="text-center">
          <div className="text-3xl font-bold text-gray-900 mb-1">
            {averageRating.toFixed(1)}
          </div>
          <div className="flex items-center justify-center mb-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <i
                key={star}
                className={`ri-star-fill text-lg ${
                  star <= Math.round(averageRating) ? 'text-yellow-400' : 'text-gray-300'
                }`}
              ></i>
            ))}
          </div>
          <div className="text-sm text-gray-600">
            {totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}
          </div>
        </div>

        <div className="flex-1">
          {[5, 4, 3, 2, 1].map((stars) => (
            <div key={stars} className="flex items-center space-x-2 mb-1">
              <span className="text-sm text-gray-600 w-8">{stars}</span>
              <i className="ri-star-fill text-yellow-400 text-sm"></i>
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${getPercentage(ratingCounts[stars - 1])}%` }}
                ></div>
              </div>
              <span className="text-sm text-gray-600 w-8">
                {ratingCounts[stars - 1]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
