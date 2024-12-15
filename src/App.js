import './App.css';
import Login from './Login/Login';
import Register from './Register/Register';
import Home from './Home/Home';
import Header from './components/Header/Header';
import Profile from './Profile/Profile';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Book from './Book/Book';

function ProtectedRoute({ isLoggedIn, children }) {
  return isLoggedIn ? children : <Navigate to="/login" replace />;
}

function App() {
  const isLoggedIn = sessionStorage.getItem('token') || sessionStorage.getItem('userId');
  
  console.log('token:', sessionStorage.getItem('token'));
  console.log('userId:', sessionStorage.getItem('userId'));

  return (
    <Router>
    <div className="App">
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
                    <Header />
                    <Profile />
                  </ProtectedRoute>
                }
              />
          <Route 
            path="/home" 
            element={
              <>
              <Header />
              <Home />
              </>
            } 
          />
        // Add a new route here using the ProtectedRoute component
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
