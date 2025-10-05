import React, { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import './Reviews.css';

export default function Reviews({ bookId }) {
    const backend_url = process.env.REACT_APP_BACKEND_URL;
    const [reviews, setReviews] = useState([]);
    const [averageRating, setAverageRating] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await fetch(`${backend_url}/review/${bookId}`);
                if (response.ok) {
                    const data = await response.json();
                    setReviews(data);

                    if (data.length > 0) {
                        const avg = data.reduce((acc, r) => acc + r.rating, 0) / data.length;
                        setAverageRating(avg);
                    } else {
                        setAverageRating(0);
                    }
                }
            } catch (error) {
                console.error("Error fetching reviews:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, [bookId, backend_url]);

    if (loading) return <p>Loading reviews...</p>;

    return (
        <div className="reviews-container">
            <h3>Reviews</h3>

            {reviews.length > 0 ? (
                <div className="average-rating">
                    <div className="stars">
                        {[...Array(5)].map((_, i) => (
                            <FaStar
                                key={i}
                                color={i < Math.round(averageRating) ? "#ffc107" : "#e4e5e9"}
                                size={24}
                            />
                        ))}
                    </div>
                    <p className="avg-text">
                        Average rating: <strong>{averageRating.toFixed(1)}</strong> ({reviews.length} reviews)
                    </p>
                </div>
            ) : (
                <p className="no-reviews">No reviews yet — be the first to leave one!</p>
            )}

            <div className="reviews-list">
                {reviews.map((review, index) => (
                    <div key={index} className="review-item">
                        <div className="review-header">
                            <span className="review-user">
                                {review.userName || `User #${review.userId}`}
                            </span>
                            <div className="stars">
                                {[...Array(5)].map((_, i) => (
                                    <FaStar
                                        key={i}
                                        color={i < review.rating ? "#ffc107" : "#e4e5e9"}
                                        size={18}
                                    />
                                ))}
                            </div>
                        </div>
                        <p className="review-text">{review.reviewText}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
