import React, { useState, useEffect } from 'react';
import { createAvatar } from '@dicebear/core';
import { adventurer } from '@dicebear/collection';
import './Profile.css';

const Profile = () => {
  const [profilePicture, setProfilePicture] = useState(null);
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [avatarSvg, setAvatarSvg] = useState(null);
  const userId = sessionStorage.getItem('userId') || sessionStorage.getItem('userIdGoogle');
  const [books, setBooks] = useState([]);
  const [shelves, setShelves] = useState({
    myReadings: [],
    myFutureReadings: [],
    myCurrentReadings: [],
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [showAddBookPopup, setShowAddBookPopup] = useState(false);
  const [selectedShelf, setSelectedShelf] = useState('');

  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  const fetchUserName = () => {
        fetch(`${backendUrl}/userName`, {
            method: 'GET',
            credentials: 'include',
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.userName) {
                    setUsername(data.userName);
                }
            })
            .catch((error) => console.error('Error fetching user name:', error));
    };

  useEffect(() => {
    fetch(`${backendUrl}/user/bio?userId=${userId}`)
      .then((res) => res.json())
      .then((data) => setBio(data.bio || 'This is a user bio.'))
      .catch((err) => console.error('Error fetching bio:', err));
  }, [backendUrl]);

  useEffect(() => {
    fetch(`${backendUrl}/getBooks`)
      .then((res) => res.json())
      .then((data) => setBooks(data))
      .catch((err) => console.error('Error fetching books:', err));
  }, [backendUrl]);

  const handleBioSubmit = () => {
    fetch(`${backendUrl}/user/bio?userId=${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ bio }), 
      credentials: 'include',
    })
      .then((response) => {
        if (response.ok) {
          console.log('Bio updated successfully');
        } else {
          console.error('Failed to update bio');
        }
      })
      .catch((error) => console.error('Error updating bio:', error));
  };

  useEffect(() => {
    setFilteredBooks(
      books.filter((book) =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, books]);
  useEffect(() => {
    // Check if a profile picture exists in localStorage
    const storedProfilePicture = localStorage.getItem('profilePicture');
    if (storedProfilePicture) {
      setProfilePicture(storedProfilePicture);
    } else {
      fetchUserName();
      const avatar = createAvatar(adventurer, { seed: username || 'guest' }).toString();
      setAvatarSvg(avatar);
    }
  }, [username]);
  
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64Image = e.target.result;
        setProfilePicture(base64Image);
  
        // Save the Base64 string in localStorage
        localStorage.setItem('profilePicture', base64Image);
      };
      reader.readAsDataURL(file);
    }
    window.location.reload();
  };

  const handleRemovePicture = () => {
    setProfilePicture(null);
    localStorage.removeItem('profilePicture');

    const avatar = createAvatar(adventurer, { seed: username || 'guest' }).toString();
    setAvatarSvg(avatar);
    window.location.reload();
  };

  const fetchShelves = () => {
    fetch(`${backendUrl}/bookshelves/${userId}`, {
      method: 'GET',
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Shelves data fetched:", data);
        const userShelves = {
          myReadings: [],
          myFutureReadings: [],
          myCurrentReadings: [],
        };
  
        data.forEach((shelf) => {
          console.log(`Shelf: ${shelf.shelfName}, Books:`, shelf.books);
          if (shelf.shelfName === 'My Readings') {
            userShelves.myReadings = shelf.books || [];
          } else if (shelf.shelfName === 'My Future Readings') {
            userShelves.myFutureReadings = shelf.books || [];
          } else if (shelf.shelfName === 'My Current Readings') {
            userShelves.myCurrentReadings = shelf.books || [];
          }
        });
  
        console.log("Processed shelves data:", userShelves);
        setShelves(userShelves);
      })
      .catch((err) => console.error('Error fetching shelves:', err));
  };  
  
  const addBookToShelf = (shelfName, book) => {
    console.log('userId:', userId);
    console.log('selectedShelf:', shelfName);
    console.log('book:', book.bookId);
    fetch(`${backendUrl}/bookshelves/${userId}/${shelfName}/add-book/${book.bookId}`, {
      method: 'POST'
    })
      .then(() => {
        setShelves((prev) => ({
          ...prev,
          [selectedShelf]: [...prev[selectedShelf], book],
        }));
        setShowAddBookPopup(false);
      })
      .catch((err) => console.error('Error adding book:', err));
  };
  
  const removeBookFromShelf = (shelf, bookId) => {
    fetch(`${backendUrl}/bookshelves/${userId}/${shelf}/remove-book/${bookId}`, {
      method: 'DELETE',
    })
      .then(() => {
        setShelves((prev) => ({
          ...prev,
          [shelf]: prev[shelf].filter((book) => book.bookId !== bookId),
        }));
        fetchShelves();
      })
      .catch((err) => console.error('Error removing book:', err));
  };

  return (
    <div className="user-profile">
      <div className="profile-header">
        <div className="avatar-container">
          {profilePicture ? (
            <img src={profilePicture} alt="Profile" className="profile-picture" />
          ) : (
            <div
              className="avatar_pp"
              dangerouslySetInnerHTML={{ __html: avatarSvg }}
            />
          )}
          {profilePicture && (
            <button className="remove-picture-btn" onClick={handleRemovePicture}>
              -
            </button>
          )}
          <label className="upload-icon">
            <input type="file" accept="image/*" onChange={handleFileUpload} />
            <span>+</span>
          </label>
        </div>
        <h2>{username}</h2>
        <div className="bio-section">
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Write your bio here..."
            className="bio-textarea"
          />
          <button onClick={handleBioSubmit} className="bio-submit-btn">
            Save Bio
          </button>
        </div>
      </div>

      <div className="shelves">
        {Object.entries(shelves).map(([shelfName, shelfBooks]) => (
          <div key={shelfName} className="shelf">
            <h3>{shelfName}</h3>
            <button
              onClick={() => {
                setSelectedShelf(shelfName);
                setShowAddBookPopup(true);
              }}
            >
              Add Book
            </button>
            <ul className="book-list">
              {shelfBooks.map((book) => (
                <li key={book.bookId} className="book-item">
                  <span>{book.title}</span>
                  <button onClick={() => removeBookFromShelf(shelfName, book.bookId)}>
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {showAddBookPopup && (
        <div className="popup">
          <div className="popup-content">
            <input
              type="text"
              placeholder="Search for books..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <ul>
              {filteredBooks.map((book) => (
                <li key={book.bookId} onClick={() => addBookToShelf(selectedShelf, book)}>
                  {book.title}
                </li>
              ))}
            </ul>
            <button onClick={() => setShowAddBookPopup(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
