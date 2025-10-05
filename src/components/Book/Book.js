import React, { useState, useEffect } from 'react';
import './Book.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Review from "../Review/Review";
import Reviews from "../Reviews/Reviews";

export default function Book() {
    const backendUrl = process.env.REACT_APP_BACKEND_URL;
    const [book, setBook] = useState({});
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedShelf, setSelectedShelf] = useState(null);
    const bookId = parseInt(window.location.pathname.split('/')[2]);
    const userId = sessionStorage.getItem('userId') || sessionStorage.getItem('userIdGoogle');

    useEffect(() => {
        fetch(`${backendUrl}/book?id=${bookId}`,{
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
        }).then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
        }).then(book => {
            setBook(book);
        }).catch(error => {
            console.error('Error:', error);
        });
    }, [backendUrl, bookId]);

    const addBookToShelf = async (shelfType) => {
        const bookshelfDTO = {
            userId: Number(userId),
            bookId: bookId,
            shelfType: shelfType
        };

        console.log(bookshelfDTO);

        try {
            const response = await fetch(`${backendUrl}/bookshelf`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(bookshelfDTO),
                credentials: 'include'
            });

            if (response.ok) {
                toast.success(`Added "${book.title}" to ${shelfType.replace(/_/g, " ").toLowerCase()} shelf!`);
                setShowDropdown(false);
                setSelectedShelf(shelfType);
            } else {
                toast.error("Failed to add the book to your shelf.");
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error("Error connecting to server.");
        }
    };

    return (
        <div className='book-container'>
            <div className="left-column">
                <div className="book">
                    <div className='image-container'>
                        <img src = {book.coverPictureUrl} alt = {book.title} />
                    </div>
                    <div className="info">
                        <h2>{book.title}</h2>
                        <p className='author'>by {book.author}</p>
                    </div>
                    <p className='descr'>Description</p>
                    <p className='book-description'>{book.description}</p>
                    <p>{book.publicationDate}</p>
                    <p>{book.publisher}</p>
                    <div className="buttons">
                        <div className="border top-border"></div>
                        <div className="btn-container">
                            <button className="btn review-btn">Review Book</button>
                            <div className="vertical-border"></div>
                            <button
                                className="btn add-btn"
                                onClick={() => setShowDropdown(!showDropdown)}
                            >
                                {selectedShelf ? `Added to ${selectedShelf.replace(/_/g, " ").toLowerCase()}` : "Add to Shelf"}
                            </button>

                            {showDropdown && (
                                <div className="dropdown">
                                    <button onClick={() => addBookToShelf("READ")}>Read</button>
                                    <button onClick={() => addBookToShelf("CURRENTLY_READING")}>Currently Reading</button>
                                    <button onClick={() => addBookToShelf("WANT_TO_READ")}>Want to Read</button>
                                </div>
                            )}
                        </div>
                        <div className="border bottom-border"></div>
                    </div>
                </div>
                <Review bookId={bookId} />
            </div>
            <div className="right-column">
                <Reviews bookId={bookId} />
            </div>
            <ToastContainer closeButton={false}/>
        </div>
    );
}