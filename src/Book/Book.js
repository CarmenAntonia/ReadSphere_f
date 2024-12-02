import React, { useState, useEffect } from 'react';
import './Book.css';

export default function Book() {
    const backendUrl = process.env.REACT_APP_BACKEND_URL;
    const [book, setBook] = useState({});
    const id = parseInt(window.location.pathname.split('/')[2]);

    useEffect(() => {
        fetch(`${backendUrl}/book?id=${id}`,{
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
            console.log(book);
            setBook(book);
        }).catch(error => {
            console.error('Error:', error);
        });
    }, [backendUrl, id]);

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
                        <button className="btn add-btn">Add to Shelf</button>
                    </div>
                    <div className="border bottom-border"></div>
                </div>
            </div>
        </div>
    );
}