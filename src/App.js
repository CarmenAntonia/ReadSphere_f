import './App.css';
import Login from './Login/Login';
import Register from './Register/Register';
import Home from './Home/Home';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Book from './Book/Book';

function ProtectedRoute({ isLoggedIn, children }) {
  return isLoggedIn ? children : <Navigate to="/" replace />;
}

function App() {
  const isLoggedIn = sessionStorage.getItem('token') || sessionStorage.getItem('userId');

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
            path="/home" 
            element={
              <Home />
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
