import './App.css';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import Home from './components/Home/Home';
import Header from './components/Header/Header';
import Profile from './components/Profile/Profile';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Book from './components/Book/Book';

function ProtectedRoute({ isLoggedIn, children }) {
  return isLoggedIn ? children : <Navigate to="/login" replace />;
}

function App() {
  const isLoggedIn = sessionStorage.getItem('token') || sessionStorage.getItem('userId');

  return (
    <Router>
    <div className="App">
     {isLoggedIn && <Header />}
      <Routes>
         <Route 
            path="/" 
            element={!isLoggedIn ? <Login /> : <Navigate to="/home" replace />} 
          />
          <Route 
            path="/register" 
            element={!isLoggedIn ? <Register /> : <Navigate to="/home" replace />} 
          />
          <Route
                path="/profile"
                element={
                  <ProtectedRoute isLoggedIn={isLoggedIn}>
                    <Profile />
                  </ProtectedRoute>
                }
              />
          <Route 
            path="/home" 
            element={
             <Home />
            } 
          />
        <Route
          path="/book/:id"
          element={<ProtectedRoute isLoggedIn={isLoggedIn}><Book /></ProtectedRoute>}
        />
          <Route 
            path="*" 
            element={<Navigate to="/" replace />} 
          />
      </Routes>
    </div>
    </Router>
  );
}

export default App;
