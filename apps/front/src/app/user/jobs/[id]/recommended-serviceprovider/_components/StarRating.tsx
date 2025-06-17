import React from 'react';
import { StarIcon } from '@heroicons/react/24/solid'; // Filled star
import { StarIcon as StarIconOutline } from '@heroicons/react/24/outline'; // Outline star

interface StarRatingProps {
  rating: number;
  maxStars?: number; // Optional prop, defaults to 5
}

const StarRating: React.FC<StarRatingProps> = ({ rating, maxStars = 5 }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  const emptyStars = maxStars - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex">
      {[...Array(fullStars)].map((_, i) => (
        <StarIcon key={`full-${i}`} className="h-4 w-4 text-yellow-400" />
      ))}
      {hasHalfStar && (
        // A simple way to represent a half star, you could use a dedicated half-star icon if available
        <div className="relative h-4 w-4">
          <StarIconOutline className="absolute h-4 w-4 text-yellow-400" />
          <div className="absolute overflow-hidden" style={{ width: `${(rating % 1) * 100}%` }}>
            <StarIcon className="h-4 w-4 text-yellow-400" />
          </div>
        </div>
      )}
      {[...Array(emptyStars)].map((_, i) => (
        <StarIconOutline key={`empty-${i}`} className="h-4 w-4 text-gray-300" />
      ))}
    </div>
  );
};

export default StarRating;