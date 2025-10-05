import React, { useState } from "react";
import { FaStar } from "react-icons/fa";
import './Review.css';

export default function Review({ bookId }) {
    const backend_url = process.env.REACT_APP_BACKEND_URL;
    const userId = sessionStorage.getItem("userId") || sessionStorage.getItem("userIdGoogle");

    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [reviewText, setReviewText] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!rating || !reviewText.trim()) {
            setMessage("Please select a rating and write a review.");
            return;
        }

        const reviewData = {
            userId: Number(userId),
            bookId: Number(bookId),
            rating,
            reviewText
        };

        setSubmitting(true);
        setMessage("");

        try {
            const response = await fetch(`${backend_url}/review`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(reviewData),
                credentials: "include"
            });

            if (response.ok) {
                setMessage("✅ Review submitted successfully!");
                setRating(0);
                setReviewText("");
            } else {
                setMessage("Failed to submit review. Please try again.");
            }
        } catch (error) {
            console.error("Error posting review:", error);
            setMessage("Something went wrong. Try again later.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="review-card">
            <h3>Leave a Review</h3>

            <div className="stars">
                {[...Array(5)].map((_, index) => {
                    const starValue = index + 1;
                    return (
                        <FaStar
                            key={starValue}
                            className="star"
                            color={starValue <= (hover || rating) ? "#ffc107" : "#e4e5e9"}
                            size={30}
                            onClick={() => setRating(starValue)}
                            onMouseEnter={() => setHover(starValue)}
                            onMouseLeave={() => setHover(0)}
                        />
                    );
                })}
            </div>

            <textarea
                placeholder="Write your review..."
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
            />
            <button onClick={handleSubmit} disabled={submitting}>
                {submitting ? "Posting..." : "Post Review"}
            </button>

            {message && <p className="message">{message}</p>}
        </div>
    );
}
