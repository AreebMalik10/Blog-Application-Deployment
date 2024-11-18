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

      <Route path="/" element={<UserDashboard />} />
      <Route path="/blogdetails" element={<BlogDetails />} /> {/* BlogDetails route */}
        <Route path="/admin" element={<Admin/>} /> {/* Login Page */}
        <Route path="/adminDashboard" 
        element=
        {
        <PrivateRoute>

          <AdminDashboard />
          
          </PrivateRoute>
        } /> {/* Admin Dashboard */}
        
      </Routes>
    </Router>
  );
}

export default App;
