import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Admin from './components/admin';
import AdminDashboard from './components/adminDashboard';
import PrivateRoute from './components/privateRoute';
import UserDashboard from './components/userDashboard';
import BlogDetails from './components/blogDetail';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/admin" element={<Admin/>} /> {/* Login Page */}
        <Route path="/adminDashboard" 
        element=
        {
        <PrivateRoute>

          <AdminDashboard />
          
          </PrivateRoute>
        } /> {/* Admin Dashboard */}
        <Route path="/" element={<UserDashboard />} />
        <Route path="/blogs/:id" element={<BlogDetails />} /> {/* BlogDetails route */}
      </Routes>
    </Router>
  );
}

export default App;
