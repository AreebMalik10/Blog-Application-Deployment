import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserDashboard = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/all-blogs"); // API call to fetch all blogs
        setBlogs(response.data); // Set blogs in state
        setLoading(false); // Stop loading
      } catch (error) {
        setError("Error fetching blogs");
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <p className="text-2xl text-gray-600">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <p className="text-xl text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
      <h2 className="text-4xl font-bold text-gray-800 text-center mb-8">Explore Our Blogs</h2>
      
      {blogs && blogs.length > 0 ? (
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300">
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">{blog.title}</h3>
              <p className="text-gray-600 mb-4">{blog.content.slice(0, 120)}...</p>
              <div className="text-right">
                <a href={`/blogs/${blog._id}`} className="text-indigo-600 font-medium hover:underline">
                  Read more
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600">No blogs available at the moment</p>
      )}
    </div>
  );
};

export default UserDashboard;
