import React, { useState, useEffect } from 'react';
import { createAvatar } from '@dicebear/core';
import { adventurer } from '@dicebear/collection';
import './Profile.css';

const Profile = () => {
  const [profilePicture, setProfilePicture] = useState(null);
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [avatarSvg, setAvatarSvg] = useState(null);
  const userId = sessionStorage.getItem('userId');

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
    if (!profilePicture) {
      fetchUserName();
      const avatar = createAvatar(adventurer, { seed: username || 'guest' }).toString();
      setAvatarSvg(avatar);
    }
  }, [profilePicture, username]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setProfilePicture(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const addBookToShelf = (book) => {
    setShelves((prev) => ({
      ...prev,
      [selectedShelf]: [...prev[selectedShelf], book],
    }));
    setShowAddBookPopup(false);
  };

  const removeBookFromShelf = (shelf, bookId) => {
    setShelves((prev) => ({
      ...prev,
      [shelf]: prev[shelf].filter((book) => book.id !== bookId),
    }));
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
        {['myReadings', 'myFutureReadings', 'myCurrentReadings'].map((shelfKey) => (
          <div key={shelfKey} className="shelf">
            <h3>
              {shelfKey === 'myReadings'
                ? 'My Readings'
                : shelfKey === 'myFutureReadings'
                ? 'My Future Readings'
                : 'My Current Readings'}
            </h3>
            <button
              onClick={() => {
                setSelectedShelf(shelfKey);
                setShowAddBookPopup(true);
              }}
            >
              Add Book
            </button>
            <ul className="book-list">
              {shelves[shelfKey].map((book) => (
                <li key={book.id} className="book-item">
                  <img src={book.thumbnail || 'default-cover.png'} alt={book.title} className="book-thumbnail" />
                  <span>{book.title}</span>
                  <button onClick={() => removeBookFromShelf(shelfKey, book.id)}>Delete</button>
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
                <li key={book.id} onClick={() => addBookToShelf(book)}>
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
