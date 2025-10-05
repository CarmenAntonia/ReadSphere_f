import React, { useEffect, useState } from "react";
import './UserShelves.css';

export default function UserShelves() {
    const backend_url = process.env.REACT_APP_BACKEND_URL;
    const userId = sessionStorage.getItem('userId') || sessionStorage.getItem('userIdGoogle');

    const [shelves, setShelves] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openShelves, setOpenShelves] = useState([]);

    useEffect(() => {
        if (!userId) return;

        fetch(`${backend_url}/bookshelf/${userId}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        })
            .then(response => {
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                return response.json();
            })
            .then(data => {
                setShelves(data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching user shelves:', error);
                setLoading(false);
            });
    }, [backend_url, userId]);

    const onClickBook = (bookId) => {
        window.location.href = `/book/${bookId}`;
    }

    const toggleShelf = (type) => {
        if (openShelves.includes(type)) {
            setOpenShelves(openShelves.filter(t => t !== type));
        } else {
            setOpenShelves([...openShelves, type]);
        }
    };


    const filterByShelf = (type) => shelves.filter(book => book.shelfType === type);

    if (loading) return <p>Loading your shelves...</p>;

    return (
        <div className="user-shelves-container">
            {['READ', 'CURRENTLY_READING', 'WANT_TO_READ'].map(type => {
                const booksInShelf = filterByShelf(type);
                const isOpen = openShelves.includes(type);
                return (
                    <div key={type} className="shelf-section">
                        <div className="shelf-header" onClick={() => toggleShelf(type)}>
                            <h2>{type.replace(/_/g, ' ').toLowerCase()}</h2>
                            <span className={`arrow ${isOpen ? 'open' : ''}`}>&#9660;</span>
                        </div>
                        {isOpen && (
                            <ul className="shelves-books-list">
                                {booksInShelf.length === 0 ? (
                                    <p style={{ color: "white" }}>No books in this shelf.</p>
                                ) : (
                                    booksInShelf.map(book => (
                                        <li key={book.bookId} onClick={() => onClickBook(book.bookId)}>
                                            <img src={book.coverPictureUrl} alt={book.title} />
                                            <div className="info">
                                                <h4>{book.title}</h4>
                                                <p>{book.author}</p>
                                            </div>
                                        </li>
                                    ))
                                )}
                            </ul>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
