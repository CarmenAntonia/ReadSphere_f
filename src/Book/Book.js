import React, { useState, useEffect } from 'react';
import './Book.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Book() {
    const backendUrl = process.env.REACT_APP_BACKEND_URL;
    const [book, setBook] = useState({});
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

    const addBookToShelf = () => {
        fetch(`${backendUrl}/bookshelves/${userId}/myFutureReadings/add-book/${bookId}`, {
          method: 'POST'
        })
          .then(() => {
            toast.success('Book successfully added to your shelf!', {
                position: "bottom-right",
                autoClose: 3000, 
                hideProgressBar: true,
                pauseOnHover: true,
              });
          })
          .catch((err) => console.error('Error adding book:', err));
      };

    return (
        <div className='book-container'>
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
                        <button className="btn add-btn" 
                        onClick={() => addBookToShelf()}
                        >Add to Shelf</button>
                    </div>
                    <div className="border bottom-border"></div>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
}