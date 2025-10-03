import React, { useState, useEffect } from "react";
import "./SearchBar.css";

const SearchBar = ({ books, setDisplayedBooks }) => {
    const [query, setQuery] = useState("");

    useEffect(() => {
        if (query.trim() === "") {
            // show first 50 books if search is empty
            setDisplayedBooks(books.slice(0, 50));
        } else {
            // filter full books array by title
            const filtered = books
                .filter(book => book.title.toLowerCase().includes(query.toLowerCase()))
                .filter((book, index, self) =>
                    index === self.findIndex(b => b.title === book.title)
                );

            setDisplayedBooks(filtered);

        }
    }, [query, books, setDisplayedBooks]);

    const handleClear = () => {
        setQuery("");
        setDisplayedBooks(books.slice(0, 50));
    };

    return (
        <div className="search-container">
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search books..."
                className="search-input"
            />
            {query && (
                <button className="clear-btn" onClick={handleClear}>
                    ×
                </button>
            )}
        </div>
    );
};

export default SearchBar;
