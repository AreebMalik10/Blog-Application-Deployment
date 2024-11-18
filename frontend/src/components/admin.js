import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

export default function Admin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // useNavigate hook for navigation

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError(""); // Clear previous errors

    try {
      // Make the POST request to login API
      const response = await axios.post("http://localhost:5000/login", {
        email,
        password,
      });

      // Save token and email to localStorage
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("email", email);

      // Navigate to Admin Dashboard
      navigate("/adminDashboard");

      alert("Login successful");
    } catch (err) {
      // Handle errors
      setError(err.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container bg-gray-50 flex flex-col items-center justify-center " style={{ marginTop: "300px" }}>
      <h2 className='mb-10 text-4xl'>Admin Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="email"
            placeholder='Email'
            value={email}
            className='text-2xl border h-[6vh] rounded'
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <input
            type="password"
            placeholder='Password'
            className='text-2xl mt-10 border h-[6vh] rounded'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <button type="submit" className='mt-6 text-2xl ml-24 bg-blue-400 text-bold' disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </div>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
