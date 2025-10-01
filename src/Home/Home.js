import { useEffect, useState } from "react";
import './Home.css';

export default function Home () {
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  const [books, setBooks] = useState([]);
  const [displayedBooks, setDisplayedBooks] = useState([]);

   useEffect (() => {
      fetch( `${backendUrl}/token`, {
          method: 'GET',
          credentials: 'include',
      })
      .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json(); 
    })
    .then(token => {
        if(token !== '') {
          sessionStorage.setItem('token', token[0]);
          sessionStorage.setItem('userIdGoogle', token[1]); 
        }
    })
      .catch(error => {
          console.error('Error:', error);
      });
},[backendUrl]);


useEffect(() => {
  fetch(`${backendUrl}/getBooks`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
  },
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(books => {
      setBooks(books);
      setDisplayedBooks(books.slice(0, 50));
    })
    .catch(error => {
      console.error('Error:', error);
    });
  }, [backendUrl]);

  const onClickHandle = (id) => {
    window.location.href = `/book/${id}`;
  }

  return (
      <ul className="books-list">
        {displayedBooks.map(book => (
          <li key={book.bookId} onClick={() => onClickHandle(book.bookId )}>
            <img src={book.coverPictureUrl} alt={book.title} />
            <div className="info">
              <h4>{book.title}</h4>
              <p>{book.author}</p>
            </div>
          </li>
        ))}
      </ul>
  );
}
